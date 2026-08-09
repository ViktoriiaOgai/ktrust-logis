import { orderService } from '../services/index.js';
import { successResponse, errorResponse } from '../utils/index.js';

export const orderController = {
  async getAllOrders(req, res, next) {
    try {
      const { page, limit, search, status, customerId, courierId, originCity, destinationCity, dateFrom, dateTo, sortBy, sortOrder } = req.query;
      const userRole = req.user.role;
      const userId = req.user.id;

      const result = await orderService.getAllOrders({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search: search || '',
        status: status || '',
        customerId: customerId || '',
        courierId: courierId || '',
        originCity: originCity || '',
        destinationCity: destinationCity || '',
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        userRole,
        userId,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder || 'DESC',
      });

      return successResponse(res, result, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;

      const order = await orderService.getOrderById(parseInt(id));

      return successResponse(res, { order }, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getOrderByTrackingNumber(req, res, next) {
    try {
      const { trackingNumber } = req.params;

      const order = await orderService.getOrderByTrackingNumber(trackingNumber);

      // For public tracking, return limited information
      const publicOrder = {
        tracking_number: order.tracking_number,
        current_status: order.current_status,
        origin_city: order.origin_city,
        destination_city: order.destination_city,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };

      return successResponse(res, { order: publicOrder }, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        customerId,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        originAddress,
        destinationAddress,
        originCity,
        destinationCity,
        weightKg,
        cargoType,
        declaredValue,
        deliveryPrice,
        estimatedDeliveryDate,
      } = req.body;

      const order = await orderService.createOrder(
        {
          customerId,
          senderName,
          senderPhone,
          receiverName,
          receiverPhone,
          originAddress,
          destinationAddress,
          originCity,
          destinationCity,
          weightKg,
          cargoType,
          declaredValue,
          deliveryPrice,
          estimatedDeliveryDate,
        },
        userId
      );

      return successResponse(res, { order }, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const {
        customerId,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        originAddress,
        destinationAddress,
        originCity,
        destinationCity,
        weightKg,
        cargoType,
        declaredValue,
        deliveryPrice,
        estimatedDeliveryDate,
      } = req.body;

      const order = await orderService.updateOrder(parseInt(id), {
        customerId,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        originAddress,
        destinationAddress,
        originCity,
        destinationCity,
        weightKg,
        cargoType,
        declaredValue,
        deliveryPrice,
        estimatedDeliveryDate,
      });

      return successResponse(res, { order }, 'Order updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteOrder(req, res, next) {
    try {
      const { id } = req.params;

      await orderService.deleteOrder(parseInt(id));

      return successResponse(res, null, 'Order deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  async assignCourier(req, res, next) {
    try {
      const { id } = req.params;
      const { courierId } = req.body;

      const order = await orderService.assignCourier(parseInt(id), parseInt(courierId));

      return successResponse(res, { order }, 'Courier assigned successfully');
    } catch (error) {
      next(error);
    }
  },
};
