// Categories Model

const { v4: uuidv4 } = require('uuid');
const pool = require('../databaseConfig');

const createCategory = async ({ name, modifiedBy }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        INSERT INTO categories (id, name, updated_at, created_at, modified_at, modified_by)
        VALUES ($1, $2, current_timestamp, current_timestamp, $3)
        ON CONFLICT (name) DO NOT UPDATE
        SET updated_at = excluded.updated_at, modified_at = excluded.modified_at, modified_by = excluded.modified_by
        RETURNING *;
    `;

    const response = await client.query(SQL, [uuidv4(), name, modifiedBy]);
    return response.rows[0];
  } catch (error) {
    console.error('Error creating category.', error);
    throw error;
  } finally {
    client.release();
  }
};

const fetchCategories = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM categores
    `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching categories.', error);
    throw error;
  } finally {
    client.release();
  }
};

const fetchCategoryById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM categories WHERE id = $1 
    `;

    const response = await client.query(SQL, [id]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching category.', error);
    throw error;
  } finally {
    client.release();
  }
};

const updateCategoryByID = async (id, updatedData, modifiedBy) => {
  const client = await pool.connect();
  try {
    const { name, is_deleted = false } = updatedData;

    const SQL = `
        UPDATE categories
            SET
                name = COALESCE($2, name),
                is_deleted = $3,
                modified_by = $4,
                modified_by = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;   
    `;

    const response = await client.query(SQL, [id, name, is_deleted]);
    return response.rows[0];
  } catch (error) {}
};

const deleteCategoryById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
          DELETE FROM categories WHERE id = $1
        `;
    await client.query(SQL, [id]);
  } catch (error) {
    console.error('Error deleting category.', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategoryByID,
  deleteCategoryById,
};
