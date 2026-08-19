import pool from '../config/database.js';

export const operatorService = {
  async getActiveOperator() {
    const result = await pool.query(
      `SELECT id, full_name, email, phone
       FROM users
       WHERE role = 'Operator' AND is_active = true AND phone IS NOT NULL
       ORDER BY created_at ASC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  },
};
