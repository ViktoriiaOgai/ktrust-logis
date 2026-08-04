import pool from '../config/database.js';

export const customerService = {
  async getAllCustomers({ page = 1, limit = 10, search = '', city = '', country = '' }) {
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR company_name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      conditions.push(`city ILIKE $${paramIndex}`);
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (country) {
      conditions.push(`country ILIKE $${paramIndex}`);
      params.push(`%${country}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM customers
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get customers
    const customersQuery = `
      SELECT id, name, email, phone, company_name, address, city, country, notes, created_at, updated_at
      FROM customers
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(limit, offset);
    const customersResult = await pool.query(customersQuery, params);

    return {
      customers: customersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getCustomerById(customerId) {
    const result = await pool.query(
      `SELECT id, name, email, phone, company_name, address, city, country, notes, created_at, updated_at
       FROM customers
       WHERE id = $1`,
      [customerId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }

    return result.rows[0];
  },

  async createCustomer(customerData) {
    const { name, email, phone, companyName, address, city, country, notes } = customerData;

    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, company_name, address, city, country, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, email, phone, company_name, address, city, country, notes, created_at, updated_at`,
      [name, email, phone, companyName, address, city, country, notes]
    );

    return result.rows[0];
  },

  async updateCustomer(customerId, customerData) {
    const { name, email, phone, companyName, address, city, country, notes } = customerData;

    // Check if customer exists
    await this.getCustomerById(customerId);

    const result = await pool.query(
      `UPDATE customers
       SET name = $1, email = $2, phone = $3, company_name = $4, address = $5, city = $6, country = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING id, name, email, phone, company_name, address, city, country, notes, created_at, updated_at`,
      [name, email, phone, companyName, address, city, country, notes, customerId]
    );

    return result.rows[0];
  },

  async deleteCustomer(customerId) {
    // Check if customer exists
    const customer = await this.getCustomerById(customerId);

    // Check if customer has associated orders
    const ordersResult = await pool.query(
      'SELECT COUNT(*) as count FROM parcel_orders WHERE customer_id = $1',
      [customerId]
    );

    const orderCount = parseInt(ordersResult.rows[0].count);

    if (orderCount > 0) {
      const error = new Error('Cannot delete customer with associated orders');
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [customerId]
    );

    return result.rows[0];
  },
};
