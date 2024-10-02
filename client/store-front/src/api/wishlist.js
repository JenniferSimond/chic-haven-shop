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

export { getWishlistAndItems, addWishlistItem };
