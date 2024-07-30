const express = require('express');
const router = express('router');

const {
  createAdmin,
  fetchAdmins,
  fetchAdminByID,
  updateAdminById,
  deleteAdminById,
} = require('../database/index');

router.post('/register', async (req, res, next) => {
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
