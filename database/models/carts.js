// Cart Models

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

const fetchCartAndItems = async (customerId) => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT 
        c.id AS cart_id,
        c.customer_id,
        c.created_at AS cart_created_at,
        c.modified_at AS cart_modified_at,
        ci.id AS cart_item_id,
        ci.product_id,
        ci.product_size AS cart_item_size,  -- Include the size here
        ci.quantity AS cart_item_quantity,
        ci.created_at AS cart_item_created_at,
        ci.modified_at AS cart_item_modified_at,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image,
        p.sku AS product_sku
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE c.customer_id = $1
      ORDER BY p.name ASC;
    `;

    const response = await client.query(SQL, [customerId]);

    if (response.rows.length === 0) {
      // If no rows returned, it means the cart does not exist, return null
      return null;
    }

    const cart = {
      id: response.rows[0].cart_id,
      customer_id: response.rows[0].customer_id,
      created_at: response.rows[0].cart_created_at,
      modified_at: response.rows[0].cart_modified_at,
      items: response.rows[0].cart_item_id
        ? response.rows.map((row) => ({
            cart_item_id: row.cart_item_id,
            product_id: row.product_id,
            product_size: row.cart_item_size, // Include the product size here
            product_name: row.product_name,
            product_description: row.product_description,
            product_price: row.product_price,
            product_image: row.product_image,
            product_sku: row.product_sku,
            quantity: row.cart_item_quantity,
            created_at: row.cart_item_created_at,
            modified_at: row.cart_item_modified_at,
          }))
        : [], // Return an empty array if no items are present
    };

    return cart;
  } catch (error) {
    console.error('Error fetching cart and cart items', error);
    throw error;
  } finally {
    client.release();
  }
};

// ADD CART ITEM
const addCartItem = async ({ cartId, productId, productSize, quantity }) => {
  const client = await pool.connect();
  try {
    // Fetch the product to validate its existence and get the price
    const productSQL = `SELECT price FROM products WHERE id = $1`;
    const productResponse = await client.query(productSQL, [productId]);

    if (productResponse.rows.length === 0) {
      throw new Error('Product not found!');
    }

    // Get the product price
    const productPrice = productResponse.rows[0].price;

    // Calculate total price (quantity * product price)
    const totalPrice = productPrice * quantity;

    const SQL = `
      INSERT INTO cart_items (
        id,
        cart_id,
        product_id,
        product_size,  -- Include the size in the insert
        quantity,
        total_price,
        created_at,
        modified_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,  -- size goes here
        $5,
        $6,
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;

    const response = await client.query(SQL, [
      uuidv4(), // Generate a new unique ID for the cart item
      cartId, // Use the provided cart ID
      productId, // Use the provided product ID
      productSize, // Include the provided size
      quantity, // Use the provided quantity
      totalPrice, // Use the calculated total price (product price * quantity)
    ]);

    return response.rows[0]; // Return the added cart item
  } catch (error) {
    console.error('Error adding cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE CART ITEM
const updateCartItem = async ({ id, cartId, quantity }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        UPDATE cart_items
        SET quantity = $3, modified_at = current_timestamp
        WHERE id = $1 AND cart_id = $2
        RETURNING *;
      `;

    const response = await client.query(SQL, [id, cartId, quantity]);
    return response.rows[0];
  } catch (error) {
    console.error('Error updating cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE CART ITEM
const deleteCartItem = async ({ id, cartId }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        DELETE FROM cart_items
        WHERE id = $1 AND cart_id =$2
        RETURNING *;
      `;

    const response = await client.query(SQL, [id, cartId]);
    return response.rows[0]; // Optional, return the deleted item
  } catch (error) {
    console.error('Error deleting cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  fetchCartAndItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
