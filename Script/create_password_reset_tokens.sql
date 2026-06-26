-- Tabela para armazenar tokens de redefinição de senha
-- Execute este script no seu banco de dados MySQL

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  user_id     VARCHAR(36)  NOT NULL,
  token       VARCHAR(64)  NOT NULL UNIQUE,
  expires_at  DATETIME     NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_prt_token (token),
  INDEX idx_prt_user  (user_id)
);
