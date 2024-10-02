const express = require('express');
const router = express.Router();

const {
  createReview,
  fetchAllReviews,
  fetchReviewsByProduct,
  fetchReviewsByUser,
  updateProductReview,
  deleteProductReview,
} = require('../database/index');

const {
  isAuthenticated,
  isAnyAdmin,
  isSiteAdmin,
  isSuperAdmin,
  customerDataAuthorization,
  canPostReviews,
} = require('../middleware/userAuth');

// Create Review
router.post('/', isAuthenticated, canPostReviews, async (req, res, next) => {
  try {
    const { productId, customerId, rating, comment } = req.body;
    const newReview = await createReview(
      productId,
      customerId,
      rating,
      comment
    ); // Ensure customerId is passed
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

// Fetch all reviews (admin-level access)
router.get('/', isAuthenticated, isAnyAdmin, async (req, res, next) => {
  try {
    const allReviews = await fetchAllReviews();
    if (!allReviews.length) {
      return res.status(404).json({ message: 'No reviews found.' });
    }
    res.json(allReviews);
  } catch (error) {
    next(error);
  }
});

// Fetch reviews for a specific product
router.get('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productReviews = await fetchReviewsByProduct(productId);

    if (!productReviews) {
      return res.status(404).json({ message: 'No reviews for this product.' });
    }
    res.json(productReviews);
  } catch (error) {
    next(error);
  }
});

// Fetch reviews by a specific user
router.get(
  '/customers/:customerId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const userReviews = await fetchReviewsByUser(customerId);

      if (!userReviews) {
        return res.status(404).json({ message: 'Userreviews not found' });
      }
      res.json(userReviews);
    } catch (error) {
      next(error);
    }
  }
);

// Update a review
router.patch(
  '/:reviewId',
  isAuthenticated,
  customerDataAuthorization,
  canPostReviews,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const updatedReview = await updateProductReview(
        reviewId,
        rating,
        comment
      );

      if (!updatedReview) {
        return res.status(404).json({ message: 'Review not found.' });
      }
      res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

// Delete a review
router.delete(
  '/:reviewId',
  isAuthenticated,
  customerDataAuthorization,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const deletedReview = await deleteProductReview(reviewId);

      if (!deletedReview) {
        return res.status(404).json({ message: 'Review not found.' });
      }
      res.json({ message: 'Review deleted successfully.', deletedReview });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
