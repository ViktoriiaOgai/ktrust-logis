import { operatorService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const operatorController = {
  async getActiveOperator(req, res, next) {
    try {
      const operator = await operatorService.getActiveOperator();

      if (!operator) {
        return successResponse(res, { operator: null }, 'No active operator found');
      }

      return successResponse(res, { operator }, 'Active operator retrieved');
    } catch (error) {
      next(error);
    }
  },
};
