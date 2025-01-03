import { API_URL } from './apiConfig';

// Get Cart/Items
const getCartAndItems = async (token, customerId) => {
  try {
    const response = await fetch(`${API_URL}/carts/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const cart = await response.json();

    return cart;
  } catch (error) {
    console.error('Error fetching cart.', error);
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

    return addedItem;
  } catch (error) {
    console.error('Error adding cart item.', error);
  }
};

// update Cart Item
const updateCartItem = async (token, cartId, itemId, quantity) => {
  try {
    const response = await fetch(`${API_URL}/carts/${cartId}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    const updatedCartItem = await response.json();
    return updatedCartItem;
  } catch (error) {
    console.error('Error updating cart item.', error);
  }
};

// Delete Cart Item
const deleteCartItem = async (token, cartId, itemId) => {
  try {
    const response = await fetch(`${API_URL}/carts/${cartId}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
  } catch (error) {
    console.error('Error deleting cart item.', error);
  }
};

const cartCheckout = async (token, cartId, customerId) => {
  try {
    const response = await fetch(
      `${API_URL}/carts/${cartId}/customers/${customerId}/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const checkout = await response.json();
    return checkout;
  } catch (error) {
    console.error('Cart checkout error.', error);
  }
};

export {
  getCartAndItems,
  addCartIem,
  updateCartItem,
  deleteCartItem,
  cartCheckout,
};
