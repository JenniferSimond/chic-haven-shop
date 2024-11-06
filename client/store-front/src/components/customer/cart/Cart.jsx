import {useContext, useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../../CustomerContext";
import { getToken } from "../../shared/auth";
import SideBar from "../../menuBars/SideBar";
import CartCard from "./CartCard";
import { getCartAndItems } from "../../../api/cart";

const OuterWrapper = styled.div`
display: flex;
    flex-direction: column;

    height: calc(100vh - 7rem - 3rem);  

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem);  
    }

`;

const InnerContentWrapper = styled.div`
      display: flex;
    flex-direction: column;
    flex-grow: 1;  
    justify-content: center;
    align-items: center;
    margin-right: 250px;
    padding: 1rem;
   // background-color: white;

    overflow-y: auto;  

    @media (max-width: 1300px) {
        margin-right: 200px;  
    }

    @media (max-width: 950px) {
        margin-right: 0px;  
    }
`;

const CheckoutBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    // box-sizing: border-box;
    height: 100px;
    min-height: 110px;
   
    
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;
    background-color: rgb(var(--cream));
    position: sticky;
    top: 0;  // Keep the header at the top
    z-index: 1;
    margin-top: 2%;

    @media (max-width: 950px) {
      flex-direction: column;
       height: 125px;
    }

    h1 {
       font-family: Cinzel; 
       font-size: 48px;
       color: rgb(var(--purple-mid));
       font-weight: 500;
       line-height: normal;
       letter-spacing: 0.34px;
       text-align: center;

       @media (max-width: 900px) {
         font-size: 35px;
       }

       @media (max-width: 700px) {
         font-size: 30px;
       }
       
    }
`;

const InnerCheckout = styled.div`
  flex-direction: column;
  //background-color: pink;
  display: none;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: rgb(var(--purple-dark));

  @media (max-width: 950px) {
  display: flex;
  }
`;

const CartScrollWrapper = styled.div`
    flex-grow: 1;  // Takes up remaining vertical space
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    overflow-y: auto;  // Allow scrolling only for wishlist items
    width: 95%;  // Ensures content fits inside the parent wrapper
    
`;

const Button = styled.button`
    width: 95px;
    height: 29px;
    background: #FFBC42;
    border-radius: 3px;
    border: none;
    margin-top: 5px;

    
        color: #22223B;
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0.32px;
       


    &:hover {
     color: rgb(var(--cream));
     background-color: rgb(var(--purple-mid))
    }
        `;


const CartItemSection = styled.div`
    // box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 50px;
    justify-content: center; 
    align-items: center; 
    width: 95%;
    padding: 2% 0;
    margin: 0 auto;  
    max-width: 1300px;  

    @media (max-width: 950px) {
      justify-content: center;
      width: 85%;
    }

`;

const EmptyCartMessage = styled.p`
font-family: Montserrat;
font-size: 20px;
font-weight: 500;
font-style: italic;
letter-spacing: normal;
color: rgb(var(--purple-mid));
text-align: center; // Optional: Center the message
align-self: center; // Center the element within its parent container
padding: 20px; // Optional: Add padding if you want some space around the text

 @media (max-width: 800px) {
  font-size: 15px;
 }
`;

const Cart = () => {
    const {customerData} = useContext(CustomerContext);
    const token = getToken();
    const [cartTotal, setCartTotal] = useState('')
    const [cartItems, setCartItems] = useState([]);
    const [pageRefresh, setPageRefresh] = useState(false);
    const [checkoutButton, setCheckoutButton] = useState('hidden');
    const navigate = useNavigate();

    const sidebarConfig = {
        firstContainer: {
          visibility: 'hidden',
          backgroundColor: 'rgb(var(--cream))',
          text: `Cart Total: `,
        },
        secondContainer: {
          visibility: 'visible',
          backgroundColor: 'rgb(var(--cream))',
          text: 'Save 15% on your next order when you spend $100 or more!',
        },
        thirdContainer: {
          visibility: 'visible',
          backgroundColor: 'rgb(var(--cream))',
          text: `Cart Total: $${cartTotal}`,
        },
        buttonContainer: {
          topVisibility: 'hidden',
          bottomVisibility: checkoutButton,
          backgroundColor: 'rgb(var(--cream))',
          topButtonText: 'Test',
          bottomButtonText: 'Checkout',
          buttonColor: '',
  
        },
        socialContainer: {
          display: 'none',
          visibility: 'visible',
        }
      }

   
      

    useEffect(() => {
      if (!customerData.id) {
        navigate('/login');
    }
 
        const getCustomerCart = async () => {
            if (!customerData.id) {
                navigate('/login');
            }
    
            try {
                const fetchedCartInfo = await getCartAndItems(token, customerData.id);
                console.log('Fetched Cart (cart) -->',fetchedCartInfo)
              

                    setCartItems(fetchedCartInfo.items)
                    setCartTotal(fetchedCartInfo.cart_total)

                    if (fetchedCartInfo.items.length > 0) {
                      setCheckoutButton('visible')
                    } else {
                      setCheckoutButton('hidden')
                    }
                
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
                setCheckoutButton('hidden')
            }
        };
        getCustomerCart();
    },[customerData.id, token, pageRefresh, navigate, checkoutButton])

    const refreshHandler = () => {
        console.log("Triggering page refresh.");
        setPageRefresh(!pageRefresh); 
      };

      const handleCheckout = () => {
        navigate('/checkout')
       }
    

   return(
    <OuterWrapper>
      <InnerContentWrapper>
        <CheckoutBox>
          <h1>Chic Cart</h1>
          <InnerCheckout>
            <p>{`Total: $${cartTotal}`}</p>
            <Button onClick={handleCheckout}>Checkout</Button>
          </InnerCheckout>
        </CheckoutBox>
        <CartScrollWrapper>
          <CartItemSection>
          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
                <CartCard 
                    key={cartItem.cart_item_id}
                    cartItem={cartItem}
                    refresh={refreshHandler}
                    
                />
            ))
         ):(
            <EmptyCartMessage>
                Your cart is empty!
            </EmptyCartMessage>
         )
         }
          </CartItemSection>
        </CartScrollWrapper>
      </InnerContentWrapper>
      <SideBar
        sidebarConfig={sidebarConfig}
        bottomHandleFunction={handleCheckout}
    
      />
    </OuterWrapper>
   )
};

export default Cart