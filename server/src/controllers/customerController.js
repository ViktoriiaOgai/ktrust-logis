import { customerService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const customerController = {
  async getAllCustomers(req, res, next) {
    try {
      const { page, limit, search, city, country, sortBy, sortOrder } = req.query;

      const result = await customerService.getAllCustomers({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        city: city || '',
        country: country || '',
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC',
      });

      return successResponse(res, result, 'Customers retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await customerService.getCustomerById(parseInt(id));

      return successResponse(res, { customer }, 'Customer retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createCustomer(req, res, next) {
    try {
      const { name, email, phone, companyName, address, city, country, notes } = req.body;

      const customer = await customerService.createCustomer({
        name,
        email,
        phone,
        companyName,
        address,
        city,
        country,
        notes,
      });

      return successResponse(res, { customer }, 'Customer created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, phone, companyName, address, city, country, notes } = req.body;

      const customer = await customerService.updateCustomer(parseInt(id), {
        name,
        email,
        phone,
        companyName,
        address,
        city,
        country,
        notes,
      });

      return successResponse(res, { customer }, 'Customer updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;

      await customerService.deleteCustomer(parseInt(id));

      return successResponse(res, null, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
