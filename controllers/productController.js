// Products Controller

const express = require('express');
const router = express.Router();

const {
  createProduct,
  fetchProducts,
  fetchProductById,
  updateProductById,
  deleteProductById,
} = require('../database/models/products');

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

module.exports = router;
