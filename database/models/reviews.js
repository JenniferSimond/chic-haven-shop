// reviews.js

const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const createReview = async (userId, productId, rating, comment) => {
  const client = await pool.connect();

  try {
    const SQL = `
        INSERT INTO product_reviews (id, product_id, rating, comment, created_at)
    
    `;
  } catch (error) {}
};

const fetchAllReviews = async () => {};

const fetchReviewsByProduct = async () => {};

const fetchReviewsByUser = async () => {};

const updateProductReview = async () => {};

const deleteProductReview = async () => {};
