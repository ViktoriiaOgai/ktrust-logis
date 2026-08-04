import pool from '../config/database.js';

export const userService = {
  async getAllUsers({ page = 1, limit = 10, search = '', role = '', isActive = null }) {
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      conditions.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      conditions.push(`is_active = $${paramIndex}`);
      params.push(isActive === 'true' || isActive === true);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get users
    const usersQuery = `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(limit, offset);
    const usersResult = await pool.query(usersQuery, params);

    return {
      users: usersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getUserById(userId) {
    const result = await pool.query(
      `SELECT id, full_name, email, role, is_active, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  },

  async updateUserRole(userId, newRole) {
    // Check if user exists
    const user = await this.getUserById(userId);

    // Prevent changing the last admin's role
    if (user.role === 'Admin' && newRole !== 'Admin') {
      const adminCount = await pool.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'Admin' AND is_active = true"
      );
      
      if (parseInt(adminCount.rows[0].count) <= 1) {
        const error = new Error('Cannot change role of the last active admin');
        error.statusCode = 400;
        throw error;
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET role = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
      [newRole, userId]
    );

    return result.rows[0];
  },

  async deactivateUser(userId) {
    // Check if user exists
    const user = await this.getUserById(userId);

    // Prevent deactivating the last admin
    if (user.role === 'Admin' && user.is_active) {
      const adminCount = await pool.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'Admin' AND is_active = true"
      );
      
      if (parseInt(adminCount.rows[0].count) <= 1) {
        const error = new Error('Cannot deactivate the last active admin');
        error.statusCode = 400;
        throw error;
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
      [userId]
    );

    return result.rows[0];
  },

  async activateUser(userId) {
    const user = await this.getUserById(userId);

    const result = await pool.query(
      `UPDATE users
       SET is_active = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
      [userId]
    );

    return result.rows[0];
  },
};
