import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Debug endpoint для проверки тарифов
router.get('/tariffs', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tariffs ORDER BY id');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint для проверки tariff_rows
router.get('/tariff-rows', async (req, res) => {
  try {
    const result = await db.query('SELECT tr.*, t.tariff_type FROM tariff_rows tr JOIN tariffs t ON tr.tariff_id = t.id ORDER BY tr.id LIMIT 20');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint для проверки конкретного тарифа
router.get('/tariff-details/:serviceSlug', async (req, res) => {
  try {
    const { serviceSlug } = req.params;
    const result = await db.query(`
      SELECT t.*, c.code as country_code, c.name_ru as country_name
      FROM tariffs t
      JOIN countries c ON t.country_id = c.id
      JOIN services s ON t.service_id = s.id
      WHERE s.slug = $1 AND t.is_active = true
      ORDER BY c.name_ru
    `, [serviceSlug]);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint для проверки service_id
router.get('/service-id/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query('SELECT id, slug, title FROM services WHERE slug = $1', [slug]);
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint для проверки тарифов по service_id
router.get('/tariffs-by-service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const result = await db.query('SELECT * FROM tariffs WHERE service_id = $1', [serviceId]);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint для проверки запроса getTariffs
router.get('/test-gettariffs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query(`
      SELECT t.*, c.code as country_code, c.name_ru as country_name
      FROM tariffs t
      JOIN countries c ON t.country_id = c.id
      JOIN services s ON t.service_id = s.id
      WHERE s.slug = $1 AND t.is_active = true
      ORDER BY c.name_ru
    `, [slug]);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
