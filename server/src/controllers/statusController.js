import { statusService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const statusController = {
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { newStatus, comment } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Validate role permission
      const roleValidation = statusService.validateRolePermission(userRole, newStatus);
      if (!roleValidation.valid) {
        return errorResponse(res, roleValidation.message, null, 403);
      }

      const order = await statusService.updateOrderStatus(
        parseInt(id),
        newStatus,
        userId,
        comment,
        userRole
      );

      return successResponse(res, { order }, 'Status updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async getOrderStatusHistory(req, res, next) {
    try {
      const { id } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;

      // If courier, check if order is assigned to them
      if (userRole === 'Courier') {
        const order = await statusService.getOrderById(parseInt(id));
        if (order.assigned_courier_id !== userId) {
          const error = new Error('Access denied - order not assigned to you');
          error.statusCode = 403;
          throw error;
        }
      }

      const history = await statusService.getOrderStatusHistory(parseInt(id));

      return successResponse(res, { history }, 'Status history retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getAllowedTransitions(req, res, next) {
    try {
      const { currentStatus } = req.query;

      if (!currentStatus) {
        return errorResponse(res, 'Current status is required', null, 400);
      }

      const allowedTransitions = statusService.getAllowedTransitions(currentStatus);

      return successResponse(res, { allowedTransitions }, 'Allowed transitions retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};
