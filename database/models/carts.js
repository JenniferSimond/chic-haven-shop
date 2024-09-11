// Cart Models

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// FETCH CART BY ID
const fetchCartById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM carts WHERE customer_id = $1
    `;

    const response = await client.query(SQL, [id]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching cart', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH CART ITEMS
const fetchCartItems = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM cart_items WHERE cart_id = $1
      `;

    const response = await client.query(SQL, [id]);
    return response.rows;
  } catch (error) {
    console.error('Error fetching cart_items', error);
    throw error;
  } finally {
    client.release();
  }
};

// ADD CART ITEM
const addCartItem = async ({ cartId, productId, quantity, discountCode }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        INSERT INTO cart_items (
            id,
            cart_id,
            product_id,
        )
      `;

    const response = await client.query(SQL, cartId, productId, quantity);
  } catch (error) {
    console.error('', error);
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
      `;
  } catch (error) {
    console.error('', error);
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
      `;
  } catch (error) {
    console.error('', error);
    throw error;
  } finally {
    client.release();
  }
};
