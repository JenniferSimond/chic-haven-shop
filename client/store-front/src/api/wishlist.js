import { API_URL } from './apiConfig';

// get wishlist & Items
const getWishlistAndItems = async (customerId, token) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlists/customers/${customerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const wishlist = await response.json();

    console.log('Wishlist/Items -->', wishlist);
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist', error);
  }
};

// Add Cart Item
const addWishlistItem = async (token, wishlistId, productId) => {
  try {
    const response = await fetch(`${API_URL}/wishlists/${wishlistId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const addedItem = await response.json();
    console.log('Added Item -->', addedItem);
    return addedItem;
  } catch (error) {
    console.error('Error adding wishlist item.', error);
  }
};

const deleteWishlistItem = async (token, wishlistId, itemId) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlists/${wishlistId}/items/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Handle non-successful deletion
      throw new Error('Failed to delete wishlist item');
    }

    // Handle cases where no content is returned
    const result =
      response.headers.get('content-length') && (await response.json());

    console.log(
      'Deleted Wish Item(API.js)-->',
      result || { message: 'Item deleted successfully' }
    );
    return result || { message: 'Item deleted successfully' }; // Handle no body case
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    return { error: 'Failed to delete item' };
  }
};

export { getWishlistAndItems, addWishlistItem, deleteWishlistItem };
