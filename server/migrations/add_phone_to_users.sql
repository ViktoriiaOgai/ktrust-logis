-- Add phone column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add comment
COMMENT ON COLUMN users.phone IS 'Phone number for operators to receive customer applications';
