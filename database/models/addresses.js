// Address Models
const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

const fetchCustomerAddresses = async () => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM customer_addresses
      `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching customer addresses.', error);
    throw error;
  } finally {
    client.release();
  }
};

const fetchCustomerAddressById = async (customerId) => {
  const client = await pool.connect();
  try {
    const SQL = `
        SELECT * FROM customer_addresses WHERE customer_id = $1
      `;

    const response = await client.query(SQL, [customerId]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching customer address.', error);
    throw error;
  } finally {
    client.release();
  }
};

const updateCustomerAddress = async (customerId, updatedAddressData) => {
  const client = await pool.connect();
  try {
    const { address_line1, address_line2, city, state, zipCode, country } =
      updatedAddressData;

    const SQL = `
            UPDATE customer_addresses
            SET
                address_line1 = COALESCE($2, address_line1),
                address_line2 = COALESCE($3, address_line2),
                city = COALESCE($4, city),
                state = COALESCE($5, state),
                zip_code = COALESCE($6, zip_code),
                country = COALESCE($7, country),
                modified_at = CURRENT_TIMESTAMP
            
            WHERE customer_id = $1
            RETURNING *    
        `;
    const response = await client.query(SQL, [
      customerId,
      address_line1,
      address_line2,
      city,
      state,
      zipCode,
      country,
    ]);
    if (response.rows.length === 0) {
      throw new Error('Customer address not found');
    }
    return response.rows[0];
  } catch (error) {
    console.error('Error updating customer address');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  fetchCustomerAddressById,
  fetchCustomerAddresses,
  updateCustomerAddress,
};
