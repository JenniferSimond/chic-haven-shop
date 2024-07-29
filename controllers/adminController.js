const express = require('express');
const router = express('router');

const { createAdmin } = require('../database/index');

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

module.exports = router;
