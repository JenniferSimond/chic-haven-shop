// index.js

const { createAdminRoles } = require('./models/adminRoles');

const { createAdmin } = require('./models/admin');

module.exports = {
  createAdminRoles,
  createAdmin,
};
