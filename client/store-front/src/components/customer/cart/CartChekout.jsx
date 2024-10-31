import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CustomerContext } from "../../../CustomerContext";
import { getToken } from "../../shared/auth";
import { getStripeConfig, createPaymentIntent } from "../../../api/stripe";
import AddressCheckbox from "./AddressCheckBox";
import { fetchCustomerAddress, updateCustomerAddress } from "../../../api/customers";

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
  grid-template-columns: minmax(160px, 1fr) minmax(160px, 1fr);
  //grid-template-columns: 1fr 1fr; 
  grid-template-rows: auto auto auto; 
  gap: 20px;
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
  padding: 7%;
  gap: 15px;
  display: flex;
  border-radius: 3px;
  
  @media (max-width: 950px) {
    padding: 5% 7%;
    gap: 10px;
  }
`;

const InnerPaymentDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5px;
  
  @media (max-width: 560px) {
   display: none;
  }
`;

const InnerPaymentDetailsMobile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  display: none;
  gap: 15px; 
  // height: 70px;
  


  @media (max-width: 560px) {
   display: flex;
  }
`;

const TopInnerMobile = styled.div`
  display: flex;
  justify-content: space-between;

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
  @media (max-width: 450px) {
    width: 40px;
    height: 40px;
  }
`;

const CartCheckout = () => {
  const token = getToken();
  const { customerData } = useContext(CustomerContext);
  const [pageRefresh, setPageRefresh] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  const [originalAddress, setOriginalAddress] = useState(null);
  const [address, setAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
  });


  
  // Fetch customer address from database and initialize form fields
  useEffect(() => {
    if (customerData.id) {
      const getCustomerAddress = async () => {
        try {
          const addressInDataBase = await fetchCustomerAddress(customerData.id);
         
            setOriginalAddress(addressInDataBase);
            setAddress(addressInDataBase);
          
        } catch (error) {
          console.error("Failed to fetch customer address:", error);
        }
      };
      getCustomerAddress();
    }
  }, [pageRefresh]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSaveAddress = async (resetCheckbox) => {
    if (JSON.stringify(address) !== JSON.stringify(originalAddress)) {
      try {
        const updatedAddress = await updateCustomerAddress(customerData.id, address, token);
        if (updatedAddress) {
          console.log("Address updated successfully.");
         // setOriginalAddress(updatedAddress);
         
          setAddress(updatedAddress);
          setPageRefresh(!pageRefresh);
          resetCheckbox(); // Reset the checkbox after saving
        }
      } catch (error) {
        console.error("Error updating address:", error);
      }
    } else {
      console.log("No changes detected in the address.");
    }
  };

  useEffect(() => {
    const initializeStripe = async () => {
      const publishableKey = await getStripeConfig();
      setStripePromise(loadStripe(publishableKey));
    };
    initializeStripe();
  }, []);

  useEffect(() => {
    // Fetch client secret for payment after fetching customer data and address
    const fetchClientSecret = async () => {
      if (customerData.cartId && customerData.customerId && address) {
        const getClientSecret = await createPaymentIntent(token, customerData.cartId, customerData.customerId, address);
        console.log('Secret-->', getClientSecret)
        setClientSecret(getClientSecret);
        console.log(clientSecret)
      }
    };
    fetchClientSecret();
   
  }, [customerData.id, originalAddress]);
  
  return (
    <CheckoutWrapper>
      <CheckoutContainer>
        <Title><h1>Checkout Your Chic!</h1></Title>
        
        <Address>
          <H2>Address</H2>
          <Input
            placeholder="Address Line 1"
            name="address_line1"
            value={address.address_line1}
            onChange={handleAddressChange}
          />
          <Input
            placeholder="Apt, Suite, etc."
            name="address_line2"
            value={address.address_line2}
            onChange={handleAddressChange}
          />
          <Input
            placeholder="City"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
          />
          <Input
            placeholder="State"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
          />
          <Input
            placeholder="Zip Code"
            name="zip_code"
            value={address.zip_code}
            onChange={handleAddressChange}
          />
          <Input
            placeholder="Country"
            name="country"
            value={address.country}
            onChange={handleAddressChange}
          />
          <BottomAddressWrapper>
            <AddressCheckbox onSave={(resetCheckbox) => handleSaveAddress(resetCheckbox)} />
            <Button $alignSelf={'flex-end'} />
          </BottomAddressWrapper>
        </Address>
        
        <OrderDetails>
          <H2>Order Info</H2>
          {/* Add order detail items here */}
        </OrderDetails>
        
        <PaymentDetails>
          <H2 $color={'rgb(var(--purple-mid))'}>Payment Info</H2>
          <Input placeholder="Card Number" />
          <InnerPaymentDetails>
            <Input $textAlign="center" $maxWidth="35%" placeholder="MM/YYYY" maxLength="7" />
            <Input $textAlign="center" $maxWidth="35%" placeholder="ZIP Code" />
            <Input $textAlign="center" $maxWidth="20%" placeholder="CVV" maxLength="3" />
          </InnerPaymentDetails>

          <InnerPaymentDetailsMobile>
            <TopInnerMobile>
              <Input $textAlign="center" $maxWidth="65%" $padding="4px 10px" placeholder="MM/YYYY" maxLength="7" />
              <Input $textAlign="center" $maxWidth="30%" placeholder="CVV" maxLength="3" />
            </TopInnerMobile>
            <Input $textAlign="center" $maxWidth="65%" placeholder="ZIP Code" />
          </InnerPaymentDetailsMobile>
                
          <Button $alignSelf="center" />
        </PaymentDetails>
      </CheckoutContainer>
    </CheckoutWrapper>
  );
};

export default CartCheckout