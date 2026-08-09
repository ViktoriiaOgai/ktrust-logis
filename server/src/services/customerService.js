import pool from '../config/database.js';
import { QueryBuilder, executePaginatedQuery } from '../utils/index.js';

export const customerService = {
  async getAllCustomers({ page = 1, limit = 10, search = '', city = '', country = '', sortBy = 'created_at', sortOrder = 'DESC' }) {
    const baseQuery = `
      SELECT id, name, email, phone, company_name, address, city, country, notes, created_at, updated_at
      FROM customers
    `;

    const queryBuilder = new QueryBuilder(baseQuery, 'customers');

    // Add search condition
    if (search) {
      queryBuilder.addSearch(['name', 'email', 'phone', 'company_name'], search);
    }

    // Add city filter
    if (city) {
      queryBuilder.addILikeMatch('city', city);
    }

    // Add country filter
    if (country) {
      queryBuilder.addILikeMatch('country', country);
    }

    // Add sorting
    queryBuilder.setOrderBy(sortBy, sortOrder);

    // Execute paginated query
    const result = await executePaginatedQuery(pool, queryBuilder, page, limit);

    return {
      customers: result.data,
      pagination: result.pagination,
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
