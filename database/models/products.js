// Product Models
const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// CREATE PRODUCT
const createProduct = async ({
  name,
  description,
  price,
  image,
  sku,
  categoryName,
}) => {
  const client = await pool.connect();
  try {
    const categoryIdQuery = 'SELECT id FROM product_categories WHERE name = $1';
    const categoryResult = await client.query(categoryIdQuery, [categoryName]);

    if (categoryResult.rows.length === 0) {
      console.error(`Category ${categoryName} not found in database`);
      throw new Error('Invalid category');
    }

    const catId = categoryResult.rows[0].id;
    const SQL = `
        INSERT INTO products (id, name, description, price, image, sku, category_id, created_at, modified_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, current_timestamp, current_timestamp)
        RETURNING *
      `;

    const response = await client.query(SQL, [
      uuidv4(),
      name,
      description,
      price,
      image,
      sku,
      catId,
    ]);

    console.log('Product Successfully Created!', response.rows[0]);
    return response.rows[0];
  } catch (error) {
    console.error('Error creating product.', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH ALL PRODUCTS
const fetchProducts = async () => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT * FROM products
    `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching products.', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH PRODUCT
const fetchProductById = async ({ id }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'inventory_id', i.id,
              'size', i.size,
              'quantity', i.quantity,
              'stock_status', i.stock_status
            )
          ) FILTER (WHERE i.product_id IS NOT NULL), '[]'
        ) AS inventory
      FROM products p
      LEFT JOIN product_inventory i ON p.id = i.product_id
      WHERE p.id = $1
      GROUP BY p.id;
    `;

    const response = await client.query(SQL, [id]); // Make sure id is a UUID
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching product', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE PRODUCT
const updateProductById = async ({
  id,
  name,
  SKU,
  description,
  image,
  categoryId,
  price,
}) => {
  const client = await pool.connect();
  try {
    const SQL = `
          UPDATE PRODUCTS
          SET 
              name = COALESCE($2, name),
              SKU = COALESCE($3, SKU),
              description = COALESCE($4, description),
              image = COALESCE($5, image),
              category_id = COALESCE($6, category_id),
              price = COALESCE($7, price)
              
          WHERE id = $1
          REtURNING *
      `;

    const response = await client.query(SQL, [
      id,
      name,
      SKU,
      description,
      image,
      categoryId,
      price,
    ]);
    if (response.rows.length === 0) {
      throw new Error('Customer not found');
    }
    return response.rows[0];
  } catch (error) {
    console.error('Error updating customer', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE PRODUCT
const deleteProductById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
      DELETE FROM products WHERE id = $1 
    `;
    await client.query(SQL, [id]);
  } catch (error) {
    console.error('Error deleting product', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
};
