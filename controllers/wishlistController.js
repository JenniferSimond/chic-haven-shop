// Wishlist Controller

const express = require('express');
const router = express.Router();

const {
  fetchWishlistAndItems,
  addItemToWishlist,
  moveWishlistItemToCart,
  deleteWishlistItem,
} = require('../database/index');

const {
  isAuthenticated,
  customerDataAuthorization,
  validateCartOrWishlistAccess,
} = require('../middleware/userAuth');

//  Add Wishlist Item
router.post(
  '/:wishlistId/items',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { wishlistId } = req.params;
      const { productId } = req.body;
      const newWishlistItem = await addItemToWishlist({
        wishlistId,
        productId,
      });
      res.status(201).json(newWishlistItem);
    } catch (error) {
      next(error);
    }
  }
);

// FETCH WISHLIST AND ITEMS
router.get(
  '/customers/:customerId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const cart = await fetchWishlistAndItems(customerId);
      if (!cart) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

// MOVE WISHLIST TO CART
router.post(
  '/cart',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { wishlistId, productId, customerId } = req.body;
      const cartItem = await moveWishlistItemToCart({
        wishlistId,
        productId,
        customerId,
      });
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE WISHLIST ITEM
router.delete(
  '/items/:id',
  isAuthenticated,
  validateCartOrWishlistAccess,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cartId } = req.body;
      const deletedCartItem = await deleteWishlistItem({ id, cartId });
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
