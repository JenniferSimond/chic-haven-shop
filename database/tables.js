const pool = require('./databaseConfig');

const createTables = async () => {
  const SQL = `

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS change_log CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS product_inventory CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS ordered_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS customer_reviews CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TYPE IF EXISTS admin_type CASCADE;
DROP TYPE IF EXISTS customer_status CASCADE;
DROP TYPE IF EXISTS review_permissions CASCADE;

CREATE TYPE admin_type AS ENUM ('admin','site_admin', 'super_admin');
CREATE TYPE customer_status AS ENUM ('active', 'banned');
CREATE TYPE review_permissions AS ENUM ('allowed', 'blocked');

-- CHANGE LOG
CREATE TABLE change_log(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(25) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_at TIMESTAMP DEFAULT current_timestamp,
  changed_by UUID
);

-- ADMIN 
CREATE TABLE admin_roles(
  id UUID PRIMARY KEY,
  admin_type admin_type,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE admins(
  id UUID PRIMARY KEY,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- CUSTOMER 
CREATE TABLE customers(
  id UUID PRIMARY KEY,
  last_name VARCHAR(50),
  first_name VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  customer_status customer_status DEFAULT 'active',
  review_permissions review_permissions DEFAULT 'allowed',
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE customer_addresses(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 VARCHAR(100),
  address_line2 VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- PRODUCTS 
CREATE TABLE product_categories(
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE product_inventory(
  id UUID PRIMARY KEY,
  quantity INTEGER,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);
    
CREATE TABLE discounts(
  id UUID PRIMARY KEY,
  name VARCHAR(25) UNIQUE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE products(
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  SKU VARCHAR(255),
  description VARCHAR(255),
  image VARCHAR(100),
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES product_inventory(id) ON DELETE CASCADE,
  price DECIMAL CHECK (price > 0),
  discount_id UUID REFERENCES discounts(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- CART
CREATE TABLE carts(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE cart_items(
  id UUID PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER CHECK (quantity > 0),
  price DECIMAL CHECK (price > 0),
  total_price DECIMAL CHECK (total_price > 0),
  discount_id UUID REFERENCES discounts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- WISHLIST
CREATE TABLE wishlists(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE wishlist_items(
  id UUID PRIMARY KEY,
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);
    
-- ORDERS
CREATE TABLE orders(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address_id UUID REFERENCES customer_addresses(id) ON DELETE CASCADE,
  quantity INTEGER,
  price DECIMAL CHECK (price > 0),
  total_price DECIMAL CHECK (total_price > 0),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE ordered_items(
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER,
  order_total DECIMAL CHECK (order_total > 0),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE payments(
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL CHECK (amount > 0),
  currency VARCHAR(20),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- REVIEWS
CREATE TABLE product_reviews(
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER,
  comment VARCHAR(255),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

CREATE TABLE customer_reviews(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  modified_by UUID
);

-- CHANGE TRACKING TRIGGER
CREATE OR REPLACE FUNCTION track_table_changes()
RETURNS TRIGGER
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO change_log (table_name, operation, record_id, new_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), CURRENT_TIMESTAMP, NEW.modified_by);
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO change_log (table_name, operation, record_id, old_values, new_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP, NEW.modified_by);
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO change_log (table_name, operation, record_id, old_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), CURRENT_TIMESTAMP, OLD.modified_by);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_admin_changes
AFTER INSERT OR UPDATE OR DELETE ON admins
FOR EACH ROW
EXECUTE FUNCTION track_table_changes();

CREATE TRIGGER track_customer_changes
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW
EXECUTE FUNCTION track_table_changes();

CREATE TRIGGER track_product_changes
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION track_table_changes();

-- CUSTOMER ASSOCIATION TRIGGER
CREATE OR REPLACE FUNCTION create_customer_records() 
RETURNS TRIGGER 
AS $$
BEGIN
  INSERT INTO carts (id, customer_id, created_at, modified_at)
  VALUES (uuid_generate_v4(), NEW.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  
  INSERT INTO wishlists (id, customer_id, created_at, modified_at)
  VALUES (uuid_generate_v4(), NEW.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_customer_create
AFTER INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION create_customer_records();
  `;

  let client; // creating client variable
  try {
    client = await pool.connect(); // adding a client to the pool
    console.log('Connected to the database');
    await client.query(SQL);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  createTables,
};
