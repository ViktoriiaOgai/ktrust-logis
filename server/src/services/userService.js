import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { QueryBuilder, executePaginatedQuery } from '../utils/index.js';
import { config } from '../config/index.js';

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export const userService = {
  async createUser(fullName, email, password, role = 'User', phone = null) {
    const allowedRoles = ['Admin', 'Operator', 'Courier', 'User'];
    if (!allowedRoles.includes(role)) {
      const error = new Error('Invalid user role');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const error = new Error('User with this email already exists');
      error.code = 'DUPLICATE_EMAIL';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, full_name, email, role, phone, is_active, created_at`,
      [fullName, email, passwordHash, role, phone]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return { user, token };
  },

  async getAllUsers({ page = 1, limit = 10, search = '', role = '', isActive = null, sortBy = 'created_at', sortOrder = 'DESC' }) {
    const baseQuery = `
      SELECT id, full_name, email, role, phone, is_active, created_at, updated_at
      FROM users
    `;

    const queryBuilder = new QueryBuilder(baseQuery, 'users');

    if (search) {
      queryBuilder.addSearch(['full_name', 'email', 'phone'], search);
    }

    if (role) {
      queryBuilder.addExactMatch('role', role);
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      queryBuilder.addExactMatch('is_active', isActive === 'true' || isActive === true);
    }

    queryBuilder.setOrderBy(sortBy, sortOrder);

    const result = await executePaginatedQuery(pool, queryBuilder, page, limit);

    return {
      users: result.data,
      pagination: result.pagination,
    };
  },

  async getUserById(userId) {
    const result = await pool.query(
      `SELECT id, full_name, email, role, phone, is_active, created_at, updated_at
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
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Блокируем строки с ролями Admin, чтобы избежать Race Condition
      const userRes = await client.query(
        'SELECT id, role, is_active FROM users WHERE id = $1 FOR UPDATE',
        [userId]
      );

      if (userRes.rows.length === 0) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const user = userRes.rows[0];

      if (user.role === 'Admin' && newRole !== 'Admin') {
        const adminCount = await client.query(
          "SELECT COUNT(*) as count FROM users WHERE role = 'Admin' AND is_active = true"
        );

        if (parseInt(adminCount.rows[0].count, 10) <= 1) {
          const error = new Error('Cannot change role of the last active admin');
          error.statusCode = 400;
          throw error;
        }
      }

      const result = await client.query(
        `UPDATE users
         SET role = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
        [newRole, userId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async deactivateUser(userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const userRes = await client.query(
        'SELECT id, role, is_active FROM users WHERE id = $1 FOR UPDATE',
        [userId]
      );

      if (userRes.rows.length === 0) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const user = userRes.rows[0];

      if (user.role === 'Admin' && user.is_active) {
        const adminCount = await client.query(
          "SELECT COUNT(*) as count FROM users WHERE role = 'Admin' AND is_active = true"
        );

        if (parseInt(adminCount.rows[0].count, 10) <= 1) {
          const error = new Error('Cannot deactivate the last active admin');
          error.statusCode = 400;
          throw error;
        }
      }

      const result = await client.query(
        `UPDATE users
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
        [userId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async activateUser(userId) {
    await this.getUserById(userId);

    const result = await pool.query(
      `UPDATE users
       SET is_active = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, full_name, email, role, phone, is_active, created_at, updated_at`,
      [userId]
    );

    return result.rows[0];
  },

  async updateUserPhone(userId, phone) {
    await this.getUserById(userId);

    const result = await pool.query(
      `UPDATE users
       SET phone = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, full_name, email, role, phone, is_active, created_at, updated_at`,
      [phone, userId]
    );

    return result.rows[0];
  },
};