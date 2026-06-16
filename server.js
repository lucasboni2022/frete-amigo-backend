import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import cargasRoutes from './src/routes/cargasRoutes.js';
import pool from './src/config/database.js';
import initDatabase from './src/db/initDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS liberado para todas as origens
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/cargas', cargasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend está funcionando' });
});

// Inicializar banco e iniciar servidor
const startServer = async () => {
  try {
    // Testar conexão com banco
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    await connection.release();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Inicializar banco de dados
    await initDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 API disponível em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
