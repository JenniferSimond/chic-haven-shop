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
DROP TABLE IF EXISTS customer_orders CASCADE;
DROP TABLE IF EXISTS ordered_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TYPE IF EXISTS admin_type CASCADE;
DROP TYPE IF EXISTS customer_status CASCADE;
DROP TYPE IF EXISTS review_permissions CASCADE;
DROP TYPE IF EXISTS stock_status CASCADE;

CREATE TYPE admin_type AS ENUM ('admin','site_admin', 'super_admin');
CREATE TYPE customer_status AS ENUM ('active', 'banned');
CREATE TYPE review_permissions AS ENUM ('allowed', 'blocked');
CREATE TYPE stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

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
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE admins(
  id UUID PRIMARY KEY,
  last_name VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
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
  modified_at TIMESTAMP DEFAULT current_timestamp
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
  modified_at TIMESTAMP DEFAULT current_timestamp
);

-- PRODUCTS 
CREATE TABLE product_categories(
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

    
CREATE TABLE discounts(
  id UUID PRIMARY KEY,
  name VARCHAR(25) UNIQUE NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE products(
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10, 2) CHECK (price > 0),
  image VARCHAR(100),
  sku VARCHAR(255),
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE product_inventory(
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_size VARCHAR(25),
  quantity INTEGER CHECK (quantity >= 0),
  stock_status stock_status DEFAULT 'in_stock',
  is_deleted BOOLEAN DEFAULT FALSE, -- soft delete flag to manage discontinued sizes, variants, etc.
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment VARCHAR(255),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);


-- CART
CREATE TABLE carts(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  items_in_cart INTEGER DEFAULT 0,
  cart_total DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT unique_customer UNIQUE (customer_id, id)
);

CREATE TABLE cart_items(
  id UUID PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES product_inventory(id) ON DELETE CASCADE,
  product_size VARCHAR(25),
  quantity INTEGER CHECK (quantity > 0),
  total_price DECIMAL(10, 2) CHECK (total_price > 0), 
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT unique_cart_item UNIQUE (cart_id, product_id, inventory_id, product_size)
);


-- WISHLIST
CREATE TABLE wishlists(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE wishlist_items(
  id UUID PRIMARY KEY,
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp,
  CONSTRAINT unique_user_product UNIQUE (wishlist_id, product_id)
);
    
-- ORDERS
CREATE TABLE customer_orders(
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  address_id UUID REFERENCES customer_addresses(id) ON DELETE CASCADE,
  order_total DECIMAL CHECK (order_total > 0),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE ordered_items(
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES customer_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES product_inventory(id) ON DELETE CASCADE,
  item_size VARCHAR(25),
  quantity INTEGER,
  total_price DECIMAL(10, 2) CHECK (total_price > 0),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE payments(
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES customer_orders(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL CHECK (amount > 0),
  currency VARCHAR(20),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT current_timestamp,
  modified_at TIMESTAMP DEFAULT current_timestamp
);


-- CHANGE TRACKING TRIGGER
CREATE OR REPLACE FUNCTION track_table_changes()
RETURNS TRIGGER
AS $$
BEGIN
  
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO change_log (table_name, operation, record_id, new_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), CURRENT_TIMESTAMP,
            COALESCE(current_setting('myapp.user_id', true), '00000000-0000-0000-0000-000000000000')::UUID);
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO change_log (table_name, operation, record_id, old_values, new_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP,
            COALESCE(current_setting('myapp.user_id', true), '00000000-0000-0000-0000-000000000000')::UUID);
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO change_log (table_name, operation, record_id, old_values, changed_at, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), CURRENT_TIMESTAMP,
            COALESCE(current_setting('myapp.user_id', true), '00000000-0000-0000-0000-000000000000')::UUID);
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

CREATE TRIGGER track_review_changes
AFTER INSERT OR UPDATE OR DELETE ON reviews
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

  INSERT INTO customer_addresses (id, customer_id, created_at, modified_at)
  VALUES (uuid_generate_v4(), NEW.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_customer_create
AFTER INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION create_customer_records();

-- STOCK STATUS TRIGGER
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER
AS $$
BEGIN
  IF NEW.quantity = 0 THEN
    NEW.stock_status := 'out_of_stock';
  ELSIF NEW.quantity <= 20 THEN
    NEW.stock_status := 'low_stock';
  ELSE
    NEW.stock_status := 'in_stock';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_status_trigger
BEFORE INSERT OR UPDATE ON product_inventory
FOR EACH ROW
EXECUTE FUNCTION update_stock_status();

-- UPDATE INVENTORY TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the quantity in product_inventory for the specific item being ordered
  UPDATE product_inventory
  SET 
    quantity = quantity - NEW.quantity
  WHERE 
    id = NEW.inventory_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER ON ordered_items TO EXECUTE update_inventory FUNCTION
CREATE TRIGGER update_inventory_trigger
AFTER INSERT ON ordered_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory();

-- CART TRIGGER
CREATE OR REPLACE FUNCTION update_cart_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE carts
  SET 
    cart_total = (SELECT COALESCE(SUM(total_price), 0.00) FROM cart_items WHERE cart_id = COALESCE(NEW.cart_id, OLD.cart_id)),
    items_in_cart = (SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE cart_id = COALESCE(NEW.cart_id, OLD.cart_id))
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_total();

-- CART ITEMS TRIGGER

CREATE OR REPLACE FUNCTION set_cart_item_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price := (
    SELECT p.price * NEW.quantity
    FROM products p
    WHERE p.id = NEW.product_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cart_item_total_trigger
BEFORE INSERT OR UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_cart_item_total();


-- FUNCTION TO AUTO-POPULATE address_id IN customer_orders
CREATE OR REPLACE FUNCTION set_default_customer_address_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign the customer address ID to the order if it exists
  NEW.address_id := (
    SELECT id 
    FROM customer_addresses 
    WHERE customer_id = NEW.customer_id
    LIMIT 1
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER TO EXECUTE THE FUNCTION BEFORE INSERT ON customer_orders
CREATE TRIGGER set_address_id_on_order
BEFORE INSERT ON customer_orders
FOR EACH ROW
EXECUTE FUNCTION set_default_customer_address_id();

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
