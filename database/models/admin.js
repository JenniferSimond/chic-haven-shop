// ADMIN MODELS

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// CREATE ADMIN ROLE

const createAdminRoles = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
    INSERT INTO admin_roles(id, admin_type, created_at, modified_at)
    VALUES
        ($1, 'admin', current_timestamp, current_timestamp),
        ($2, 'site_admin', current_timestamp, current_timestamp),
        ($3, 'super_admin', current_timestamp, current_timestamp)
`;
    await client.query(SQL, [uuidv4(), uuidv4(), uuidv4()]);
  } catch (error) {
    console.error('Error creating roles', error.stack);
  } finally {
    client.release();
  }
};

// REGISTER
const createAdmin = async ({ lastName, firstName, email, password, role }) => {
  const client = await pool.connect();
  try {
    const roleQuery = 'SELECT id FROM admin_roles WHERE admin_type = $1';
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
      lastName,
      firstName,
      email,
      await bcrypt.hash(password, 10),
      roleId,
    ]);

    return response.rows[0];
  } catch (error) {
    // ROLL BACK IF NO ROLE FOUND
    console.error('Error creating admin.', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH ALL ADMINS
const fetchAdmins = async () => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT * FROM admins
    `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching admins', error);
    throw error;
  } finally {
    client.release();
  }
};

// FETCH ADMIN BY ID
const fetchAdminByID = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT
        a.id AS adminId,
        a.last_name,
        a.first_name,
        a.email,
        a.created_at,
        ar.admin_type AS adminRole
      FROM admins a
      LEFT JOIN admin_roles ar ON ar.id = a.role_id
      WHERE a.id = $1;
    `;

    const response = await client.query(SQL, [id]);
    return response.rows[0];
  } catch (error) {
    console.error('Error fetching admin', error);
    throw error;
  } finally {
    client.release();
  }
};

// UPDATE ADMIN BY ID
const updateAdminById = async (id, updatedAdminData) => {
  const client = await pool.connect();
  try {
    const { lastName, firstName, email, password, role } = updatedAdminData;

    let roleId;
    if (role) {
      // Fetch the role ID
      const roleQuery = 'SELECT id FROM admin_roles WHERE admin_type = $1';
      const roleResult = await client.query(roleQuery, [role]);

      if (roleResult.rows.length === 0) {
        console.error(`Role ${role} not found in database`);
        throw new Error('Invalid role');
      }
      roleId = roleResult.rows[0].id;
    }

    // Hash the password if provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const SQL = `
      UPDATE admins
      SET
        last_name = COALESCE($2, last_name),
        first_name = COALESCE($3, first_name),
        email = COALESCE($4, email),
        password = COALESCE($5, password),
        role_id = COALESCE($6, role_id),
        modified_at = current_timestamp
      WHERE id = $1
      RETURNING *;
    `;

    const response = await client.query(SQL, [
      id,
      lastName,
      firstName,
      email,
      hashedPassword,
      roleId,
    ]);

    if (response.rows.length === 0) {
      throw new Error(`Admin with ID ${id} not found`);
    }

    return response.rows[0];
  } catch (error) {
    console.error('Error updating admin', error);
    throw error;
  } finally {
    client.release();
  }
};

// DELETE ADMIN BY ID
const deleteAdminById = async (id) => {
  const client = await pool.connect();
  try {
    const SQL = `
      DELETE FROM admins WHERE id = $1
    `;
    await client.query(SQL, [id]);
  } catch (error) {
    console.error('Error deleting admin', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createAdminRoles,
  createAdmin,
  fetchAdmins,
  fetchAdminByID,
  updateAdminById,
  deleteAdminById,
};
