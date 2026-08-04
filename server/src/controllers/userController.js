import { userService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const userController = {
  async getAllUsers(req, res, next) {
    try {
      const { page, limit, search, role, isActive } = req.query;

      const result = await userService.getAllUsers({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        role: role || '',
        isActive,
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
