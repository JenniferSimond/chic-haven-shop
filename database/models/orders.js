const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// Get Order & Order Details
const fetchOrdersAndItems = async (customerId) => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT
        co.*,
        COALESCE(
          json_agg(
            json_build_object(
              'ordered_item_id', oi.id,
              'product_id', oi.product_id,
              'inventory_id', oi.inventory_id,
              'product_name', p.name,
              'product_price', p.price,
              'ordered_size', oi.item_size,
              'quantity_ordered', oi.quantity,
              'total_price', oi.total_price,
              'item_created_at', oi.created_at,
              'item_modified_at', oi.modified_at
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS ordered_items
      FROM customer_orders co
      LEFT JOIN ordered_items oi ON co.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE co.customer_id = $1
      GROUP BY co.id;
    `;
    const response = await client.query(SQL, [customerId]);
    return response.rows.length > 0 ? response.rows : [];
  } catch (error) {
    console.error('Error fetching orders and items:', error);
    throw error; // Re-throw error to handle it upstream
  } finally {
    client.release();
  }
};

// --> Update Order Admin Only
const updateOrder = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
        
        `;
  } catch (error) {
  } finally {
  }
};
// -- Delete Order Admin Only

const deleteOrder = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
        
        `;
  } catch (error) {
  } finally {
  }
};
module.exports = {
  fetchOrdersAndItems,
};
