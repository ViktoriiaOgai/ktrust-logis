import pool from '../config/database.js';
import { QueryBuilder, executePaginatedQuery } from '../utils/index.js';

// Generate unique tracking number
function generateTrackingNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KT-${timestamp}-${random}`;
}

export const orderService = {
  async getAllOrders({ 
    page = 1, 
    limit = 10, 
    search = '', 
    status = '', 
    customerId = '', 
    courierId = '',
    originCity = '',
    destinationCity = '',
    dateFrom = '',
    dateTo = '',
    userRole = '',
    userId = null,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  }) {
    const baseQuery = `
      SELECT 
        po.id,
        po.tracking_number,
        po.customer_id,
        c.name as customer_name,
        po.sender_name,
        po.sender_phone,
        po.receiver_name,
        po.receiver_phone,
        po.origin_address,
        po.destination_address,
        po.origin_city,
        po.destination_city,
        po.weight_kg,
        po.cargo_type,
        po.declared_value,
        po.delivery_price,
        po.current_status,
        po.assigned_courier_id,
        u.full_name as courier_name,
        po.estimated_delivery_date,
        po.created_by_user_id,
        cu.full_name as created_by_user_name,
        po.created_at,
        po.updated_at
      FROM parcel_orders po
      LEFT JOIN customers c ON po.customer_id = c.id
      LEFT JOIN users u ON po.assigned_courier_id = u.id
      LEFT JOIN users cu ON po.created_by_user_id = cu.id
    `;

    const queryBuilder = new QueryBuilder(baseQuery, 'po');

    // Add search condition
    if (search) {
      queryBuilder.addSearch(['tracking_number', 'sender_name', 'receiver_name', 'sender_phone', 'receiver_phone'], search);
    }

    // Add status filter
    if (status) {
      queryBuilder.addExactMatch('current_status', status);
    }

    // Add customer filter
    if (customerId) {
      queryBuilder.addExactMatch('customer_id', parseInt(customerId));
    }

    // Add courier filter
    if (courierId) {
      queryBuilder.addExactMatch('assigned_courier_id', parseInt(courierId));
    }

    // Add origin city filter
    if (originCity) {
      queryBuilder.addILikeMatch('origin_city', originCity);
    }

    // Add destination city filter
    if (destinationCity) {
      queryBuilder.addILikeMatch('destination_city', destinationCity);
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      queryBuilder.addDateRange('created_at', dateFrom, dateTo);
    }

    // Filter by user role - Couriers can only see assigned orders
    if (userRole === 'Courier' && userId) {
      queryBuilder.addExactMatch('assigned_courier_id', userId);
    }

    // Add sorting
    queryBuilder.setOrderBy(sortBy, sortOrder);

    // Execute paginated query
    const result = await executePaginatedQuery(pool, queryBuilder, page, limit);

    return {
      orders: result.data,
      pagination: result.pagination,
    };
  },

  async getOrderById(orderId) {
    const result = await pool.query(
      `SELECT 
        po.id,
        po.tracking_number,
        po.customer_id,
        c.name as customer_name,
        po.sender_name,
        po.sender_phone,
        po.receiver_name,
        po.receiver_phone,
        po.origin_address,
        po.destination_address,
        po.origin_city,
        po.destination_city,
        po.weight_kg,
        po.cargo_type,
        po.declared_value,
        po.delivery_price,
        po.current_status,
        po.assigned_courier_id,
        u.full_name as courier_name,
        po.estimated_delivery_date,
        po.created_by_user_id,
        cu.full_name as created_by_user_name,
        po.created_at,
        po.updated_at
      FROM parcel_orders po
      LEFT JOIN customers c ON po.customer_id = c.id
      LEFT JOIN users u ON po.assigned_courier_id = u.id
      LEFT JOIN users cu ON po.created_by_user_id = cu.id
      WHERE po.id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  },

  async getOrderByTrackingNumber(trackingNumber) {
    const result = await pool.query(
      `SELECT 
        po.id,
        po.tracking_number,
        po.customer_id,
        c.name as customer_name,
        po.sender_name,
        po.sender_phone,
        po.receiver_name,
        po.receiver_phone,
        po.origin_address,
        po.destination_address,
        po.origin_city,
        po.destination_city,
        po.weight_kg,
        po.cargo_type,
        po.declared_value,
        po.delivery_price,
        po.current_status,
        po.assigned_courier_id,
        u.full_name as courier_name,
        po.estimated_delivery_date,
        po.created_by_user_id,
        cu.full_name as created_by_user_name,
        po.created_at,
        po.updated_at
      FROM parcel_orders po
      LEFT JOIN customers c ON po.customer_id = c.id
      LEFT JOIN users u ON po.assigned_courier_id = u.id
      LEFT JOIN users cu ON po.created_by_user_id = cu.id
      WHERE po.tracking_number = $1`,
      [trackingNumber]
    );

    if (result.rows.length === 0) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  },

  async createOrder(orderData, userId) {
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
    } = orderData;

    // Generate tracking number
    let trackingNumber;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      trackingNumber = generateTrackingNumber();
      const existing = await pool.query(
        'SELECT id FROM parcel_orders WHERE tracking_number = $1',
        [trackingNumber]
      );
      if (existing.rows.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      const error = new Error('Failed to generate unique tracking number');
      error.statusCode = 500;
      throw error;
    }

    const result = await pool.query(
      `INSERT INTO parcel_orders (
        tracking_number, customer_id, sender_name, sender_phone, receiver_name, receiver_phone,
        origin_address, destination_address, origin_city, destination_city, weight_kg, cargo_type,
        declared_value, delivery_price, current_status, created_by_user_id, estimated_delivery_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Registered', $15, $16)
      RETURNING id, tracking_number, customer_id, current_status, created_at, updated_at`,
      [
        trackingNumber, customerId, senderName, senderPhone, receiverName, receiverPhone,
        originAddress, destinationAddress, originCity, destinationCity, weightKg, cargoType,
        declaredValue || 0, deliveryPrice || 0, userId, estimatedDeliveryDate
      ]
    );

    const order = result.rows[0];

    // Record initial status in history
    await pool.query(
      `INSERT INTO status_history (parcel_order_id, old_status, new_status, comment, changed_by_user_id)
       VALUES ($1, NULL, 'Registered', 'Order created', $2)`,
      [order.id, userId]
    );

    return order;
  },

  async updateOrder(orderId, orderData) {
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
    } = orderData;

    // Check if order exists
    await this.getOrderById(orderId);

    const result = await pool.query(
      `UPDATE parcel_orders
       SET customer_id = $1, sender_name = $2, sender_phone = $3, receiver_name = $4, receiver_phone = $5,
           origin_address = $6, destination_address = $7, origin_city = $8, destination_city = $9,
           weight_kg = $10, cargo_type = $11, declared_value = $12, delivery_price = $13,
           estimated_delivery_date = $14, updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING id, tracking_number, customer_id, current_status, created_at, updated_at`,
      [
        customerId, senderName, senderPhone, receiverName, receiverPhone,
        originAddress, destinationAddress, originCity, destinationCity,
        weightKg, cargoType, declaredValue || 0, deliveryPrice || 0,
        estimatedDeliveryDate, orderId
      ]
    );

    return result.rows[0];
  },

  async deleteOrder(orderId) {
    // Check if order exists
    const order = await this.getOrderById(orderId);

    // Check if order can be deleted (only Draft or Registered status)
    if (order.current_status !== 'Draft' && order.current_status !== 'Registered') {
      const error = new Error('Cannot delete order with status: ' + order.current_status);
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      'DELETE FROM parcel_orders WHERE id = $1 RETURNING id',
      [orderId]
    );

    return result.rows[0];
  },

  async assignCourier(orderId, courierId) {
    // Check if order exists
    await this.getOrderById(orderId);

    const result = await pool.query(
      `UPDATE parcel_orders
       SET assigned_courier_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, tracking_number, assigned_courier_id, current_status, updated_at`,
      [courierId, orderId]
    );

    return result.rows[0];
  },
};
