const express = require('express');
const router = express.Router();
const env = require('dotenv');

const {
  fetchCartAndItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  checkoutCart,
} = require('../database/index');

const {
  isAuthenticated,
  customerDataAuthorization,
  validateCartOrWishlistAccess,
} = require('../middleware/userAuth');

// Get Cart & Items
router.get(
  '/customers/:customerId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const cart = await fetchCartAndItems(customerId);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

//  Add Cart Item
router.post(
  '/:cartId/items',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { cartId } = req.params;
      const { productId, inventoryId, productSize, quantity } = req.body; // Get the size from the request body

      // Debugging logs
      console.log('Cart ID:', cartId);
      console.log('Product ID:', productId);
      console.log('Inventory ID:', inventoryId);
      console.log('Product Size:', productSize);
      console.log('Quantity:', quantity);
      const newCartItem = await addCartItem({
        cartId,
        productId,
        inventoryId,
        productSize,
        quantity,
      });
      res.status(201).json(newCartItem);
    } catch (error) {
      next(error);
    }
  }
);

// Update Cart Item
router.patch(
  '/:cartId/items/:itemId',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { cartId, itemId } = req.params;
      const { quantity } = req.body;
      const updatedCartItem = await updateCartItem({
        cartId,
        itemId,
        quantity,
      });
      if (!updatedCartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      res.json(updatedCartItem);
    } catch (error) {
      next(error);
    }
  }
);

// delete Cart Item
router.delete(
  '/:cartId/items/:itemId',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { cartId, itemId } = req.params;

      const deletedCartItem = await deleteCartItem(cartId, itemId);
      if (!deletedCartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      res.json(deletedCartItem);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:cartId/customers/:customerId/checkout',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { cartId, customerId } = req.params;

      console.log('cartId:', cartId); // Should output a UUID string
      console.log('customerId:', customerId); // Should output a UUID string

      const order = await checkoutCart({ cartId, customerId });

      // If successful, return order details
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
