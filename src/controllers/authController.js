import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { email, senha, nome_completo, telefone, tipo_perfil } = req.body;

    // Validar entrada
    if (!email || !senha || !nome_completo) {
      return res.status(400).json({ 
        message: 'Email, senha e nome completo são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();

    try {
      // Verificar se email já existe
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10);
      const userId = uuidv4();

      // Inserir usuário
      await connection.query(
        `INSERT INTO users (id, email, nome_completo, telefone, password) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, email, nome_completo, telefone || null, hashedPassword]
      );

      // Inserir perfil
      await connection.query(
        `INSERT INTO profiles (id, nome_completo, telefone, tipo) 
         VALUES (?, ?, ?, ?)`,
        [userId, nome_completo, telefone || null, tipo_perfil || 'embarcador']
      );

      // Inserir role padrão
      await connection.query(
        `INSERT INTO user_roles (id, user_id, role) 
         VALUES (?, ?, ?)`,
        [uuidv4(), userId, 'user']
      );

      // Gerar token
      const token = jwt.sign(
        { id: userId, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        token,
        user: {
          id: userId,
          email,
          nome_completo,
          tipo: tipo_perfil || 'embarcador'
        }
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        'SELECT id, email, nome_completo, password FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(senha, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      // Obter role do usuário
      const [roles] = await connection.query(
        'SELECT role FROM user_roles WHERE user_id = ? LIMIT 1',
        [user.id]
      );

      const token = jwt.sign(
        { id: user.id, role: roles[0]?.role || 'user' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          nome_completo: user.nome_completo
        }
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Obter perfil do usuário
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        `SELECT u.id, u.email, u.nome_completo, u.telefone, u.created_at,
                p.empresa, p.tipo, p.cidade, p.estado
         FROM users u
         LEFT JOIN profiles p ON u.id = p.id
         WHERE u.id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(users[0]);
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil' });
  }
};

// Atualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome_completo, telefone, empresa, cidade, estado } = req.body;

    const connection = await pool.getConnection();

    try {
      // Atualizar usuário
      if (nome_completo || telefone) {
        await connection.query(
          `UPDATE users SET nome_completo = ?, telefone = ? WHERE id = ?`,
          [nome_completo || null, telefone || null, userId]
        );
      }

      // Atualizar perfil
      if (empresa || cidade || estado) {
        await connection.query(
          `UPDATE profiles SET empresa = ?, cidade = ?, estado = ? WHERE id = ?`,
          [empresa || null, cidade || null, estado || null, userId]
        );
      }

      res.json({ message: 'Perfil atualizado com sucesso' });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Solicitar redefinição de senha (Esqueci minha senha)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório' });
    }

    const connection = await pool.getConnection();

    try {
      // Verificar se o usuário existe
      const [users] = await connection.query(
        'SELECT id, nome_completo FROM users WHERE email = ?',
        [email]
      );

      // Retornamos sempre a mesma mensagem por segurança (evita enumeração de e-mails)
      if (users.length === 0) {
        return res.json({
          message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.'
        });
      }

      const user = users[0];

      // Gerar token seguro de 32 bytes
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      // Remover tokens anteriores desse usuário (apenas um ativo por vez)
      await connection.query(
        'DELETE FROM password_reset_tokens WHERE user_id = ?',
        [user.id]
      );

      // Salvar novo token
      await connection.query(
        `INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
         VALUES (?, ?, ?, ?)`,
        [uuidv4(), user.id, resetToken, expiresAt]
      );

      // Enviar e-mail
      await sendPasswordResetEmail(email, resetToken, user.nome_completo);

      res.json({
        message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.'
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ message: 'Erro ao processar solicitação' });
  }
};

// Redefinir senha com token
export const resetPassword = async (req, res) => {
  try {
    const { token, nova_senha } = req.body;

    if (!token || !nova_senha) {
      return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
    }

    if (nova_senha.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const connection = await pool.getConnection();

    try {
      // Buscar token válido e não expirado
      const [tokens] = await connection.query(
        `SELECT prt.id, prt.user_id, prt.expires_at
         FROM password_reset_tokens prt
         WHERE prt.token = ? AND prt.expires_at > NOW()`,
        [token]
      );

      if (tokens.length === 0) {
        return res.status(400).json({
          message: 'Token inválido ou expirado. Solicite uma nova redefinição de senha.'
        });
      }

      const resetRecord = tokens[0];

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(nova_senha, 10);

      // Atualizar senha do usuário
      await connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, resetRecord.user_id]
      );

      // Invalidar o token usado
      await connection.query(
        'DELETE FROM password_reset_tokens WHERE id = ?',
        [resetRecord.id]
      );

      res.json({ message: 'Senha redefinida com sucesso! Faça login com sua nova senha.' });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
};
