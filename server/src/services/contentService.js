import db from '../config/database.js';

class ContentService {
  // Получить все услуги
  async getAllServices() {
    const query = `
      SELECT * FROM services
      ORDER BY id
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Получить услугу по slug
  async getServiceBySlug(slug) {
    const query = `
      SELECT * FROM services
      WHERE slug = $1
    `;
    const result = await db.query(query, [slug]);
    return result.rows[0];
  }

  // Получить тарифы для услуги и страны
  async getTariffs(serviceSlug, countryCode = null) {
    let query = `
      SELECT t.*, c.code as country_code, c.name_ru as country_name
      FROM tariffs t
      JOIN countries c ON t.country_id = c.id
      JOIN services s ON t.service_id = s.id
      WHERE s.slug = $1 AND t.is_active = true
    `;
    const params = [serviceSlug];

    console.log('getTariffs called with:', { serviceSlug, countryCode });

    if (countryCode) {
      query += ` AND c.code = $2`;
      params.push(countryCode);
    }

    query += ` ORDER BY c.name_ru`;

    console.log('Executing query:', query);
    console.log('With params:', params);

    const result = await db.query(query, params);
    console.log('Query result:', result.rows);

    return result.rows;
  }

  // Получить тариф с строками
  async getTariffWithRows(tariffId) {
    const tariffQuery = `
      SELECT t.*, c.code as country_code, c.name_ru as country_name
      FROM tariffs t
      JOIN countries c ON t.country_id = c.id
      WHERE t.id = $1
    `;
    const tariffResult = await db.query(tariffQuery, [tariffId]);
    const tariff = tariffResult.rows[0];

    if (!tariff) {
      return null;
    }

    const rowsQuery = `
      SELECT * FROM tariff_rows
      WHERE tariff_id = $1
      ORDER BY sort_order
    `;
    const rowsResult = await db.query(rowsQuery, [tariffId]);

    return {
      ...tariff,
      rows: rowsResult.rows
    };
  }

  // Получить все страны
  async getAllCountries() {
    const query = `
      SELECT * FROM countries
      WHERE is_active = true
      ORDER BY name_ru
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Получить сравнение услуг
  async getServiceComparison(serviceSlug) {
    const query = `
      SELECT * FROM service_comparisons
      WHERE service_slug = $1
    `;
    const result = await db.query(query, [serviceSlug]);
    return result.rows[0];
  }

  // Получить информацию о компании
  async getCompanyInfo(section) {
    const query = `
      SELECT * FROM company_info
      WHERE section = $1 AND is_active = true
    `;
    const result = await db.query(query, [section]);
    return result.rows[0];
  }

  // Создать услугу (Admin)
  async createService(data) {
    const query = `
      INSERT INTO services (slug, title, title_ko, description, icon, hero_title, hero_description, hero_button_text, hero_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      data.slug,
      data.title,
      data.title_ko || null,
      data.description || null,
      data.icon || null,
      data.hero_title || null,
      data.hero_description || null,
      data.hero_button_text || null,
      data.hero_info ? JSON.stringify(data.hero_info) : null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Обновить услугу (Admin)
  async updateService(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE services
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Создать тариф (Admin)
  async createTariff(data) {
    const query = `
      INSERT INTO tariffs (service_id, country_id, tariff_type, columns, notes, min_weight, delivery_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.service_id,
      data.country_id,
      data.tariff_type,
      JSON.stringify(data.columns),
      data.notes || [],
      data.min_weight || null,
      data.delivery_info || null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Создать строку тарифа (Admin)
  async createTariffRow(data) {
    const query = `
      INSERT INTO tariff_rows (tariff_id, category, price, delivery, note, has_close_icon, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.tariff_id,
      data.category,
      data.price,
      data.delivery,
      data.note || null,
      data.has_close_icon || false,
      data.sort_order || 0
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Обновить информацию о компании (Admin)
  async updateCompanyInfo(section, data) {
    const query = `
      INSERT INTO company_info (section, title, content, contact_info)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (section)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        contact_info = EXCLUDED.contact_info,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      section,
      data.title || null,
      data.content || null,
      data.contact_info ? JSON.stringify(data.contact_info) : null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

export const contentService = new ContentService();
