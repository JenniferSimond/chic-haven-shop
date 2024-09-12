// Cart Models

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// FETCH CART BY ID
const fetchCartById = async (customer_id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM carts WHERE customer_id = $1
    `;

    const response = await client.query(SQL, [customer_id]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching cart', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH CART ITEMS
const fetchCartItems = async (cart_id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT 
            ci.*,
            p.name,
            p.description,
            p.price, 
            p.image,
            p.sku
        FROM cart_items ci
        LEFT JOIN products p
        ON ci.product_id = p.id
        WHERE cart_id = $1
        ORDER BY p.name ASC
      `;

    const response = await client.query(SQL, [cart_id]);
    return response.rows;
  } catch (error) {
    console.error('Error fetching cart_items', error);
    throw error;
  } finally {
    client.release();
  }
};

// ADD CART ITEM
const addCartItem = async ({ cartId, productId, quantity }) => {
  const client = await pool.connect();
  try {
    const SQL = `
          INSERT INTO cart_items (id, cart_id, product_id, quantity, created_at, modified_at)
          VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp)
          RETURNING *;
      `;

    const response = await client.query(SQL, [
      uuidv4(),
      cartId,
      productId,
      quantity,
    ]);
    return response.rows[0];
  } catch (error) {
    console.error('Error adding cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE CART ITEM
const updateCartItem = async ({ id, quantity }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        UPDATE cart_items
        SET quantity = $2, modified_at = current_timestamp
        WHERE id = $1
        RETURNING *;
      `;

    const response = await client.query(SQL, [id, quantity]);
    return response.rows[0];
  } catch (error) {
    console.error('Error updating cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE CART ITEM
const deleteCartItem = async ({ id }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        DELETE FROM cart_items
        WHERE id = $1
        RETURNING *;
      `;

    const response = await client.query(SQL, [id]);
    return response.rows[0]; // Optional, return the deleted item
  } catch (error) {
    console.error('Error deleting cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  fetchCartById,
  fetchCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
