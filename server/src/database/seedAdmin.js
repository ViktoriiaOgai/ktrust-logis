import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const seedAdmin = async () => {
  try {
    console.log('Seeding admin user...');
    
    const hashedPassword = await bcrypt.hash('admin1234567', 10);
    
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = $3, full_name = $1
       RETURNING id, email, role`,
      ['System Admin', 'admin@ktrust-logis.com', hashedPassword, 'Admin', true]
    );
    
    console.log('✓ Admin user created/updated:', result.rows[0]);
    console.log('Email: admin@ktrust-logis.com');
    console.log('Password: admin1234567');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    await pool.end();
    process.exit(1);
  }
};

seedAdmin();
