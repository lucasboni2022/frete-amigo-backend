/**
 * adminController.js
 *
 * Endpoints administrativos protegidos por ADMIN_SECRET no header.
 * Usados para gerenciar assinaturas manualmente quando o webhook da Hotmart falha.
 */

import pool from '../config/database.js';

// Verifica o segredo admin no header X-Admin-Secret
function checkAdminSecret(req, res) {
  const secret = req.headers['x-admin-secret'];
  const expected = process.env.ADMIN_SECRET;

  if (!expected) {
    res.status(500).json({ message: 'ADMIN_SECRET não configurado no servidor.' });
    return false;
  }
  if (secret !== expected) {
    res.status(401).json({ message: 'Acesso não autorizado.' });
    return false;
  }
  return true;
}

/**
 * GET /api/admin/subscriptions?email=xxx
 * Lista assinaturas (todas ou filtradas por email).
 */
export const listSubscriptions = async (req, res) => {
  if (!checkAdminSecret(req, res)) return;

  const { email } = req.query;
  const connection = await pool.getConnection();
  try {
    let query = 'SELECT * FROM hotmart_subscriptions';
    const params = [];
    if (email) {
      query += ' WHERE subscriber_email LIKE ?';
      params.push(`%${email.toLowerCase().trim()}%`);
    }
    query += ' ORDER BY updated_at DESC LIMIT 100';

    const [rows] = await connection.query(query, params);
    res.json({ total: rows.length, subscriptions: rows });
  } finally {
    connection.release();
  }
};

/**
 * POST /api/admin/subscriptions/liberar
 * Body: { email: "...", plan_name: "Opcional" }
 *
 * Cria ou atualiza a assinatura com status ACTIVE.
 * Usar quando o webhook da Hotmart não chegou mas o pagamento foi confirmado.
 */
export const liberarAcesso = async (req, res) => {
  if (!checkAdminSecret(req, res)) return;

  const { email, plan_name } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Campo obrigatório: email' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.query(
      `INSERT INTO hotmart_subscriptions
         (subscriber_email, subscriber_name, subscription_code, product_id, plan_name, status, event_type, hotmart_data)
       VALUES (?, NULL, NULL, ?, ?, 'ACTIVE', 'MANUAL_LIBERACAO', '{"manual":true}')
       ON DUPLICATE KEY UPDATE
         plan_name  = COALESCE(VALUES(plan_name), plan_name),
         status     = 'ACTIVE',
         event_type = 'MANUAL_LIBERACAO',
         updated_at = CURRENT_TIMESTAMP`,
      [
        email.toLowerCase().trim(),
        process.env.HOTMART_PRODUCT_ID || null,
        plan_name || null,
      ]
    );

    console.log(`[Admin] ✅ Acesso liberado manualmente para: ${email}`);
    res.json({ message: `Acesso liberado com sucesso para ${email}`, status: 'ACTIVE' });
  } finally {
    connection.release();
  }
};

/**
 * POST /api/admin/subscriptions/revogar
 * Body: { email: "..." }
 *
 * Revoga o acesso de um assinante (status → CANCELLED).
 */
export const revogarAcesso = async (req, res) => {
  if (!checkAdminSecret(req, res)) return;

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Campo obrigatório: email' });
  }

  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE hotmart_subscriptions
       SET status = 'CANCELLED', event_type = 'MANUAL_REVOGACAO', updated_at = CURRENT_TIMESTAMP
       WHERE subscriber_email = ?`,
      [email.toLowerCase().trim()]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Nenhuma assinatura encontrada para: ${email}` });
    }

    console.log(`[Admin] ⛔ Acesso revogado manualmente para: ${email}`);
    res.json({ message: `Acesso revogado para ${email}`, status: 'CANCELLED' });
  } finally {
    connection.release();
  }
};
