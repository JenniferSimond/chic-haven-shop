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

const createPaymentIntent = async (
  token,
  customerId,
  address,
  customerName
) => {
  try {
    const response = await fetch(
      `${API_URL}/stripe/process-payment/customers/${customerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerAddress: address, customerName }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating payment intent:', errorText);
      throw new Error(`Failed to create payment intent: ${errorText}`);
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
  }
};

export { getStripeConfig, createPaymentIntent };
