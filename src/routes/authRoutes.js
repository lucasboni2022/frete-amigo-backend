import express from 'express';
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Rotas protegidas
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
