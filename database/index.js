// index.js

// AUTH
const {
  authenticateAdmin,
  authenticateCustomer,
  findUserByToken,
} = require('./models/auth');

// ADMINS
const {
  createAdminRoles,
  createAdmin,
  fetchAdmins,
  fetchAdminByID,
  updateAdminById,
  deleteAdminById,
} = require('./models/admin');

// CUSTOMERS
const {
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
} = require('./models/customer');

module.exports = {
  // AUTH
  authenticateAdmin,
  authenticateCustomer,
  findUserByToken,
  // ADMINS
  createAdminRoles,
  createAdmin,
  fetchAdmins,
  fetchAdminByID,
  updateAdminById,
  deleteAdminById,
  // CUSTOMERS
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
};
