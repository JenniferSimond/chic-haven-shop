// Cart Models

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// Get Cart & Items
const fetchCartAndItems = async (customerId) => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT 
        c.id AS cart_id,
        c.customer_id,
        c.items_in_cart, -- Fetch items_in_cart directly from database
        c.cart_total,
        c.created_at AS cart_created_at,
        c.modified_at AS cart_modified_at,
        ci.id AS cart_item_id,
        ci.product_id,
        ci.inventory_id,
        ci.product_size AS cart_item_size,
        ci.quantity AS cart_item_quantity,
        ci.total_price AS cart_item_total_price,
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
      return null;
    }

    const cart = {
      id: response.rows[0].cart_id,
      customer_id: response.rows[0].customer_id,
      items_in_cart: parseInt(response.rows[0].items_in_cart),
      cart_total: parseFloat(response.rows[0].cart_total),
      created_at: response.rows[0].cart_created_at,
      modified_at: response.rows[0].cart_modified_at,
      items: response.rows[0].cart_item_id
        ? response.rows.map((row) => ({
            cart_item_id: row.cart_item_id,
            product_id: row.product_id,
            inventory_id: row.inventory_id,
            product_size: row.cart_item_size,
            product_name: row.product_name,
            product_description: row.product_description,
            product_price: parseFloat(row.product_price),
            product_image: row.product_image,
            product_sku: row.product_sku,
            quantity: parseInt(row.cart_item_quantity),
            total_price: parseFloat(row.cart_item_total_price),
            created_at: row.cart_item_created_at,
            modified_at: row.cart_item_modified_at,
          }))
        : [],
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
const addCartItem = async ({
  cartId,
  productId,
  inventoryId,
  productSize,
  quantity,
}) => {
  const client = await pool.connect();
  try {
    const SQL = `
      INSERT INTO cart_items (
        id,
        cart_id,
        product_id,
        inventory_id,
        product_size,
        quantity,
        created_at,
        modified_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (cart_id, product_id, inventory_id, product_size)
      DO UPDATE SET 
        quantity = cart_items.quantity + $6,
        modified_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const response = await client.query(SQL, [
      uuidv4(),
      cartId,
      productId,
      inventoryId,
      productSize,
      quantity,
    ]);

    return response.rows[0];
  } catch (error) {
    console.error('Error adding or updating cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE CART ITEM
const updateCartItem = async ({ cartId, itemId, quantity }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      UPDATE cart_items
      SET 
        quantity = $3, 
        modified_at = CURRENT_TIMESTAMP
      WHERE cart_id = $1 AND id = $2
      RETURNING *;
      `;

    const response = await client.query(SQL, [cartId, itemId, quantity]);
    return response.rows[0];
  } catch (error) {
    console.error('Error updating cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE CART ITEM
const deleteCartItem = async (cartId, itemId) => {
  const client = await pool.connect();
  try {
    const SQL = `
        DELETE FROM cart_items
        WHERE id = $2 AND cart_id =$1
        RETURNING *;
      `;

    const response = await client.query(SQL, [cartId, itemId]);
    return response.rows[0]; // Optional, return the deleted item
  } catch (error) {
    console.error('Error deleting cart item', error);
    throw error;
  } finally {
    client.release();
  }
};

const checkoutCart = async ({ cartId, customerId }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderId = uuidv4();
    const orderSQL = `
      INSERT INTO customer_orders (
        id,
        customer_id,
        order_total,
        status,
        created_at,
        modified_at
      )
      VALUES (
        $1,
        $2,
        (SELECT CAST(cart_total AS FLOAT) FROM carts WHERE id = $3), 
        'Pending',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *;
    `;
    const orderResponse = await client.query(orderSQL, [
      orderId,
      customerId,
      cartId,
    ]);

    const order = orderResponse.rows[0];
    order.order_total = parseFloat(order.order_total);

    const fetchCartItemsSQL = `
      SELECT product_id, inventory_id, product_size, quantity, total_price
      FROM cart_items
      WHERE cart_id = $1;
    `;
    const cartItems = await client.query(fetchCartItemsSQL, [cartId]);

    const orderItemsPromises = cartItems.rows.map((item) => {
      const orderItemId = uuidv4();
      const orderItemsSQL = `
        INSERT INTO ordered_items (
          id,
          order_id,
          product_id,
          inventory_id,
          item_size,
          quantity,
          total_price,
          created_at,
          modified_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `;
      return client.query(orderItemsSQL, [
        orderItemId,
        orderId,
        item.product_id,
        item.inventory_id,
        item.product_size,
        parseInt(item.quantity),
        parseFloat(item.total_price),
      ]);
    });

    await Promise.all(orderItemsPromises);

    // Clear cart items
    const clearCartSQL = `
      DELETE FROM cart_items WHERE cart_id = $1;
    `;

    const clearResponse = await client.query(clearCartSQL, [cartId]);
    console.log(
      `Cart items cleared for cart_id: ${cartId}. Rows affected: ${clearResponse.rowCount}`
    );

    await client.query('COMMIT');

    return orderResponse.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during checkout', error);
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
  checkoutCart,
};
