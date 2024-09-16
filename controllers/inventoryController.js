const express = require('express');
const router = express.Router();

const {
  createInventory,
  fetchAllInventory,
  fetchInventoryById,
  updateInventoryById,
  deleteInventoryById,
} = require('../database/index');

const {
  isAuthenticated,
  isSiteAdmin,
  isSuperAdmin,
  isAnyAdmin,
} = require('../middleware/userAuth');

// Get All Inventory
router.get('/', isAuthenticated, isAnyAdmin, async (req, res, next) => {
  try {
    const inventory = await fetchAllInventory();
    if (!inventory.length) {
      return res.status(404).json({ message: 'No Inventory Found.' });
    }
    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Get Inventory by Product ID
router.get(
  '/:product_id',
  isAuthenticated,
  isAnyAdmin,
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      const inventory = await fetchInventoryById(productId);
      if (!inventory.length) {
        return res
          .status(404)
          .json({ message: 'Inventory Not Found for this Product.' });
      }
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  }
);

// Create Inventory
router.post('/', isAuthenticated, isSuperAdmin, async (req, res, next) => {
  try {
    const { productId, size, quantity } = req.body;
    const newInventory = await createInventory({ productId, size, quantity });
    res.status(201).json(newInventory);
  } catch (error) {
    next(error);
  }
});

// Update Inventory by ID
router.patch(
  '/:inventoryId',
  isAuthenticated,
  isSiteAdmin,
  async (req, res, next) => {
    try {
      const { inventoryId } = req.params;
      const { size, quantity, stock_status } = req.body;
      const updatedInventory = await updateInventoryById(
        inventoryId,
        size,
        quantity,
        stock_status
      );
      if (!updatedInventory) {
        return res.status(404).json({ message: 'Inventory Not Found.' });
      }
      res.json(updatedInventory);
    } catch (error) {
      next(error);
    }
  }
);

// Delete Inventory by ID
router.delete(
  '/:inventoryId',
  isAuthenticated,
  isSuperAdmin,
  async (req, res, next) => {
    try {
      const { inventoryId } = req.params;
      await deleteInventoryById(inventoryId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
