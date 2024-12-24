import { API_URL } from './apiConfig';

// get orders and ordered items
const getOrderAndItems = async (customerId, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error fetching orders', error);
  }
};

export { getOrderAndItems };
