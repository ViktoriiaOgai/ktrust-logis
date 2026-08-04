-- Create status_history table
CREATE TABLE IF NOT EXISTS status_history (
  id SERIAL PRIMARY KEY,
  parcel_order_id INTEGER NOT NULL REFERENCES parcel_orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  comment TEXT,
  changed_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on parcel_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_status_history_parcel_order_id ON status_history(parcel_order_id);

-- Create index on changed_by_user_id for filtering
CREATE INDEX IF NOT EXISTS idx_status_history_changed_by_user_id ON status_history(changed_by_user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON status_history(created_at DESC);
