
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CartCheckout from './CartChekout';
import { getStripeConfig } from '../../../../api/stripe';




let stripePromise;

const CheckoutPage = () => {
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    const initializeStripe = async () => {
      if (!stripePromise) {
        try {
          const publishableKey = await getStripeConfig();
          if (publishableKey) {
            stripePromise = loadStripe(publishableKey);
            setIsStripeReady(true);
          } else {
            console.error("Failed to load Stripe publishable key.");
          }
        } catch (error) {
          console.error("Error fetching Stripe config:", error);
        }
      } else {
        setIsStripeReady(true);
      }
    };
    initializeStripe();
  }, []);

  

  if (!isStripeReady) return <p>Loading...</p>;

  return (
    <div>

    <Elements stripe={stripePromise}>
      <CartCheckout />
    </Elements>
    </div>
  );
};

export default CheckoutPage;
