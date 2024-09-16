const express = require('express');
const router = express.Router();

const {
  fetchCartAndItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
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
// Add Cart Item Route
router.post(
  '/:cartId/items',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity, productSize } = req.body; // Get the size from the request body
      const newCartItem = await addCartItem({
        cartId,
        productId,
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
  '/items/:id',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cartId, quantity } = req.body;
      const updatedCartItem = await updateCartItem({ id, cartId, quantity });
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
  '/items/:id',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cartId } = req.body;
      const deletedCartItem = await deleteCartItem({ id, cartId });
      if (!deletedCartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      res.json(deletedCartItem);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
