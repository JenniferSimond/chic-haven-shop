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

// CATEGORIES
const {
  createCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategoryByID,
  deleteCategoryById,
} = require('./models/categories');

// PRODUCTS
const {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
} = require('./models/products');

// PRODUCT INVENTORY
const {
  createInventory,
  fetchAllInventory,
  fetchInventoryById,
  UpdateInventoryById,
  DeleteInventoryById,
} = require('./models/inventory');

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
  // CATEGORIES
  createCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategoryByID,
  deleteCategoryById,
  //PRODUCTS
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
  //PRODUCT INVENTORY
  createInventory,
  fetchAllInventory,
  fetchInventoryById,
  UpdateInventoryById,
  DeleteInventoryById,
};
