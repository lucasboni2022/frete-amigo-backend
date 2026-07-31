import express from 'express';
import { hotmartWebhook } from '../controllers/hotmartWebhookController.js';

const router = express.Router();

/**
 * POST /verificar-plano
 * Endpoint público recebido pela Hotmart via Webhook.
 *
 * Nome da configuração na Hotmart: frete-amigo-webhook
 * URL configurada: https://freteamigo.com.br/verificar-plano
 *
 * Não requer autenticação JWT — a Hotmart envia o hottok como verificação.
 */
router.post('/', hotmartWebhook);

export default router;
