import pool from '../config/database.js';
import { QueryBuilder, executePaginatedQuery } from '../utils/index.js';

export const userService = {
  async getAllUsers({ page = 1, limit = 10, search = '', role = '', isActive = null, sortBy = 'created_at', sortOrder = 'DESC' }) {
    const baseQuery = `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
    `;

    const queryBuilder = new QueryBuilder(baseQuery, 'users');

    // Add search condition
    if (search) {
      queryBuilder.addSearch(['full_name', 'email'], search);
    }

    // Add role filter
    if (role) {
      queryBuilder.addExactMatch('role', role);
    }

    // Add active status filter
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      queryBuilder.addExactMatch('is_active', isActive === 'true' || isActive === true);
    }

    // Add sorting
    queryBuilder.setOrderBy(sortBy, sortOrder);

    // Execute paginated query
    const result = await executePaginatedQuery(pool, queryBuilder, page, limit);

    return {
      users: result.data,
      pagination: result.pagination,
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
