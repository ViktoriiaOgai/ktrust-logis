-- Seed default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role, is_active)
VALUES (
  'System Admin',
  'admin@ktrust-logis.com',
  '$2a$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'Admin',
  true
)
ON CONFLICT (email) DO NOTHING;
