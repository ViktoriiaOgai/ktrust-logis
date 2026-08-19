/**
 * Query Builder Utility
 * Builds SQL queries with pagination, filtering, search, and sorting
 */

class QueryBuilder {
  constructor(baseQuery, baseTable) {
    this.baseQuery = baseQuery;
    this.baseTable = baseTable;
    this.conditions = [];
    this.params = [];
    this.paramIndex = 1;
    this.orderBy = null;
    this.sortDirection = 'DESC';
  }

  /**
   * Add search condition (ILIKE across multiple columns)
   * @param {string[]} columns - Array of column names to search
   * @param {string} searchTerm - Search term
   */
  addSearch(columns, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return this;

    const searchConditions = columns.map((column) => {
      return `${this.baseTable}.${column} ILIKE $${this.paramIndex++}`;
    });

    this.conditions.push(`(${searchConditions.join(' OR ')})`);
    this.params.push(`%${searchTerm}%`);

    return this;
  }

  /**
   * Add exact match condition
   * @param {string} column - Column name
   * @param {*} value - Value to match
   */
  addExactMatch(column, value) {
    if (value === undefined || value === null || value === '') return this;

    this.conditions.push(`${this.baseTable}.${column} = $${this.paramIndex++}`);
    this.params.push(value);

    return this;
  }

  /**
   * Add ILIKE match condition (case-insensitive partial match)
   * @param {string} column - Column name
   * @param {string} value - Value to match
   */
  addILikeMatch(column, value) {
    if (!value || value.trim() === '') return this;

    this.conditions.push(`${this.baseTable}.${column} ILIKE $${this.paramIndex++}`);
    this.params.push(`%${value}%`);

    return this;
  }

  /**
   * Add date range condition
   * @param {string} column - Column name
   * @param {string} fromDate - Start date
   * @param {string} toDate - End date
   */
  addDateRange(column, fromDate, toDate) {
    if (fromDate) {
      this.conditions.push(`${this.baseTable}.${column} >= $${this.paramIndex++}`);
      this.params.push(fromDate);
    }

    if (toDate) {
      this.conditions.push(`${this.baseTable}.${column} <= $${this.paramIndex++}`);
      this.params.push(toDate);
    }

    return this;
  }

  /**
   * Add IN condition for array of values
   * @param {string} column - Column name
   * @param {Array} values - Array of values
   */
  addInCondition(column, values) {
    if (!values || !Array.isArray(values) || values.length === 0) return this;

    const placeholders = values.map(() => `$${this.paramIndex++}`).join(', ');
    this.conditions.push(`${this.baseTable}.${column} IN (${placeholders})`);
    this.params.push(...values);

    return this;
  }

  /**
   * Add custom WHERE condition
   * @param {string} condition - SQL condition
   * @param {*} value - Value for condition
   */
  addCustomCondition(condition, value) {
    if (value === undefined || value === null || value === '') return this;

    this.conditions.push(condition.replace(/\$1/g, `$${this.paramIndex++}`));
    this.params.push(value);

    return this;
  }

  /**
   * Set order by clause
   * @param {string} column - Column to sort by
   * @param {string} direction - ASC or DESC
   */
  setOrderBy(column, direction = 'DESC') {
    this.orderBy = column;
    this.sortDirection = direction.toUpperCase();

    return this;
  }

  /**
   * Build WHERE clause
   * @returns {string} WHERE clause SQL
   */
  buildWhereClause() {
    if (this.conditions.length === 0) return '';
    return `WHERE ${this.conditions.join(' AND ')}`;
  }

  /**
   * Build ORDER BY clause
   * @returns {string} ORDER BY clause SQL
   */
  buildOrderByClause() {
    if (!this.orderBy) return `${this.baseTable}.created_at DESC`;
    return `${this.baseTable}.${this.orderBy} ${this.sortDirection}`;
  }

  /**
   * Build complete query with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Query object with SQL and params
   */
  buildPaginatedQuery(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const whereClause = this.buildWhereClause();
    const orderByClause = this.buildOrderByClause();

    return {
      sql: `${this.baseQuery} ${whereClause} ORDER BY ${orderByClause} LIMIT $${this.paramIndex++} OFFSET $${this.paramIndex++}`,
      params: [...this.params, limit, offset],
    };
  }

  /**
   * Build count query for pagination
   * @returns {Object} Count query object with SQL and params
   */
  buildCountQuery() {
    const whereClause = this.buildWhereClause();
    const countQuery = `SELECT COUNT(*) as total FROM ${this.baseTable} ${whereClause}`;

    return {
      sql: countQuery,
      params: [...this.params],
    };
  }

  /**
   * Reset builder state
   */
  reset() {
    this.conditions = [];
    this.params = [];
    this.paramIndex = 1;
    this.orderBy = null;
    this.sortDirection = 'DESC';

    return this;
  }
}

/**
 * Execute paginated query with count
 * @param {Object} pool - Database pool
 * @param {Object} queryBuilder - QueryBuilder instance
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Result with data and pagination info
 */
export async function executePaginatedQuery(pool, queryBuilder, page = 1, limit = 10) {
  // Get total count
  const countQuery = queryBuilder.buildCountQuery();
  const countResult = await pool.query(countQuery.sql, countQuery.params);
  const total = parseInt(countResult.rows[0].total);

  // Get paginated data
  const dataQuery = queryBuilder.buildPaginatedQuery(page, limit);
  const dataResult = await pool.query(dataQuery.sql, dataQuery.params);

  return {
    data: dataResult.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export { QueryBuilder };
export default QueryBuilder;
