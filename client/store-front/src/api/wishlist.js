import { API_URL } from './apiConfig';

// Get Cart/Items
const getWishlistAndItems = async (customerId) => {
  try {
    const response = await fetch(
      `${API_URL}/wishlists/customers/:${customerId}`
    );
    const wishlist = await response.json();

    console.log('Wishlist/Items -->', wishlist);
    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist', error);
  }
};

// Add Cart Item
const addWishlistItem = async (wishlistId, productId) => {
  try {
    const response = await fetch(`${API_URL}/wishlists/${wishlistId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wishlistId),
    });
    const addedItem = await response.json();
    console.log('Added Item -->', addedItem);
    return addedItem;
  } catch (error) {
    console.error('Error adding wishlist item.', error);
  }
};

export { getWishlistAndItems, addWishlistItem };
