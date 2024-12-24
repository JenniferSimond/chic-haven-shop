import { API_URL } from './apiConfig';

// Create a Review
const createReview = async (token, productId, customerId, rating, comment) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, customerId, rating, comment }),
    });

    const newReview = await response.json();
    return newReview;
  } catch (error) {
    console.error('Error creating review', error);
  }
};

// Fetch All Reviews (admin-level access)
const fetchAllReviews = async (token) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allReviews = await response.json();
    return allReviews;
  } catch (error) {
    console.error('Error fetching all reviews', error);
  }
};

// Fetch Reviews by Product
const fetchReviewsByProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const productReviews = await response.json();
    return productReviews;
  } catch (error) {
    console.error('Error fetching reviews for product', error);
  }
};

// Fetch Reviews by User
const getReviewsByUser = async (customerId, token) => {
  try {
    const response = await fetch(`${API_URL}/reviews/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const userReviews = await response.json();
    return userReviews;
  } catch (error) {
    console.error('Error fetching reviews by user', error);
  }
};

// Update a Review
const updateReview = async (token, reviewId, rating, comment) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    const updatedReview = await response.json();
    return updatedReview;
  } catch (error) {
    console.error('Error updating review', error);
  }
};

// Delete a Review
const deleteReview = async (token, reviewId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting review', error);
  }
};

export {
  createReview,
  fetchAllReviews,
  fetchReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
};
