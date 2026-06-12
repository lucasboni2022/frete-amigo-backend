-- ================================================================
-- SCRIPT SQL COMPLETO - FreteBR Backend
-- ================================================================
-- 
-- INSTRUÇÕES DE USO:
-- 
-- 1. OPÇÃO A - MySQL Workbench:
--    a) Abra MySQL Workbench
--    b) Clique em "File" > "Open SQL Script"
--    c) Selecione este arquivo
--    d) Clique em "Execute All" (raio ⚡)
--    e) Pronto! Banco criado com todas as tabelas
--
-- 2. OPÇÃO B - Command Line:
--    mysql -u root -p < Script/CREATE_TABLES.sql
--    (Digite sua senha quando pedido)
--
-- ================================================================

-- Configurações iniciais
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET time_zone = '+00:00';

-- ================================================================
-- 1. CRIAR BANCO DE DADOS
-- ================================================================

CREATE DATABASE IF NOT EXISTS u212116958_bd_frete_amigo 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE u212116958_bd_frete_amigo;

-- ================================================================
-- 2. TABELA: USERS (Usuários)
-- ================================================================
-- Armazena dados básicos dos usuários da plataforma

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL COMMENT 'UUID do usuário',
  email VARCHAR(255) NOT NULL COMMENT 'Email único do usuário',
  nome_completo VARCHAR(255) NULL COMMENT 'Nome completo',
  telefone VARCHAR(30) NULL COMMENT 'Telefone de contato',
  password VARCHAR(255) NOT NULL COMMENT 'Senha hasheada com bcrypt',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_email (email),
  KEY idx_users_created_at (created_at)
  
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Usuários da plataforma FreteBR';

-- ================================================================
-- 3. TABELA: PROFILES (Perfis de Usuário)
-- ================================================================
-- Armazena dados detalhados e tipo de usuário

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) NOT NULL COMMENT 'FK para users.id',
  nome_completo TEXT NOT NULL COMMENT 'Nome completo do usuário',
  telefone VARCHAR(30) NULL COMMENT 'Telefone de contato',
  empresa VARCHAR(255) NULL COMMENT 'Nome da empresa',
  tipo ENUM('motorista', 'embarcador', 'transportadora') NOT NULL DEFAULT 'embarcador' COMMENT 'Tipo de usuário',
  cidade VARCHAR(255) NULL COMMENT 'Cidade',
  estado VARCHAR(255) NULL COMMENT 'Estado/UF',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',
  
  PRIMARY KEY (id),
  KEY idx_profiles_tipo (tipo),
  KEY idx_profiles_estado (estado),
  KEY idx_profiles_cidade (cidade),
  
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Perfis detalhados dos usuários';

-- ================================================================
-- 4. TABELA: USER_ROLES (Papéis de Usuário)
-- ================================================================
-- Armazena papéis/permissões dos usuários

CREATE TABLE IF NOT EXISTS user_roles (
  id CHAR(36) NOT NULL COMMENT 'UUID da role',
  user_id CHAR(36) NOT NULL COMMENT 'FK para users.id',
  role ENUM('admin', 'user') NOT NULL COMMENT 'Tipo de papel',
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_roles_user_role (user_id, role),
  KEY idx_user_roles_user_id (user_id),
  KEY idx_user_roles_role (role),
  
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Papéis e permissões dos usuários';

-- ================================================================
-- 5. TABELA: CARGAS (Cargas/Fretes)
-- ================================================================
-- Armazena dados das cargas publicadas

CREATE TABLE IF NOT EXISTS cargas (
  id CHAR(36) NOT NULL COMMENT 'UUID da carga',
  user_id CHAR(36) NOT NULL COMMENT 'FK para users.id (publicador)',
  origem_cidade VARCHAR(255) NOT NULL COMMENT 'Cidade de origem',
  origem_estado VARCHAR(255) NOT NULL COMMENT 'Estado/UF de origem',
  destino_cidade VARCHAR(255) NOT NULL COMMENT 'Cidade de destino',
  destino_estado VARCHAR(255) NOT NULL COMMENT 'Estado/UF de destino',
  data_coleta DATE NOT NULL COMMENT 'Data da coleta',
  tipo_carga VARCHAR(255) NOT NULL COMMENT 'Tipo de carga (ex: Eletrônicos)',
  peso_kg DECIMAL(10,2) NOT NULL COMMENT 'Peso em quilogramas',
  valor_frete DECIMAL(10,2) NULL COMMENT 'Valor proposto para frete',
  tipo_veiculo VARCHAR(255) NOT NULL COMMENT 'Tipo de veículo (Truck, Carreta, etc)',
  tipo_carroceria VARCHAR(255) NULL COMMENT 'Tipo de carroceria (Baú, Graneleira, etc)',
  observacoes TEXT NULL COMMENT 'Observações adicionais',
  status ENUM('ativa', 'negociando', 'fechada', 'cancelada') NOT NULL DEFAULT 'ativa' COMMENT 'Status da carga',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização',
  
  PRIMARY KEY (id),
  KEY idx_cargas_status (status),
  KEY idx_cargas_origem (origem_estado, origem_cidade),
  KEY idx_cargas_destino (destino_estado, destino_cidade),
  KEY idx_cargas_user_id (user_id),
  KEY idx_cargas_created_at (created_at),
  KEY idx_cargas_data_coleta (data_coleta),
  
  CONSTRAINT fk_cargas_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Cargas/Fretes publicadas na plataforma';

-- ================================================================
-- RESUMO DO BANCO
-- ================================================================
-- 
-- Tabelas criadas:
--   1. users (4 colunas principais + timestamps)
--   2. profiles (dados detalhados do usuário)
--   3. user_roles (papéis de usuário)
--   4. cargas (fretes/cargas)
--
-- Total de colunas: ~35
-- Total de índices: ~20
-- Total de Foreign Keys: 3
--
-- ================================================================

-- Exibir resumo (opcional - comentado por padrão)
-- SELECT TABLE_NAME, ENGINE, TABLE_ROWS, DATA_LENGTH FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'u212116958_bd_frete_amigo';
