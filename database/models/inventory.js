// Inventory Models

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// CREATE INVENTORY
const createInventory = async ({ productId, size, quantity }) => {
  const client = await pool.connect();
  try {
    const SQL = `
       INSERT INTO product_inventory (id, product_id, size, quantity, created_at, modified_at )   
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *
    `;

    const response = await client.query(SQL, [
      uuidv4(),
      productId,
      size,
      quantity,
    ]);
  } catch (error) {
    console.error('Error creating inventory!', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH ALL INVENTORY
const fetchAllInventory = async () => {
  const client = await pool.connect();
  try {
    const SQL = `
          SELECT * FROM product_inventory
      `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching inventory.', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH INVENTORY BY ID
const fetchInventoryById = async (productId) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM product_inventory WHERE product_id = $1
    `;

    const response = await client.query(SQL, [productId]);
    return response.rows;
  } catch (error) {
    console.error('Error product inventory.', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE INVENTORY
const updateInventoryById = async (
  id,
  productId,
  size,
  quantity,
  stockStatus
) => {
  const client = await pool.connect();
  try {
    const SQL = `
        UPDATE product_inventory 
        SET
          size = COALESCE($3, size),
          quantity = COALESCE($4, quantity),
          stock_status = COALESCE($5, stock_status),
          modified_at = CURRENT_TIMESTAMP
        
        WHERE product_id = $2 AND id = $1
        RETURNING *
    `;

    const response = await client.query(SQL, [
      id,
      productId,
      size,
      quantity,
      stockStatus,
    ]);

    return response.rows[0];
  } catch (error) {
    console.error('Error updating product inventory.', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE INVENTORY
const deleteInventoryById = async (id, productId) => {
  const client = await pool.connect();
  try {
    const SQL = `
          DELETE FROM product_inventory WHERE product_id = $2 AND id = $1
        `;
    await client.query(SQL, [id, productId]);
  } catch (error) {
    console.error('Error deleting product', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createInventory,
  fetchAllInventory,
  fetchInventoryById,
  updateInventoryById,
  deleteInventoryById,
};
