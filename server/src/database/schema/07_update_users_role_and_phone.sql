-- Allow the default 'User' role assigned on self-registration
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('Admin', 'Operator', 'Courier', 'User'));

-- Phone number used by operators (selected by /api/auth/me and user management)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
