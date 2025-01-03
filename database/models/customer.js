// customer.js

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// CREATE CUSTOMER

const createCustomer = async ({ lastName, firstName, email, password }) => {
  const client = await pool.connect();
  try {
    const SQL = `
        INSERT INTO customers (id, last_name, first_name, email, password, customer_status, review_permissions, created_at, modified_at)
        VALUES ($1, $2, $3, $4, $5, 'active', 'allowed', current_timestamp, current_timestamp)
        RETURNING *
    `;

    const response = await client.query(SQL, [
      uuidv4(),
      lastName,
      firstName,
      email,
      await bcrypt.hash(password, 10),
    ]);

    return response.rows[0];
  } catch (error) {
    console.error('Error creating customer.', error);
    throw error;
  } finally {
    client.release();
  }
};

// READ ALL CUSTOMERS

const fetchCustomers = async () => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM customers
      `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching customers', error);
    throw error;
  } finally {
    client.release();
  }
};

// READ CUSTOMER

const fetchCustomersByID = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT 
        cu.id,
        cu.first_name,
        cu.last_name,
        cu.email,
        cu.customer_status,
        cu.review_permissions,
        cu.created_at,
        ca.id AS cart_id,
        cu.created_at,
        wl.id AS wishlist_id
      FROM customers cu
      LEFT JOIN carts ca ON ca.customer_id = cu.id
      LEFT JOIN wishlists wl ON wl.customer_id = cu.id
      WHERE cu.id = $1;
    `;

    const response = await client.query(SQL, [id]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching customer.', error);
    throw error;
  } finally {
    client.release();
  }
};

const updateCustomerById = async (id, updatedCustomerData) => {
  const client = await pool.connect();

  try {
    const {
      last_name,
      first_name,
      email,
      newPassword,
      customer_status = 'active',
      review_permissions = 'allowed',
      originalPassword,
    } = updatedCustomerData;

    let hashedPassword;

    if (newPassword && originalPassword) {
      const getCurrentPasswordSQL = `
        SELECT password FROM customers WHERE id = $1
      `;
      const currentPasswordResponse = await client.query(
        getCurrentPasswordSQL,
        [id]
      );

      if (currentPasswordResponse.rows.length === 0) {
        throw new Error('Customer not found');
      }

      const currentPasswordHash = currentPasswordResponse.rows[0].password;

      // Verify the provided original password matches the stored hash
      const isMatch = await bcrypt.compare(
        originalPassword,
        currentPasswordHash
      );
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Hash the new password
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update customer data, using the hashed password if provided
    const SQL = `
        UPDATE customers
        SET
            last_name = COALESCE($2, last_name),
            first_name = COALESCE($3, first_name),
            email = COALESCE($4, email),
            password = COALESCE($5, password),
            customer_status = COALESCE($6, customer_status),
            review_permissions = COALESCE($7, review_permissions),
            modified_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
    `;

    const response = await client.query(SQL, [
      id,
      last_name,
      first_name,
      email,
      hashedPassword || password, // Pass hashed password if available otherwise, original password.
      customer_status,
      review_permissions,
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

// DELETE CUSTOMER

const deleteCustomerById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
        DELETE FROM customers WHERE id = $1
      `;
    await client.query(SQL, [id]);
  } catch (error) {
    console.error('Error deleting customer', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
};
