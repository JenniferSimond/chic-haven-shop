const express = require('express');
const env = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const { checkoutCart } = require('../database/index');

const {
  isAuthenticated,
  customerDataAuthorization,
  validateCartOrWishlistAccess,
} = require('../middleware/userAuth');

router.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

router.post(
  'process-payment/carts/:cartId/customers/:customerId',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { customerId, cartId } = req.params;
      const { customerAddress } = req.body;

      const customerOrder = await checkoutCart({ cartId, customerId });

      if (!customerOrder) {
        return res
          .status(404)
          .json({ message: 'Checkout error, cart not found.' });
      }

      const amount = parseFloat(customerOrder.order_total) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
        automatic_tax: { enabled: true },
        shipping: {
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
        order: customerOrder,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
