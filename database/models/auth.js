// Auth Models
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'shhhlocal';

const pool = require('../databaseConfig');

const authenticateAdmin = async ({ email, password }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT 
        at.*,
        rt.admin_type
      FROM admins at
      LEFT JOIN admin_roles rt ON at.role_id = rt.id
      WHERE at.email = $1;
    `;

    const response = await client.query(SQL, [email]);
    const admin = response.rows[0];

    if (!admin) {
      const error = new Error('Account Not Found');
      error.status = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      const error = new Error('Invalid Password');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.admin_type,
        admin_type: admin.admin_type,
      },
      secret,
      { expiresIn: '30m' }
    );

    return {
      userDetails: {
        id: admin.id,
        last_name: admin.last_name,
        first_name: admin.first_name,
        role: admin.admin_type,
      },
      token,
    };
  } catch (error) {
    console.error('Error Authenticating Admin', error);
    throw error;
  } finally {
    client.release();
  }
};

const authenticateCustomer = async ({ email, password }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT id, password, last_name, first_name, customer_status, review_permissions
      FROM customers
      WHERE email = $1;
    `;

    const response = await client.query(SQL, [email]);
    const customer = response.rows[0];

    if (!customer) {
      const error = new Error('Account Not Found');
      error.status = 401;
      throw error;
    }

    if (customer.customer_status === 'banned') {
      const error = new Error('User Account Banned');
      error.status = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      const error = new Error('Invalid Password');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: customer.id,
        role: 'customer',
        customer_status: customer.customer_status,
        review_permissions: customer.review_permissions,
      },
      secret,
      { expiresIn: '1h' }
    );

    return {
      userDetails: {
        id: customer.id,
        last_name: customer.last_name,
        first_name: customer.first_name,
        role: 'customer',
        customer_status: customer.customer_status,
        review_permissions: customer.review_permissions,
      },
      token,
    };
  } catch (error) {
    console.error('Error Authenticating Customer', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const findUserByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    const customError = new Error('Not Authorized');
    customError.status = 401;
    throw customError;
  }
};

module.exports = {
  authenticateAdmin,
  authenticateCustomer,
  findUserByToken,
};
