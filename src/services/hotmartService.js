/**
 * hotmartService.js
 *
 * Verifica se um e-mail possui plano ativo na plataforma.
 *
 * Com o webhook configurado, o status é mantido localmente na tabela
 * `hotmart_subscriptions`, atualizada em tempo real pela Hotmart.
 *
 * Consultar o banco local é instantâneo e não depende de disponibilidade
 * da API externa a cada clique do usuário.
 *
 * Status considerados como "plano ativo":
 *   ACTIVE  — assinatura em dia
 *   DELAYED — pagamento em atraso, mas ainda dentro do período vigente
 */

import pool from '../config/database.js';

const VALID_STATUSES = ['ACTIVE', 'DELAYED'];

/**
 * Verifica se o e-mail possui assinatura ativa no banco local.
 *
 * @param {string} email - E-mail do usuário logado
 * @returns {Promise<boolean>} true se plano ativo, false caso contrário
 */
export async function hasActivePlan(email) {
  if (!email) return false;

  try {
    const connection = await pool.getConnection();
    try {
      const placeholders = VALID_STATUSES.map(() => '?').join(', ');
      const [rows] = await connection.query(
        `SELECT id FROM hotmart_subscriptions
         WHERE subscriber_email = ?
           AND status IN (${placeholders})
         LIMIT 1`,
        [email.toLowerCase().trim(), ...VALID_STATUSES]
      );

      return rows.length > 0;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('[HotmartService] Erro ao verificar plano no banco:', error.message);
    // Em caso de erro no banco, nega o acesso (comportamento seguro)
    return false;
  }
}
