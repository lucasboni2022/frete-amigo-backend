import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import { hasActivePlan } from '../services/hotmartService.js';


// Criar nova carga
export const createCarga = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      origem_cidade,
      origem_estado,
      destino_cidade,
      destino_estado,
      data_coleta,
      tipo_carga,
      peso_kg,
      valor_frete,
      tipo_veiculo,
      tipo_carroceria,
      observacoes
    } = req.body;

    // Validações básicas
    if (!origem_cidade || !origem_estado || !destino_cidade || !destino_estado || !tipo_carga || !peso_kg || !tipo_veiculo) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
    }

    const cargaId = uuidv4();
    const connection = await pool.getConnection();

    try {
      await connection.query(
        `INSERT INTO cargas (
          id, user_id, origem_cidade, origem_estado, destino_cidade, destino_estado,
          data_coleta, tipo_carga, peso_kg, valor_frete, tipo_veiculo, tipo_carroceria, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cargaId, userId, origem_cidade, origem_estado, destino_cidade, destino_estado,
          data_coleta, tipo_carga, peso_kg, valor_frete || null, tipo_veiculo, tipo_carroceria || null, observacoes || null
        ]
      );

      res.status(201).json({
        message: 'Carga criada com sucesso',
        carga: {
          id: cargaId,
          user_id: userId,
          origem_cidade,
          origem_estado,
          destino_cidade,
          destino_estado,
          data_coleta,
          tipo_carga,
          peso_kg,
          tipo_veiculo,
          status: 'aguardando_motorista'
        }
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar carga:', error);
    res.status(500).json({ message: 'Erro ao criar carga' });
  }
};

// Listar cargas com filtros
export const listCargas = async (req, res) => {
  try {
    const { origem_estado, destino_estado, tipo_veiculo, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT *, DATE_FORMAT(data_coleta, '%Y-%m-%d') as data_coleta FROM cargas WHERE 1=1`;
    const params = [];

    if (origem_estado) {
      query += ' AND origem_estado = ?';
      params.push(origem_estado);
    }

    if (destino_estado) {
      query += ' AND destino_estado = ?';
      params.push(destino_estado);
    }

    if (tipo_veiculo) {
      query += ' AND tipo_veiculo = ?';
      params.push(tipo_veiculo);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();

    try {
      const [cargas] = await connection.query(query, params);
      
      // Contar total de cargas
      let countQuery = 'SELECT COUNT(*) as total FROM cargas WHERE 1=1';
      const countParams = [];
      
      if (origem_estado) {
        countQuery += ' AND origem_estado = ?';
        countParams.push(origem_estado);
      }
      if (destino_estado) {
        countQuery += ' AND destino_estado = ?';
        countParams.push(destino_estado);
      }
      if (tipo_veiculo) {
        countQuery += ' AND tipo_veiculo = ?';
        countParams.push(tipo_veiculo);
      }
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      const [countResult] = await connection.query(countQuery, countParams);
      const total = countResult[0].total;

      res.json({
        cargas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao listar cargas:', error);
    res.status(500).json({ message: 'Erro ao listar cargas' });
  }
};

// Obter carga por ID
export const getCargaById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
      const [cargas] = await connection.query(
        `SELECT c.*, DATE_FORMAT(c.data_coleta, '%Y-%m-%d') as data_coleta,
                u.nome_completo as user_name, u.email, u.telefone
         FROM cargas c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
      );

      if (cargas.length === 0) {
        return res.status(404).json({ message: 'Carga não encontrada' });
      }

      res.json(cargas[0]);
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao obter carga:', error);
    res.status(500).json({ message: 'Erro ao obter carga' });
  }
};

// Atualizar carga
export const updateCarga = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { valor_frete, status, tipo_carroceria, observacoes } = req.body;

    const connection = await pool.getConnection();

    try {
      // Verificar se a carga pertence ao usuário
      const [cargas] = await connection.query(
        'SELECT user_id, status FROM cargas WHERE id = ?',
        [id]
      );

      if (cargas.length === 0) {
        return res.status(404).json({ message: 'Carga não encontrada' });
      }

      if (cargas[0].user_id !== userId && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Sem permissão para atualizar esta carga' });
      }

      // Bloquear edição se carga não está aguardando motorista
      if (cargas[0].status !== 'aguardando_motorista' && req.userRole !== 'admin') {
        return res.status(403).json({
          message: 'Não é possível editar uma carga que já possui solicitações ou está finalizada.'
        });
      }

      // Validar novo status
      const statusValidos = ['aguardando_motorista', 'contato_liberado', 'finalizada'];
      const novoStatus = status && statusValidos.includes(status) ? status : cargas[0].status;

      // Atualizar carga
      await connection.query(
        `UPDATE cargas SET valor_frete = ?, status = ?, tipo_carroceria = ?, observacoes = ? WHERE id = ?`,
        [valor_frete || null, novoStatus, tipo_carroceria || null, observacoes || null, id]
      );

      res.json({ message: 'Carga atualizada com sucesso' });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar carga:', error);
    res.status(500).json({ message: 'Erro ao atualizar carga' });
  }
};

// Deletar carga
export const deleteCarga = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const connection = await pool.getConnection();

    try {
      // Verificar se a carga pertence ao usuário
      const [cargas] = await connection.query(
        'SELECT user_id, status FROM cargas WHERE id = ?',
        [id]
      );

      if (cargas.length === 0) {
        return res.status(404).json({ message: 'Carga não encontrada' });
      }

      if (cargas[0].user_id !== userId && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Sem permissão para deletar esta carga' });
      }

      // Bloquear exclusão se carga não está aguardando motorista
      if (cargas[0].status !== 'aguardando_motorista' && req.userRole !== 'admin') {
        return res.status(403).json({
          message: 'Não é possível excluir uma carga que já possui solicitações ou está finalizada.'
        });
      }

      await connection.query('DELETE FROM cargas WHERE id = ?', [id]);

      res.json({ message: 'Carga deletada com sucesso' });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao deletar carga:', error);
    res.status(500).json({ message: 'Erro ao deletar carga' });
  }
};

// Listar cargas do usuário
export const getMyCargos = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT *, DATE_FORMAT(data_coleta, '%Y-%m-%d') as data_coleta FROM cargas WHERE user_id = ?`;
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const connection = await pool.getConnection();

    try {
      const [cargas] = await connection.query(query, params);
      
      // Contar total
      let countQuery = 'SELECT COUNT(*) as total FROM cargas WHERE user_id = ?';
      const countParams = [userId];
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }

      const [countResult] = await connection.query(countQuery, countParams);
      const total = countResult[0].total;

      res.json({
        cargas,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao listar minhas cargas:', error);
    res.status(500).json({ message: 'Erro ao listar minhas cargas' });
  }
};

// Obter contato do embarcador (requer plano ativo na Hotmart)
export const getEmbarcadorContato = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const connection = await pool.getConnection();

    try {
      // 1. Buscar e-mail do usuário logado
      const [users] = await connection.query(
        'SELECT email FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const userEmail = users[0].email;

      // 2. Verificar assinatura ativa na Hotmart (chamada em tempo real)
      const planActive = await hasActivePlan(userEmail);

      if (!planActive) {
        return res.status(403).json({
          message: 'Plano necessário para ver o contato do embarcador.',
          plano_required: true,
        });
      }

      // 3. Buscar dados de contato da carga
      const [cargas] = await connection.query(
        `SELECT c.contato_telefone, c.contato_email,
                u.nome_completo as embarcador_nome, u.telefone as embarcador_telefone, u.email as embarcador_email
         FROM cargas c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [id]
      );

      if (cargas.length === 0) {
        return res.status(404).json({ message: 'Carga não encontrada' });
      }

      const carga = cargas[0];

      // Retorna os dados de contato disponíveis
      // Prioriza contato_telefone/contato_email da carga; usa dados do dono como fallback
      res.json({
        contato_telefone: carga.contato_telefone || carga.embarcador_telefone || null,
        contato_email: carga.contato_email || carga.embarcador_email || null,
        embarcador_nome: carga.embarcador_nome || null,
      });
    } finally {
      await connection.release();
    }
  } catch (error) {
    console.error('Erro ao obter contato do embarcador:', error);
    res.status(500).json({ message: 'Erro ao obter contato do embarcador' });
  }
};
