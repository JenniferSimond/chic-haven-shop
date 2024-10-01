const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// Function to create a new product review
const createReview = async (productId, customerId, rating, comment) => {
  const client = await pool.connect();

  try {
    const SQL = `
        INSERT INTO reviews (
          id, 
          product_id, 
          customer_id,
          rating, 
          comment, 
          created_at, 
          modified_at
        )
        VALUES (
          $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        RETURNING *;
    `;

    const response = await client.query(SQL, [
      uuidv4(),
      productId,
      customerId,
      rating,
      comment,
    ]);
    return response.rows[0];
  } catch (error) {
    console.error('Error creating review', error);
  } finally {
    client.release();
  }
};

// Fetch all reviews
const fetchAllReviews = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT * FROM reviews 
    `;

    const response = await client.query(SQL);
    return response.rows;
  } catch (error) {
    console.error('Error fetching reviews', error);
  } finally {
    client.release();
  }
};

// Fetch reviews for a specific product
const fetchReviewsByProduct = async (productId) => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT
        r.id,
        r.product_id,
        r.customer_id,
        r.rating,
        r.comment,
        r.created_at,
        r.modified_at,
        c.first_name,
        c.last_name
      FROM reviews r
      LEFT JOIN customers c
      ON r.customer_id = c.id
      WHERE r.product_id = $1
      ORDER BY r.rating DESC;
    `;

    const response = await client.query(SQL, [productId]);
    return response.rows; // Return the rows directly without RETURNING *
  } catch (error) {
    console.error(
      'Error fetching reviews for product with customer info.',
      error
    );
  } finally {
    client.release();
  }
};

// Fetch reviews by a specific user
const fetchReviewsByUser = async (customerId) => {
  const client = await pool.connect();

  try {
    const SQL = `
      SELECT
        r.id as id,
        r.product_id AS product_id,
        r.customer_id AS customer_id,
        r.rating,
        r.comment,
        r.created_at,
        c.first_name
        FROM reviews r
        LEFT JOIN customer c
        ON r.customer_id = c.id
      WHERE r.customer_id = $1
      ORDER BY r.rating DESC
    `;

    const response = await client.query(SQL, [customerId]);
    return response.rows;
  } catch (error) {
    console.error('Error fetching reviews by user.', error);
  } finally {
    client.release();
  }
};

// Update an existing product review
const updateProductReview = async (reviewId, rating, comment) => {
  const client = await pool.connect();

  try {
    const SQL = `
        UPDATE product_reviews 
        SET 
          rating = $2, 
          comment = $3, 
          modified_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *;
    `;
    const response = await client.query(SQL, [rating, comment, reviewId]);

    return response.rows[0];
  } catch (error) {
    console.error('Error updating product review', error);
  } finally {
    client.release();
  }
};

// Delete a product review
const deleteProductReview = async (reviewId) => {
  const client = await pool.connect();

  try {
    const SQL = `
        DELETE FROM product_reviews 
        WHERE id = $1 
        RETURNING *;
    `;
    const response = await client.query(SQL, [reviewId]);

    return response.rows[0]; // Return the deleted review details
  } catch (error) {
    console.error('Error deleting product review', error);
  } finally {
    client.release();
  }
};

module.exports = {
  createReview,
  fetchAllReviews,
  fetchReviewsByProduct,
  fetchReviewsByUser,
  updateProductReview,
  deleteProductReview,
};
