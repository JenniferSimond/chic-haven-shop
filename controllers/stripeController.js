const express = require('express');
const env = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const { fetchCartAndItems } = require('../database/index');

const {
  isAuthenticated,
  customerDataAuthorization,
  validateCartOrWishlistAccess,
} = require('../middleware/userAuth');

// Endpoint to get publishable key
router.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Endpoint to create a payment intent
router.post(
  '/process-payment/customers/:customerId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res) => {
    try {
      const { customerId } = req.params;
      const { customerAddress, customerName } = req.body;

      // Fetch cart details without checking out
      const cart = await fetchCartAndItems(customerId);

      if (!cart || !cart.cart_total) {
        return res
          .status(404)
          .json({ message: 'Cart not found or cart total is invalid.' });
      }

      const amount = Math.round(cart.cart_total * 100); // Use cart_total

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        shipping: {
          name: customerName,
          address: {
            line1: customerAddress.address_line1,
            line2: customerAddress.address_line2,
            city: customerAddress.city,
            state: customerAddress.state,
            postal_code: customerAddress.zip_code,
            country: customerAddress.country,
          },
        },
      });

      res.status(201).json({
        cart,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      res.status(500).json({
        message: 'Internal Server Error during payment intent creation',
      });
    }
  }
);

module.exports = router;
