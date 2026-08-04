import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { config } from '../config/index.js';

const SALT_ROUNDS = 10;

export const authService = {
  async register(fullName, email, password) {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const error = new Error('User with this email already exists');
      error.code = 'DUPLICATE_EMAIL';
      throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user (default role: Operator)
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, 'Operator', true)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [fullName, email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  },

  async login(email, password) {
    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      const error = new Error('User account is deactivated');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Remove password from user object
    const { password_hash, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = this.generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  },

  async getMe(userId) {
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
