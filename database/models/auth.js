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
      LEFT JOIN admin_roles rt 
      ON at.role_id = rt.id
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

    await setAppUserId(admin.id);

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
      SELECT c.id AS cart_id, w.id AS wishlist_id, cu.id, cu.password, cu.last_name, cu.first_name, cu.customer_status, cu.review_permissions
      FROM customers cu
      LEFT JOIN carts c ON c.customer_id = cu.id
      LEFT JOIN wishlists w ON w.customer_id = cu.id
      WHERE cu.email = $1;
    `;

    const response = await client.query(SQL, [email]);
    const customer = response.rows[0];

    if (!customer) {
      const error = new Error('Account Not Found');
      error.status = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      const error = new Error('Invalid Password');
      error.status = 401;
      throw error;
    }

    await setAppUserId(customer.id);

    const token = jwt.sign(
      {
        id: customer.id,
        role: 'customer',
        cart_id: customer.cart_id, // Add cart_id to the token
        wishlist_id: customer.wishlist_id, // Add wishlist_id to the token
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
        cart_id: customer.cart_id, // Include cart_id in the response
        wishlist_id: customer.wishlist_id, // Include wishlist_id in the response
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

const setAppUserId = async (userId) => {
  const client = await pool.connect();

  try {
    const SQL = `SET myapp.user_id = '${userId}'`; // Interpolate the userId directly
    await client.query(SQL);
    console.log('User ID set for session:', userId);
  } catch (error) {
    console.error('Error setting myapp.user_id', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  authenticateAdmin,
  authenticateCustomer,
  findUserByToken,
};
