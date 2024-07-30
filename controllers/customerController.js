// Customer Controller

const express = require('express');
const router = express('router');

const {
  createCustomer,
  fetchCustomers,
  fetchCustomersByID,
  updateCustomerById,
  deleteCustomerById,
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

// FINISH AUTH ME
router.get('/auth/me', async (req, res, next) => {
  try {
  } catch (error) {}
});

// ADD LOGIN MODEL

// GET ALL CUSTOMERS
router.get('/', async (req, res, next) => {
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
router.get('/:id', async (req, res, next) => {
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
});

// UPDATE CUSTOMER BY ID
router.patch('/:id', async (req, res, next) => {
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
});

// DELETE CUSTOMER
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCustomerById(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;