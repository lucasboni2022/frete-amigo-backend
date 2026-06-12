-- Schema SQL separado para FreteBR Backend
-- Copie e execute este arquivo no MySQL Workbench ou CLI se a inicialização automática falhar

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS frete_amigo 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE frete_amigo;

-- Tabela de usuários
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

-- Tabela de perfis
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

-- Tabela de papéis de usuário
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

-- Tabela de cargas
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
  status ENUM('ativa', 'negociando', 'fechada', 'cancelada') NOT NULL DEFAULT 'ativa',
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
