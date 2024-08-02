// Admin Controller
const express = require('express');
const router = express.Router();

const {
  createAdmin,
  fetchAdmins,
  fetchAdminByID,
  updateAdminById,
  deleteAdminById,
  authenticateAdmin,
} = require('../database/index');

const { isAuthenticated } = require('./shared/userAuth');

// REGISTER
router.post('/register', isAuthenticated, async (req, res, next) => {
  try {
    const { last_name, first_name, email, password, role } = req.body;
    const newAdmin = await createAdmin({
      last_name,
      first_name,
      email,
      password,
      role,
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const authenticatedAdmin = await authenticateAdmin({
      email,
      password,
    });
    res.status(200).json(authenticatedAdmin);
  } catch (error) {
    next(error);
  }
});

// GET ALL ADMINS
router.get('/', async (req, res, next) => {
  try {
    const admins = await fetchAdmins();
    if (!admins) {
      return res.json({ message: 'No Admins Found' });
    }
    res.json(admins);
  } catch (error) {
    next(error);
  }
});

//GET ADMIN BY ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await fetchAdminByID(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin Not Found' });
    }
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// UPDATE ADMIN
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedAdminDetails = await updateAdminById(id, updatedData);
    if (!updatedAdminDetails) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(updatedAdminDetails);
  } catch (error) {
    next(error);
  }
});

// DELETE ADMIN
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAdminById(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
