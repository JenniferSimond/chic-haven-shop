const express = require('express');
const router = express.Router();

const {
  isAuthenticated,
  customerDataAuthorization,
  isAnyAdmin,
} = require('../middleware/userAuth');

const { fetchOrdersAndItems } = require('../database/index');

router.get(
  '/customers/:customerId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const orders = await fetchOrdersAndItems(customerId);
      if (!orders) {
        return res.status(404).json({ message: 'No order found.' });
      }
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
