import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';

const router = express.Router();

// Воссоздаем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Инициализация контентных таблиц (для разработки)
router.post('/content-tables', async (req, res) => {
  try {
    const migrationPath = path.join(__dirname, '../../migrations/07_create_content_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running content tables migration...');

    await db.query(sql);

    res.json({
      success: true,
      message: 'Контентные таблицы успешно созданы'
    });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании таблиц',
      error: error.message
    });
  }
});

// Обновление seed данных (для повторного запуска)
router.post('/content-seed', async (req, res) => {
  try {
    console.log('Updating content seed data...');

    // НЕ удаляем существующие тарифы - просто перезаписываем миграцию

    // Перечитываем и выполняем только seed часть миграции
    const migrationPath = path.join(__dirname, '../../migrations/07_create_content_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Выполняем SQL - таблицы созданы с ON CONFLICT, данные обновятся
    await db.query(sql);

    res.json({
      success: true,
      message: 'Seed данные успешно обновлены'
    });
  } catch (error) {
    console.error('Seed update failed:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении seed данных',
      error: error.message
    });
  }
});

export default router;