import express from 'express';
import { listSubscriptions, liberarAcesso, revogarAcesso } from '../controllers/adminController.js';

const router = express.Router();

/**
 * Rotas administrativas — protegidas pelo header X-Admin-Secret
 *
 * GET  /api/admin/subscriptions?email=...   → Lista assinaturas
 * POST /api/admin/subscriptions/liberar     → Libera acesso (ACTIVE)
 * POST /api/admin/subscriptions/revogar     → Revoga acesso (CANCELLED)
 */
router.get('/subscriptions', listSubscriptions);
router.post('/subscriptions/liberar', liberarAcesso);
router.post('/subscriptions/revogar', revogarAcesso);

export default router;
