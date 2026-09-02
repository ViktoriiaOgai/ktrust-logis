const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '../migrations/07_create_content_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration: 07_create_content_tables.sql');

    await pool.query(sql);

    console.log('Migration completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
