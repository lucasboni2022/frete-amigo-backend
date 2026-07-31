import express from 'express';
import {
  createCarga,
  listCargas,
  getCargaById,
  updateCarga,
  deleteCarga,
  getMyCargos,
  getEmbarcadorContato
} from '../controllers/cargasController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', listCargas);
router.get('/:id', getCargaById);

// Rotas protegidas
router.post('/', verifyToken, createCarga);
router.put('/:id', verifyToken, updateCarga);
router.delete('/:id', verifyToken, deleteCarga);
router.get('/my-cargas/list', verifyToken, getMyCargos);
// Verificação de plano Hotmart → libera contato do embarcador
router.get('/:id/contato', verifyToken, getEmbarcadorContato);

export default router;
