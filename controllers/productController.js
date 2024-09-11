// Products Controller

const express = require('express');
const router = express.Router();

const {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
  createInventory,
  UpdateInventoryById,
  fetchAllInventory,
  fetchInventoryById,
  DeleteInventoryById,
} = require('../database/index');

// Create Product
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, image, sku, categoryName } = req.body;
    const newProduct = await createProduct(
      name,
      description,
      price,
      image,
      sku,
      categoryName
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Get Products
router.get('/', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    if (!products.length) {
      return res.status(404).json({ message: 'No Products Found.' });
    }
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get Product
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await fetchProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found.' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Update Product
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, SKU, description, image, category_id, price, discount_id } =
      req.body;
    const updatedProduct = await updateProductById(
      id,
      name,
      SKU,
      description,
      image,
      category_id,
      price,
      discount_id
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product Not Found.' });
    }
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// Delete Product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteProductById(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// PRODUCT INVENTORY

// Create Inventory
router.post('/:product_id/inventory', async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { size, quantity } = req.body;
    const newInventory = await createInventory({
      product_id,
      size,
      quantity,
    });
    res.status(201).json(newInventory);
  } catch (error) {
    next(error);
  }
});

// Get All Inventory
router.get('/inventory', async (req, res, next) => {
  try {
    const { stock_status, size } = req.query; // Add query parameters for filtering
    let inventory = await fetchAllInventory();

    // Filter by stock status if provided
    if (stock_status) {
      inventory = inventory.filter(
        (item) => item.stock_status === stock_status
      );
    }

    // Filter by size if provided
    if (size) {
      inventory = inventory.filter((item) => item.size === size);
    }

    if (!inventory.length) {
      return res.status(404).json({ message: 'No Inventory Found.' });
    }

    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Get All Inventory
router.get('/inventory', async (req, res, next) => {
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
router.get('/:product_id/inventory', async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const inventory = await fetchInventoryById(product_id);
    if (!inventory.length) {
      return res
        .status(404)
        .json({ message: 'Inventory Not Found for this Product.' });
    }
    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Update Inventory
router.patch('/:product_id/inventory/:inventory_id', async (req, res, next) => {
  try {
    const { product_id, inventory_id } = req.params;
    const { size, quantity, stock_status } = req.body;
    const updatedInventory = await UpdateInventoryById(
      inventory_id,
      product_id,
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
});

// Delete Inventory
router.delete(
  '/:product_id/inventory/:inventory_id',
  async (req, res, next) => {
    try {
      const { product_id, inventory_id } = req.params;
      await DeleteInventoryById(inventory_id, product_id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// PRODUCT REVIEWS

module.exports = router;
