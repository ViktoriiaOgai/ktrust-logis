import pool from '../config/database.js';

export const dashboardService = {
  async getDashboardStats(dateFrom = null, dateTo = null) {
    let dateFilter = '';
    const params = [];
    let paramIndex = 1;

    if (dateFrom && dateTo) {
      dateFilter = `WHERE o.created_at >= $${paramIndex} AND o.created_at <= $${paramIndex + 1}`;
      params.push(dateFrom, dateTo);
      paramIndex += 2;
    }

    // Overview stats
    const overviewQuery = `
      SELECT
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT u.id) as total_users,
        COALESCE(SUM(o.delivery_price), 0) as total_revenue
      FROM parcel_orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON u.role IN ('Admin', 'Operator', 'Courier')
      ${dateFilter}
    `;

    const overviewResult = await pool.query(overviewQuery, params);
    const overview = overviewResult.rows[0];

    // Orders by status
    const statusQuery = `
      SELECT current_status, COUNT(*) as count
      FROM parcel_orders o
      ${dateFilter}
      GROUP BY current_status
      ORDER BY count DESC
    `;

    const statusResult = await pool.query(statusQuery, params);
    const ordersByStatus = statusResult.rows;

    // Delivery stats
    const deliveryQuery = `
      SELECT
        COUNT(*) as total_deliveries,
        COUNT(*) FILTER (WHERE current_status = 'Delivered') as successful_deliveries,
        COUNT(*) FILTER (WHERE current_status = 'Delivery Failed') as failed_deliveries,
        COUNT(*) FILTER (WHERE current_status = 'Delayed') as delayed_deliveries
      FROM parcel_orders o
      ${dateFilter}
    `;

    const deliveryResult = await pool.query(deliveryQuery, params);
    const deliveryStats = deliveryResult.rows[0];

    // Recent orders
    const recentQuery = `
      SELECT
        o.id,
        o.tracking_number,
        o.current_status,
        o.created_at,
        c.name as customer_name,
        o.origin_city,
        o.destination_city
      FROM parcel_orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ${dateFilter}
      ORDER BY o.created_at DESC
      LIMIT 10
    `;

    const recentResult = await pool.query(recentQuery, params);
    const recentOrders = recentResult.rows;

    return {
      overview: {
        totalOrders: parseInt(overview.total_orders) || 0,
        totalCustomers: parseInt(overview.total_customers) || 0,
        totalUsers: parseInt(overview.total_users) || 0,
        totalRevenue: parseFloat(overview.total_revenue) || 0,
      },
      ordersByStatus,
      deliveryStats: {
        totalDeliveries: parseInt(deliveryStats.total_deliveries) || 0,
        successfulDeliveries: parseInt(deliveryStats.successful_deliveries) || 0,
        failedDeliveries: parseInt(deliveryStats.failed_deliveries) || 0,
        delayedDeliveries: parseInt(deliveryStats.delayed_deliveries) || 0,
      },
      recentOrders,
    };
  },

  async getOrderTrends(days = 30) {
    const query = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as orders_count
      FROM parcel_orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  async getTopCouriers(limit = 5) {
    const query = `
      SELECT
        u.id,
        u.full_name,
        COUNT(o.id) as total_deliveries,
        COUNT(o.id) FILTER (WHERE o.current_status = 'Delivered') as successful_deliveries
      FROM users u
      LEFT JOIN orders o ON u.id = o.courier_id
      WHERE u.role = 'Courier'
      GROUP BY u.id, u.full_name
      ORDER BY successful_deliveries DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  },
};
