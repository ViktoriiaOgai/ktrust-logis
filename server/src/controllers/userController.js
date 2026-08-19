import { userService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const userController = {
  async createUser(req, res, next) {
    try {
      const { fullName, email, password, role, phone } = req.body;

      const { user, token } = await userService.createUser(fullName, email, password, role, phone);

      return successResponse(res, { user, token }, 'User created successfully', 201);
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return errorResponse(res, error.message, null, 409);
      }
      next(error);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, role, isActive, sortBy, sortOrder } = req.query;

      const result = await userService.getAllUsers({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        role: role || '',
        isActive,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC',
      });

      return successResponse(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(parseInt(id));

      return successResponse(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await userService.updateUserRole(parseInt(id), role);

      return successResponse(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async updateUserPhone(req, res, next) {
    try {
      const { id } = req.params;
      const { phone } = req.body;

      const user = await userService.updateUserPhone(parseInt(id), phone);

      return successResponse(res, { user }, 'User phone updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deactivateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.deactivateUser(parseInt(id));

      return successResponse(res, { user }, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  },

  async activateUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.activateUser(parseInt(id));

      return successResponse(res, { user }, 'User activated successfully');
    } catch (error) {
      next(error);
    }
  },
};
