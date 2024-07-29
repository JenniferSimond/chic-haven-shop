// ADMIN MODELS

const pool = require('../tables').pool;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'shhhlocal';

// LOGIN

// REGISTER
const createAdmin = async ({
  last_name,
  first_name,
  email,
  password,
  role,
}) => {
  const client = await pool.connect();
  try {
    const roleQuery = 'Select id from admin_roles WHERE admin_type = $1';
    const roleResult = await client.query(roleQuery, [role]);

    if (roleResult.rows.length === 0) {
      console.error(`Role ${role} not found in database`);
      throw new Error('Invalid role');
    }
    const roleId = roleResult.rows[0].id;

    const SQL = `
        INSERT INTO admins (id, last_name, first_name, email, password, role_id, created_at, modified_at)
        VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp) 
        RETURNING *
    `;

    const response = await client.query(SQL, [
      uuidv4(),
      last_name,
      first_name,
      email,
      await bcrypt.hash(password, 10),
      roleId,
    ]);

    return response.rows[0];
  } catch (error) {
    console.error('Error creating admin.', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH ALL ADMINS

const fetchAdmins = async () => {};

// FETCH ADMIN BY ID

const fetchAdminByID = async () => {};

// UPDATE ADMIN BY ID

// DELETE ADMIN BY ID

module.exports = {
  createAdmin,
};
