// Customer Controller

const express = require('express');
const router = express.Router();

const errorHandler = require('../middleware/errorHandler');

const {
  isAuthenticated,
  customerDataAuthorization,
  isAnyAdmin,
} = require('../middleware/userAuth');

const {
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
  authenticateCustomer,
  findUserByToken,
} = require('../database/index');

// GET CUSTOMER DATA BY TOKEN
router.get('/auth/me', isAuthenticated, async (req, res, next) => {
  try {
    // The isAuthenticated middleware will populate req.user based on the token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    // Fetch additional customer details if necessary
    const customer = await fetchCustomersByID(user.id); // Assuming you have a function like this

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return customer details
    res.status(200).json({
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      cart_id: customer.cart_id,
      wishlist_id: customer.wishlist_id,
      customer_status: customer.customer_status,
      review_permissions: customer.review_permissions,
    });
  } catch (error) {
    next(error);
  }
});

// Customer Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { lastName, firstName, email, password } = req.body;
    const newCustomer = await createCustomer({
      lastName,
      firstName,
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
router.get('/', isAuthenticated, isAnyAdmin, async (req, res, next) => {
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
