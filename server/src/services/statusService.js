import pool from '../config/database.js';

// Status transition rules based on the specification
const STATUS_TRANSITIONS = {
  Draft: ['Registered', 'Cancelled'],
  Registered: ['In Warehouse', 'Cancelled'],
  'In Warehouse': ['In Transit', 'Cancelled'],
  'In Transit': ['Arrived at Destination', 'Delayed'],
  'Arrived at Destination': ['Out for Delivery'],
  'Out for Delivery': ['Delivered', 'Delivery Failed'],
  Delivered: [], // Final status
  'Delivery Failed': ['Out for Delivery', 'Returned'],
  Delayed: ['In Transit'],
  Returned: [], // Final status
  Cancelled: [], // Final status
};

// Exception statuses that require a comment
const EXCEPTION_STATUSES = ['Delayed', 'Delivery Failed', 'Returned', 'Cancelled'];

// Final statuses that cannot be changed
const FINAL_STATUSES = ['Delivered', 'Returned', 'Cancelled'];

// Role-based status update permissions
const ROLE_STATUS_PERMISSIONS = {
  Admin: [
    'Draft', 'Registered', 'In Warehouse', 'In Transit', 'Arrived at Destination',
    'Out for Delivery', 'Delivered', 'Delivery Failed', 'Delayed', 'Returned', 'Cancelled'
  ],
  Operator: [
    'Draft', 'Registered', 'In Warehouse', 'In Transit', 'Arrived at Destination',
    'Out for Delivery', 'Delivered', 'Delivery Failed', 'Delayed'
  ],
  Courier: [
    'Out for Delivery', 'Delivered', 'Delivery Failed'
  ],
};

export const statusService = {
  validateStatusTransition(currentStatus, newStatus) {
    // Check if current status is final
    if (FINAL_STATUSES.includes(currentStatus)) {
      return {
        valid: false,
        message: `Cannot change status from final state: ${currentStatus}`,
      };
    }

    // Check if new status is final and we're trying to transition to it
    if (FINAL_STATUSES.includes(newStatus)) {
      // Check if transition is allowed
      const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
      if (!allowedTransitions.includes(newStatus)) {
        return {
          valid: false,
          message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        };
      }
    }

    // Check normal transition
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        valid: false,
        message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      };
    }

    return { valid: true };
  },

  checkCommentRequired(newStatus) {
    return EXCEPTION_STATUSES.includes(newStatus);
  },

  validateRolePermission(userRole, newStatus) {
    const allowedStatuses = ROLE_STATUS_PERMISSIONS[userRole] || [];
    if (!allowedStatuses.includes(newStatus)) {
      return {
        valid: false,
        message: `User with role ${userRole} cannot set status to ${newStatus}`,
      };
    }
    return { valid: true };
  },

  async updateOrderStatus(orderId, newStatus, userId, comment = null, userRole = null) {
    // Get current order status
    const orderResult = await pool.query(
      'SELECT current_status, assigned_courier_id FROM parcel_orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const currentStatus = orderResult.rows[0].current_status;
    const assignedCourierId = orderResult.rows[0].assigned_courier_id;

    // If courier, check if order is assigned to them
    if (userRole === 'Courier' && assignedCourierId !== userId) {
      const error = new Error('Couriers can only update status of orders assigned to them');
      error.statusCode = 403;
      throw error;
    }

    // Validate transition
    const transitionValidation = this.validateStatusTransition(currentStatus, newStatus);
    if (!transitionValidation.valid) {
      const error = new Error(transitionValidation.message);
      error.statusCode = 400;
      throw error;
    }

    // Check if comment is required
    if (this.checkCommentRequired(newStatus) && !comment) {
      const error = new Error(`Comment is required for status: ${newStatus}`);
      error.statusCode = 400;
      throw error;
    }

    // Update order status
    const updateResult = await pool.query(
      `UPDATE parcel_orders
       SET current_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, tracking_number, current_status, updated_at`,
      [newStatus, orderId]
    );

    // Record status change in history
    await pool.query(
      `INSERT INTO status_history (parcel_order_id, old_status, new_status, comment, changed_by_user_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, currentStatus, newStatus, comment, userId]
    );

    return updateResult.rows[0];
  },

  async getOrderStatusHistory(orderId) {
    const result = await pool.query(
      `SELECT 
        sh.id,
        sh.old_status,
        sh.new_status,
        sh.comment,
        sh.created_at,
        u.full_name as changed_by_user_name,
        u.role as changed_by_user_role
      FROM status_history sh
      JOIN users u ON sh.changed_by_user_id = u.id
      WHERE sh.parcel_order_id = $1
      ORDER BY sh.created_at DESC`,
      [orderId]
    );

    return result.rows;
  },

  async getOrderById(orderId) {
    const result = await pool.query(
      'SELECT id, tracking_number, current_status, assigned_courier_id FROM parcel_orders WHERE id = $1',
      [orderId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  },

  getAllowedTransitions(currentStatus) {
    return STATUS_TRANSITIONS[currentStatus] || [];
  },

  isExceptionStatus(status) {
    return EXCEPTION_STATUSES.includes(status);
  },

  isFinalStatus(status) {
    return FINAL_STATUSES.includes(status);
  },
};
