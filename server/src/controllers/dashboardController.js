import { dashboardService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const dashboardController = {
  async getDashboardStats(req, res, next) {
    try {
      const { dateFrom, dateTo } = req.query;

      const stats = await dashboardService.getDashboardStats(
        dateFrom || null,
        dateTo || null
      );

      return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getOrderTrends(req, res, next) {
    try {
      const { days } = req.query;

      const trends = await dashboardService.getOrderTrends(
        days ? parseInt(days) : 30
      );

      return successResponse(res, { trends }, 'Order trends retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getTopCouriers(req, res, next) {
    try {
      const { limit } = req.query;

      const couriers = await dashboardService.getTopCouriers(
        limit ? parseInt(limit) : 5
      );

      return successResponse(res, { couriers }, 'Top couriers retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
};
