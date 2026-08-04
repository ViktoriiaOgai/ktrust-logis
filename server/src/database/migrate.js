import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaDir = path.join(__dirname, 'schema');

const readSQLFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

const runMigration = async (fileName) => {
  const filePath = path.join(schemaDir, fileName);
  console.log(`Running migration: ${fileName}`);
  
  try {
    const sql = readSQLFile(filePath);
    await pool.query(sql);
    console.log(`✓ Migration ${fileName} completed successfully`);
  } catch (error) {
    console.error(`✗ Migration ${fileName} failed:`, error.message);
    throw error;
  }
};

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    console.log('================================');

    // Get all SQL files in schema directory
    const files = fs.readdirSync(schemaDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files`);

    // Run each migration file
    for (const file of files) {
      await runMigration(file);
    }

    console.log('================================');
    console.log('✓ All migrations completed successfully');
    
    // Close the pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
};

migrate();
