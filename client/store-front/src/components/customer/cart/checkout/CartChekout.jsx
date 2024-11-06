import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CustomerContext } from "../../../../CustomerContext";
import { getToken } from "../../../shared/auth";
import { getStripeConfig, createPaymentIntent } from "../../../../api/stripe";
import AddressCheckbox from "./AddressCheckBox";
import { fetchCustomerAddress, updateCustomerAddress } from "../../../../api/customers";
import { cartCheckout } from "../../../../api/cart";

const CheckoutWrapper = styled.div`
    display: flex;
   flex-direction: column;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

   padding: 5% 10%;

    height: calc(100vh - 7rem - 3rem); 

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  
        padding: 0% 5%;
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem); 
         padding: 5% 5%;
    }

    @media (max-width: 500px) {
    padding: 2%;
}
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 560px) minmax(160px, 560px);
  //grid-template-columns: 1fr 1fr; 
  grid-template-rows: auto auto auto; 
  gap: 20px;
  // width: 1000px;
  max-length: 100%;
  max-height: 100%
  
`;

const Title = styled.div`
  grid-column: 1 / -1; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--mustard)); 
  text-align: center;
  border-radius: 3px;
  font-size: 2rem;
  font-weight: bold;
  padding: 2%;

  
  h1 {
  font-family: Cinzel; 
  font-size: 39px;
  color: rgb(var(--purple-mid));
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.34px;
  text-align: center;
  text-wrap: nowrap;

  @media (max-width: 950px) {
     font-size: 30px;
  }
  @media (max-width: 650px) {
     font-size: 25px;
  }


  @media (max-width: 500px) {
     font-size: 20px;
  }
  @media (max-width: 375px) {
     font-size: 22px;
  }
  
`;

const H2 = styled.h2`
  font-family: Cinzel; 
  font-size: 24px;
  color: ${props => props.$color || 'rgb(var(--cream))' };
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.32px;
  text-align: center;
  text-wrap: nowrap;

  @media (max-width: 950px) {
     font-size: 20px;
  }

  @media (max-width: 600px) {
     font-size: 17px;
  }
  @media (max-width: 500px) {
     font-size: 15px;
  }
  @media (max-width: 450px) {
     font-size: 14px;
  }
  @media (max-width: 395px) {
     font-size: 14px;
  }
`;

const Address = styled.div`
  grid-column: 1 / 2; // Left column
  grid-row: 2 / 4; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: rgb(var(--purple-light));
  padding: 7%;
  border-radius: 3px;
  gap: 15px;

`;

const BottomAddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: pink;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  align-self: center;
`;

const OrderDetails = styled.div`
  grid-column: 2 / 3; // Right column
  grid-row: 2 / 3; // Second row

  background-color: rgb(var(--purple-light));
  border-radius: 3px;

  padding: 7%;
`;

const PaymentDetails = styled.div`
  grid-column: 2 / 3; // Right column
  grid-row: 3 / 4; // Third row under Order Details
  flex-direction: column;
  justify-content: center;
  background-color: rgb(var(--mustard));
  padding: 7% 10%;
  gap: 15px;
  display: flex;
  border-radius: 3px;
  
  @media (max-width: 950px) {
    padding: 5% 7%;
    gap: 10px;
  }
`;




const Input = styled.input`
  padding: ${props => props.$padding ||  '8px 10px'};
  background-color: rgb(var(--cream));
  max-width: ${props => props.$maxWidth || '100%'};
  border: none;
  outline: none;
  border-radius: 3px;
  color: rgb(var(--purple-mid));
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.361px;
  text-align: ${props => props.$textAlign || 'start'};

  &:-webkit-autofill {
    box-shadow: 0 0 0 30px rgb(var(--cream)) inset !important;
    -webkit-box-shadow: 0 0 0 30px rgb(var(--cream)) inset !important;
    -webkit-text-fill-color: rgb(var(--purple-mid)) !important;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.35px;
    }

  @media (max-width 700px) {
    font-size: 11px;  
      letter-spacing: 0.1px;

      &:-webkit-autofill {
      font-size: 11px;
      
    }
  }

    @media (max-width: 600px) {
    font-size: 10px;

    &:-webkit-autofill {
    font-size: 10px;
  
  }

}


`;




const Button = styled.button`
  width: 60px;
  height: 60px;
  background-color: rgb(var(--ras-pink));
  border-radius: 50%;
  border: none;
  cursor: pointer;
  align-self: ${props => props.$alignSelf};
  margin: 10px 0px;

  @media (max-width: 950px) {
    width: 50px;
    height: 50px;
    margin: 5px 0px ;
  }

  @media (max-width: 500px) {
    width: 45px;
    height: 45px;
  }

`;

const CheckoutMessage = styled.div`
  display: flex;
  margin-bottom: 10px;
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  color: rgb(var(--purple-dark));
`;


const CartCheckout = () => {
  const navigate = useNavigate();
  const token = getToken();
  const { customerData } = useContext(CustomerContext);
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutMsg, setCheckoutMsg] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
  });
  const [originalAddress, setOriginalAddress] = useState({});
  
  useEffect(() => {
    const fetchClientSecret = async () => {
      console.log("Running fetchClientSecret useEffect");
      const customerName = `${customerData.first_name} ${customerData.last_name}`;
      if (customerData.cart_id && customerData.id) {
        
        console.log("Fetching client secret with:", { cartId: customerData.cart_id, customerId: customerData.id, token, address, customerName });
        
        try {
          const secret = await createPaymentIntent(token, customerData.id, address, customerName);
          console.log("Fetched client secret:", secret);
          setClientSecret(secret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
        }
      }
    };
    fetchClientSecret();
  }, [customerData.cart_id, customerData.id]);

  useEffect(() => {
    if (customerData.id) {
      const getCustomerAddress = async () => {
        try {
          const addressInDatabase = await fetchCustomerAddress(customerData.id);
          setOriginalAddress(addressInDatabase);
          setAddress(addressInDatabase);
        } catch (error) {
          console.error("Failed to fetch customer address:", error);
        }
      };
      getCustomerAddress();
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSaveAddress = async (resetCheckbox) => {
    if (JSON.stringify(address) !== JSON.stringify(originalAddress)) {
      const token = getToken();
      try {
        const updatedAddress = await updateCustomerAddress(customerData.id, address, token);
        setAddress(updatedAddress);
        resetCheckbox();
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };

  const handlePaymentSubmit = async (event) => {
    console.log("handlePaymentSubmit called"); // Debugging log
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      console.log("Stripe, elements, or clientSecret missing"); // Debugging log
      return;
    }
  
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            address: {
              line1: address.address_line1,
              line2: address.address_line2,
              city: address.city,
              state: address.state,
              postal_code: address.zip_code,
              country: address.country,
            },
          },
        },
      });
  
      if (error) {
        console.error("Payment failed:", error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        const checkoutData = await cartCheckout(token, customerData.cart_id, customerData.id );
        console.log('Checkout Data -->', checkoutData);
        if (checkoutData) {
          setCheckoutMsg(!checkoutMsg);
        }

        setTimeout(() => {
          setCheckoutMsg(!checkoutMsg);
          navigate('/cart')
        }, 1000);
      }
    } catch (error) {
      console.error("Error during payment submission:", error);
    }
  };

  return clientSecret ? (
    <CheckoutWrapper>
      <CheckoutMessage>{
        checkoutMsg == true ? 'Payment successful! Your order details will be emailed shortly.': ''
        }</CheckoutMessage>
      <CheckoutContainer>
        <Title><h1>Checkout Your Chic!</h1></Title>

        <Address>
          <H2>Address</H2>
          <Input
            placeholder="Address Line 1"
            name="address_line1"
            value={address.address_line1}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Apt, Suite, etc."
            name="address_line2"
            value={address.address_line2}
            onChange={handleInputChange}
          />
          <Input
            placeholder="City"
            name="city"
            value={address.city}
            onChange={handleInputChange}
          />
          <Input
            placeholder="State"
            name="state"
            value={address.state}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Zip Code"
            name="zip_code"
            value={address.zip_code}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Country"
            name="country"
            value={address.country}
            onChange={handleInputChange}
          />
          <BottomAddressWrapper>
            <AddressCheckbox onSave={handleSaveAddress} />
          </BottomAddressWrapper>
        </Address>

        <OrderDetails>
          <H2>Order Info</H2>
          {/* Add order detail items here */}
        </OrderDetails>

        <PaymentDetails>
          <H2 $color={'rgb(var(--purple-mid))'}>Payment Info</H2>
          <CardNumberElement />
       
            <CardExpiryElement  />
            <CardCvcElement  />
        
          <Button type='button' onClick={handlePaymentSubmit} $alignSelf="center">Submit</Button>
        </PaymentDetails>
      </CheckoutContainer>
    </CheckoutWrapper>
  ) :<CheckoutWrapper>Loading...</CheckoutWrapper>;
};

export default CartCheckout