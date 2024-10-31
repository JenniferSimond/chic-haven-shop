import { API_URL } from './apiConfig';

const getStripeConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/stripe/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const config = await response.json();
    return config.publishableKey;
  } catch (error) {
    console.error('Error fetching Stripe config.', error);
  }
};

const createPaymentIntent = async (token, cartId, customerId, address) => {
  try {
    const response = await fetch(
      `${API_URL}/stripe/process-payment/carts/${cartId}/customers/${customerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerAddress: address }),
      }
    );
    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent.', error);
  }
};

export { getStripeConfig, createPaymentIntent };
