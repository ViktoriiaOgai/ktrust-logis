import express from 'express';
import { authController } from '../controllers/index.js';
import { authenticate } from '../middleware/index.js';
import { registerValidator, loginValidator } from '../utils/index.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Register - Public
router.post('/register', registerValidator, validate, authController.register);

// Login - Public
router.post('/login', loginValidator, validate, authController.login);

// Get current user - Protected
router.get('/me', authenticate, authController.getMe);

export default router;
