import { authService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { fullName, email, password } = req.body;

      const { user, token } = await authService.register(fullName, email, password);

      return successResponse(
        res,
        { user, token },
        'User registered successfully',
        201
      );
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return errorResponse(res, error.message, null, 409);
      }
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { user, token } = await authService.login(email, password);

      return successResponse(res, { user, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await authService.getMe(userId);

      return successResponse(res, { user }, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  },
};
