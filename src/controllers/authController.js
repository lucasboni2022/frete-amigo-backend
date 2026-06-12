import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

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
