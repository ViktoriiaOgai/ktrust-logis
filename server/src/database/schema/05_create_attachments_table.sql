-- Create attachments table (optional)
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  parcel_order_id INTEGER NOT NULL REFERENCES parcel_orders(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on parcel_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_attachments_parcel_order_id ON attachments(parcel_order_id);

-- Create index on uploaded_by_user_id for filtering
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by_user_id ON attachments(uploaded_by_user_id);
