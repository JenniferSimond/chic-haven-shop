// Customer Controller

const express = require('express');
const router = express.Router();

const errorHandler = require('./shared/errorHandler');

const {
  isAuthenticated,
  customerDataAuthorization,
  adminAuthorization,
} = require('./shared/userAuth');

const {
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
  authenticateCustomer,
} = require('../database/index');

// Customer Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { last_name, first_name, email, password } = req.body;
    const newCustomer = await createCustomer({
      last_name,
      first_name,
      email,
      password,
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authenticatedCustomer = await authenticateCustomer({
      email,
      password,
    });
    res.status(200).json(authenticatedCustomer);
  } catch (error) {
    next(error);
  }
});

// GET ALL CUSTOMERS --> ADMINS ONLY
router.get('/', adminAuthorization, async (req, res, next) => {
  try {
    const customers = await fetchCustomers();
    if (!customers) {
      return res.json({ message: 'No Customers Found.' });
    }
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// GET CUSTOMER BY ID
router.get(
  '/:id',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await fetchCustomersByID(id);
      if (!customer) {
        return res.json({ message: 'No Customer Found.' });
      }
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
);

// UPDATE CUSTOMER BY ID
router.patch(
  '/:id',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedCustomerDetails = await updateCustomerById(id, updatedData);
      if (!updatedCustomerDetails) {
        return res.status(404).json({ message: 'Customer Not Found' });
      }
      res.json(updatedCustomerDetails);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE CUSTOMER
router.delete(
  '/:id',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteCustomerById(id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.use(errorHandler);
module.exports = router;
