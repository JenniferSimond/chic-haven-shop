import { API_URL } from './apiConfig';

// Get Cart/Items
const getCartAndItems = async (customerId) => {
  try {
    const response = await fetch(`${API_URL}/carts/customers/:${customerId}`);
    const cart = await response.json();

    console.log('Cart/Items (API.js) -->', cart);
    return cart;
  } catch (error) {
    console.error('Error fetching cart', error);
  }
};

// Add Cart Item
const addCartIem = async (
  token,
  cartId,
  productId,
  inventoryId,
  productSize,
  quantity
) => {
  try {
    const response = await fetch(`${API_URL}/carts/${cartId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, inventoryId, productSize, quantity }),
    });
    const addedItem = await response.json();
    console.log('Added Item -->', addedItem);
    return addedItem;
  } catch (error) {
    console.error('Error adding cart item', error);
  }
};

export { getCartAndItems, addCartIem };
