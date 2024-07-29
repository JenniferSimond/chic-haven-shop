const pool = require('../tables').pool;
const { v4: uuidv4 } = require('uuid');

// Create Admin Roles

const createAdminRoles = async () => {
  const client = await pool.connect();
  const SQL = `
        INSERT INTO admin_roles(id, admin_type, created_at, modified_at)
        VALUES
            ($1, 'admin', current_timestamp, current_timestamp),
            ($2, 'site_admin', current_timestamp, current_timestamp),
            ($3, 'super_admin', current_timestamp, current_timestamp)
    `;

  try {
    await client.query(SQL, [uuidv4(), uuidv4(), uuidv4()]);
    console.log('Admin Roles Successfully Created!');
  } catch (error) {
    console.error('Error Creating Roles', error.stack);
  } finally {
    client.release();
  }
};

module.exports = {
  createAdminRoles,
};
