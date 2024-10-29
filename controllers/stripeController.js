const express = require('express');
const env = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const router = express.Router();

const {
  isAuthenticated,
  customerDataAuthorization,
  validateCartOrWishlistAccess,
} = require('../middleware/userAuth');

router.post(
  'process-stipe-payment',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res) => {
    const { amount } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
