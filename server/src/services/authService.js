import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { config } from '../config/index.js';

const SALT_ROUNDS = 10;

export const authService = {
  async register(fullName, email, password, role = 'User') {
    const cleanEmail = email.trim().toLowerCase();
    const allowedRoles = ['Admin', 'Operator', 'Courier', 'User'];

    if (!allowedRoles.includes(role)) {
      const error = new Error('Invalid user role');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      const error = new Error('User with this email already exists');
      error.code = 'DUPLICATE_EMAIL';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [fullName, cleanEmail, passwordHash, role]
    );

    const user = result.rows[0];
    const token = this.generateToken(user);

    return { user, token };
  },

  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // Запрос пользователя по LOWER(email)
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (userQuery.rows.length === 0) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const user = userQuery.rows[0];

    if (!user.is_active) {
      const error = new Error('User account is deactivated');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const { password_hash, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  async getMe(userId) {
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

  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  },

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  },
};