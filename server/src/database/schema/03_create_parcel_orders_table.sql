-- Create parcel_orders table
CREATE TABLE IF NOT EXISTS parcel_orders (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  sender_name VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  origin_address VARCHAR(255) NOT NULL,
  destination_address VARCHAR(255) NOT NULL,
  origin_city VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  weight_kg DECIMAL(10, 2) NOT NULL CHECK (weight_kg > 0),
  cargo_type VARCHAR(50) NOT NULL,
  declared_value DECIMAL(10, 2) DEFAULT 0 CHECK (declared_value >= 0),
  delivery_price DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_price >= 0),
  current_status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (current_status IN (
    'Draft',
    'Registered',
    'In Warehouse',
    'In Transit',
    'Arrived at Destination',
    'Out for Delivery',
    'Delivered',
    'Delivery Failed',
    'Delayed',
    'Returned',
    'Cancelled'
  )),
  assigned_courier_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  estimated_delivery_date DATE,
  created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on tracking_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_parcel_orders_tracking_number ON parcel_orders(tracking_number);

-- Create index on customer_id for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_customer_id ON parcel_orders(customer_id);

-- Create index on current_status for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_current_status ON parcel_orders(current_status);

-- Create index on assigned_courier_id for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_assigned_courier_id ON parcel_orders(assigned_courier_id);

-- Create index on created_by_user_id for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_created_by_user_id ON parcel_orders(created_by_user_id);

-- Create index on origin_city for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_origin_city ON parcel_orders(origin_city);

-- Create index on destination_city for filtering
CREATE INDEX IF NOT EXISTS idx_parcel_orders_destination_city ON parcel_orders(destination_city);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_parcel_orders_created_at ON parcel_orders(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_parcel_orders_updated_at BEFORE UPDATE ON parcel_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
