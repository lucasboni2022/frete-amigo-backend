/**
 * hotmartWebhookController.js
 *
 * Processa todos os eventos enviados pela Hotmart via Webhook.
 * Endpoint: POST /verificar-plano
 *
 * Eventos suportados e mapeamento de status:
 *
 *   PURCHASE_APPROVED / SUBSCRIPTION_PURCHASE_APPROVED → ACTIVE
 *   PURCHASE_COMPLETE                                   → ACTIVE
 *   PURCHASE_BILLET_PRINTED (aguardando pagamento)      → PENDING
 *   PURCHASE_DELAYED                                    → DELAYED
 *   PURCHASE_REFUNDED / PURCHASE_REVERSED               → CANCELLED
 *   PURCHASE_CHARGEBACK                                 → CHARGEBACK
 *   PURCHASE_EXPIRED                                    → EXPIRED
 *   PURCHASE_CANCELED                                   → CANCELLED
 *   SUBSCRIPTION_CANCELLATION                           → CANCELLED
 *   SWITCH_PLAN                                         → ACTIVE (troca de plano)
 *   CLUB_FIRST_ACCESS / PURCHASE_PROTEST (outros)       → sem alteração de status
 *   ABANDONED_CART / UPDATE_SUBSCRIPTION_CHARGE_DATE    → sem alteração de status (apenas log)
 */

import pool from '../config/database.js';

// Mapeamento evento Hotmart → status interno
const EVENT_STATUS_MAP = {
  PURCHASE_APPROVED:              'ACTIVE',
  SUBSCRIPTION_PURCHASE_APPROVED: 'ACTIVE',
  PURCHASE_COMPLETE:              'ACTIVE',
  SWITCH_PLAN:                    'ACTIVE',
  PURCHASE_BILLET_PRINTED:        'PENDING',   // Aguardando pagamento
  PURCHASE_DELAYED:               'DELAYED',   // Compra atrasada
  PURCHASE_REFUNDED:              'CANCELLED', // Compra reembolsada
  PURCHASE_REVERSED:              'CANCELLED', // Pedido de reembolso aprovado
  PURCHASE_CHARGEBACK:            'CHARGEBACK',
  PURCHASE_EXPIRED:               'EXPIRED',   // Compra expirada
  PURCHASE_CANCELED:              'CANCELLED', // Compra cancelada
  SUBSCRIPTION_CANCELLATION:      'CANCELLED', // Cancelamento de assinatura
};

// Eventos que apenas logamos mas não alteram status
const LOG_ONLY_EVENTS = new Set([
  'ABANDONED_CART',               // Abandono de carrinho
  'UPDATE_SUBSCRIPTION_CHARGE_DATE', // Atualização de data de cobrança
  'CLUB_FIRST_ACCESS',            // Primeiro acesso
  'FULFILLMENT',                  // Dados logísticos
  'CLUB_MODULE_COMPLETE',         // Módulo completo
]);

/**
 * Extrai os dados relevantes do payload da Hotmart.
 * A Hotmart envia diferentes estruturas dependendo do evento,
 * mas o padrão geral é { event, data: { buyer, product, subscription, ... } }
 */
function extractPayloadData(body) {
  const event = body?.event || body?.hottok || 'UNKNOWN';
  const data  = body?.data || body;

  // Dados do comprador/assinante
  const buyer = data?.buyer || data?.subscriber || {};
  const email = (buyer?.email || data?.buyer_email || '').toLowerCase().trim();
  const name  = buyer?.name || buyer?.name_full || '';

  // Dados da assinatura
  const subscription = data?.subscription || {};
  const subscriptionCode = subscription?.subscriber?.code || data?.subscription_id || null;
  const planName = subscription?.plan?.name || data?.plan?.name || null;

  // Dados do produto
  const product = data?.product || {};
  const productId = String(product?.id || data?.product_id || process.env.HOTMART_PRODUCT_ID || '').trim() || null;

  return { event, email, name, subscriptionCode, planName, productId };
}

/**
 * POST /verificar-plano
 * Recebe e processa eventos de webhook da Hotmart.
 */
export const hotmartWebhook = async (req, res) => {
  const body = req.body;

  // ── Validação do hottok ───────────────────────────────────────────────────
  // A Hotmart envia o hottok no body ou como query param para autenticar a origem.
  const expectedHottok = process.env.HOTMART_HOTTOK;
  const receivedHottok = body?.hottok || req.query?.hottok;

  if (expectedHottok && receivedHottok !== expectedHottok) {
    console.warn(`[HotmartWebhook] ⚠️  Hottok inválido recebido: ${receivedHottok}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Responde 200 imediatamente para a Hotmart não fazer retry desnecessário
  res.status(200).json({ received: true });

  try {
    const { event, email, name, subscriptionCode, planName, productId } = extractPayloadData(body);

    console.log(`[HotmartWebhook] Evento recebido: ${event} | Email: ${email || 'N/A'}`);

    // Eventos apenas de log — não alteram o banco
    if (LOG_ONLY_EVENTS.has(event)) {
      console.log(`[HotmartWebhook] Evento de log: ${event} — sem alteração de status.`);
      return;
    }

    // Mapeia o evento para o status interno
    const newStatus = EVENT_STATUS_MAP[event];
    if (!newStatus) {
      console.warn(`[HotmartWebhook] Evento não mapeado: ${event} — ignorado.`);
      return;
    }

    if (!email) {
      console.warn(`[HotmartWebhook] Email não encontrado no payload do evento: ${event}`);
      return;
    }

    const connection = await pool.getConnection();
    try {
      // UPSERT: atualiza se já existe registro para esse email+produto, cria caso contrário
      await connection.query(
        `INSERT INTO hotmart_subscriptions
           (subscriber_email, subscriber_name, subscription_code, product_id, plan_name, status, event_type, hotmart_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           subscriber_name    = VALUES(subscriber_name),
           subscription_code  = VALUES(subscription_code),
           plan_name          = VALUES(plan_name),
           status             = VALUES(status),
           event_type         = VALUES(event_type),
           hotmart_data       = VALUES(hotmart_data),
           updated_at         = CURRENT_TIMESTAMP`,
        [
          email,
          name || null,
          subscriptionCode,
          productId,
          planName || null,
          newStatus,
          event,
          JSON.stringify(body),
        ]
      );

      console.log(`[HotmartWebhook] ✅ Status atualizado: ${email} → ${newStatus} (evento: ${event})`);
    } finally {
      connection.release();
    }

  } catch (err) {
    // Já enviamos 200 — só logamos o erro internamente
    console.error('[HotmartWebhook] ❌ Erro ao processar webhook:', err.message);
  }
};
