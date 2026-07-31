import pool from '../config/database.js';

// Script para inicializar o banco de dados
const initDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Nota: Banco de dados deve ser criado manualmente no servidor
    // O usuário não tem permissão para criar bancos, apenas usar o existente

    // Tabela de usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) NOT NULL,
        email VARCHAR(255) NOT NULL,
        nome_completo VARCHAR(255) NULL,
        telefone VARCHAR(30) NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de perfis
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id CHAR(36) NOT NULL,
        nome_completo TEXT NOT NULL,
        telefone VARCHAR(30) NULL,
        empresa VARCHAR(255) NULL,
        tipo ENUM('motorista', 'embarcador', 'transportadora') NOT NULL DEFAULT 'embarcador',
        cidade VARCHAR(255) NULL,
        estado VARCHAR(255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_profiles_user
          FOREIGN KEY (id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de papéis de usuário
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id CHAR(36) NOT NULL,
        user_id CHAR(36) NOT NULL,
        role ENUM('admin', 'user') NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_user_roles_user_role (user_id, role),
        KEY idx_user_roles_user_id (user_id),
        CONSTRAINT fk_user_roles_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de cargas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cargas (
        id CHAR(36) NOT NULL,
        user_id CHAR(36) NOT NULL,
        origem_cidade VARCHAR(255) NOT NULL,
        origem_estado VARCHAR(255) NOT NULL,
        destino_cidade VARCHAR(255) NOT NULL,
        destino_estado VARCHAR(255) NOT NULL,
        data_coleta DATE NOT NULL,
        tipo_carga VARCHAR(255) NOT NULL,
        peso_kg DECIMAL(10,2) NOT NULL,
        valor_frete DECIMAL(10,2) NULL,
        tipo_veiculo VARCHAR(255) NOT NULL,
        tipo_carroceria VARCHAR(255) NULL,
        observacoes TEXT NULL,
        status ENUM('aguardando_motorista','contato_liberado','finalizada') NOT NULL DEFAULT 'aguardando_motorista',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_cargas_status (status),
        KEY idx_cargas_origem (origem_estado, origem_cidade),
        KEY idx_cargas_destino (destino_estado, destino_cidade),
        KEY idx_cargas_user_id (user_id),
        CONSTRAINT fk_cargas_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Migration: atualizar ENUM de status se tabela já existia com valores antigos
    try {
      await connection.query(`
        ALTER TABLE cargas
          MODIFY COLUMN status
          ENUM('aguardando_motorista','contato_liberado','finalizada')
          NOT NULL DEFAULT 'aguardando_motorista'
      `);
      // Migrar dados legados
      await connection.query(`
        UPDATE cargas SET status = 'aguardando_motorista'
        WHERE status NOT IN ('aguardando_motorista','contato_liberado','finalizada')
           OR status IS NULL
      `);
    } catch (migrationErr) {
      // Ignora erro se ENUM já está correto
      if (!migrationErr.message?.includes('aguardando_motorista')) {
        console.warn('Migration status cargas (pode ser ignorado se já aplicado):', migrationErr.message);
      }
    }

    // Tabela de tokens de redefinição de senha
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_prt_token (token),
        INDEX idx_prt_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabela de assinaturas Hotmart (atualizada via webhook em tempo real)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotmart_subscriptions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        subscriber_email VARCHAR(255) NOT NULL,
        subscriber_name  VARCHAR(255) NULL,
        subscription_code VARCHAR(100) NULL,
        product_id VARCHAR(100) NULL,
        plan_name  VARCHAR(255) NULL,
        status ENUM(
          'ACTIVE','DELAYED','INACTIVE','STARTED',
          'EXPIRED','CANCELLED','CHARGEBACK','PENDING'
        ) NOT NULL DEFAULT 'INACTIVE',
        event_type VARCHAR(100) NULL COMMENT 'Último evento Hotmart processado',
        hotmart_data JSON NULL COMMENT 'Payload completo do último evento',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_hs_email (subscriber_email),
        INDEX idx_hs_status (status),
        UNIQUE KEY uq_hs_email_product (subscriber_email, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  } finally {
    await connection.release();
  }
};

export default initDatabase;
