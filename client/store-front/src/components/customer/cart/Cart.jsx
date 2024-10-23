import React, {useContext, useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../../CustomerContext";
import { getToken } from "../../shared/auth";
import SideBar from "../../menuBars/SideBar";
import CartCard from "./CartCard";
import { getCartAndItems } from "../../../api/cart";

const OuterWrapper = styled.div`
display: flex;
margin-bottom: 2%;

`;
const CartItemSection = styled.div`
    
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 50px;
    justify-content: center;  
    align-content: flex-start;
    width: 100%;  
    max-height: 100%;
    margin-right: 250px; 
    margin-bottom: 2%;
    margin-top: 2%;
    
    @media (max-width: 950px) {
        margin-right: 0px;
        justify-content: center;
        margin-bottom: 12%;
        margin-top: 5%;
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
    const [cartItems, setCartItems] = useState([]);
    const [pageRefresh, setPageRefresh] = useState(false);
    const navigate = useNavigate();

    if (!customerData.id && !token) {
        navigate('/login');
        return
    };

 

    useEffect(() => {
        
        const getCustomerCart = async () => {
            if (!customerData.id && !token) {
                navigate('/login');
            }
    
            try {
                const fetchedCartInfo = await getCartAndItems(token, customerData.id);
                console.log('Fetched Cart (cart) -->',fetchedCartInfo)
              
                    setCartItems(fetchedCartInfo.items)
                
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
            }
        };
        getCustomerCart();
    },[customerData.id, token, pageRefresh])

    const refreshHandler = () => {
        console.log("Triggering page refresh.");
        setPageRefresh(!pageRefresh); 
      };

   return(
    <OuterWrapper>

        <CartItemSection>
         {cartItems.length > 0 ? (
            cartItems.map((cartItem) => (
                <CartCard 
                    key={cartItem.cart_item_id}
                    cartItem={cartItem}
                    refreshHandler={refreshHandler}
                />
            ))
         ):(
            <EmptyCartMessage>
                Your cart is empty!
            </EmptyCartMessage>
         )
         }
        </CartItemSection>
        <SideBar />
    </OuterWrapper>
   )
};

export default Cart