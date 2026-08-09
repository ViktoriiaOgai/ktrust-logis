import pool from '../config/database.js';

export const dashboardService = {
  async getDashboardStats(dateFrom = null, dateTo = null) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (dateFrom) {
      conditions.push(`created_at >= $${paramIndex}`);
      params.push(dateFrom);
      paramIndex++;
    }

    if (dateTo) {
      conditions.push(`created_at <= $${paramIndex}`);
      params.push(dateTo);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total orders count
    const totalOrdersQuery = `
      SELECT COUNT(*) as count
      FROM parcel_orders
      ${whereClause}
    `;
    const totalOrdersResult = await pool.query(totalOrdersQuery, params);
    const totalOrders = parseInt(totalOrdersResult.rows[0].count);

    // Get orders by status
    const ordersByStatusQuery = `
      SELECT current_status, COUNT(*) as count
      FROM parcel_orders
      ${whereClause}
      GROUP BY current_status
      ORDER BY count DESC
    `;
    const ordersByStatusResult = await pool.query(ordersByStatusQuery, params);
    const ordersByStatus = ordersByStatusResult.rows;

    // Get total customers
    const totalCustomersQuery = `
      SELECT COUNT(*) as count
      FROM customers
      ${whereClause}
    `;
    const totalCustomersResult = await pool.query(totalCustomersQuery, params);
    const totalCustomers = parseInt(totalCustomersResult.rows[0].count);

    // Get total users
    const totalUsersQuery = `
      SELECT COUNT(*) as count
      FROM users
      ${whereClause}
    `;
    const totalUsersResult = await pool.query(totalUsersQuery, params);
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Get recent orders (last 10)
    const recentOrdersQuery = `
      SELECT 
        po.id,
        po.tracking_number,
        po.current_status,
        po.created_at,
        c.name as customer_name,
        po.origin_city,
        po.destination_city
      FROM parcel_orders po
      LEFT JOIN customers c ON po.customer_id = c.id
      ${whereClause}
      ORDER BY po.created_at DESC
      LIMIT 10
    `;
    const recentOrdersResult = await pool.query(recentOrdersQuery, params);
    const recentOrders = recentOrdersResult.rows;

    // Get delivery statistics
    const deliveryStatsQuery = `
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN current_status = 'Delivered' THEN 1 END) as successful_deliveries,
        COUNT(CASE WHEN current_status = 'Delivery Failed' THEN 1 END) as failed_deliveries,
        COUNT(CASE WHEN current_status = 'Delayed' THEN 1 END) as delayed_deliveries
      FROM parcel_orders
      ${whereClause}
    `;
    const deliveryStatsResult = await pool.query(deliveryStatsQuery, params);
    const deliveryStats = deliveryStatsResult.rows[0];

    // Get revenue (sum of delivery prices for delivered orders)
    const revenueQuery = `
      SELECT COALESCE(SUM(delivery_price), 0) as total_revenue
      FROM parcel_orders
      WHERE current_status = 'Delivered'
      ${dateFrom ? `AND created_at >= $${paramIndex++}` : ''}
      ${dateTo ? `AND created_at <= $${paramIndex++}` : ''}
    `;
    const revenueParams = [];
    let revenueParamIndex = 1;
    if (dateFrom) {
      revenueParams.push(dateFrom);
      revenueParamIndex++;
    }
    if (dateTo) {
      revenueParams.push(dateTo);
    }
    const revenueResult = await pool.query(revenueQuery, revenueParams);
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue);

    return {
      overview: {
        totalOrders,
        totalCustomers,
        totalUsers,
        totalRevenue,
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
      WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * $1
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    
    const result = await pool.query(query, [days]);
    return result.rows;
  },

  async getTopCouriers(limit = 5) {
    const query = `
      SELECT 
        u.id,
        u.full_name,
        COUNT(po.id) as total_deliveries,
        COUNT(CASE WHEN po.current_status = 'Delivered' THEN 1 END) as successful_deliveries
      FROM users u
      LEFT JOIN parcel_orders po ON u.id = po.assigned_courier_id
      WHERE u.role = 'Courier'
      GROUP BY u.id, u.full_name
      ORDER BY successful_deliveries DESC NULLS LAST
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  },
};
