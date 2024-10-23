
import React, {useContext, useState, useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../../CustomerContext";
import { getWishlistAndItems } from "../../../api/wishlist";
import SideBar from "../../menuBars/SideBar";
import WishlistCard from "./WishlistCard";
import { getToken } from "../../shared/auth";
import removeDark from '../../../assets/icons-svg/removeIcon/removeDark.svg';
import removePink from '../../../assets/icons-svg/removeIcon/removePink.svg';



const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;

    height: calc(100vh - 7rem - 3rem);  // For larger screens: subtract NavBar and Footer heights

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  // For tablets: adjust for smaller NavBar height
    }

    @media (max-width: 500px) {
        height: calc(100vh - 4rem - 7rem);  // For mobile: subtract NavBar and MobileTabBar only (no Footer)
    }
`;

const InnerContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;  // Allow the inner content to grow and fill the remaining space
    justify-content: center;
    align-items: center;
    margin-right: 250px;
    padding: 1rem;
    

    overflow-y: auto;  // Enable scrolling if content overflows

    @media (max-width: 1300px) {
        margin-right: 200px;  // Adjust margin for smaller sidebar
    }

    @media (max-width: 950px) {
        margin-right: 0px;  // No sidebar on smaller screens
    }
`;


const HeaderBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    // box-sizing: border-box;
    height: 110px;
    min-heignt: 100px;
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;
    background-color: rgb(var(--cream));
    position: sticky;
    top: 0;  // Keep the header at the top
    z-index: 1;

    h1 {
       font-family: Cinzel; 
       font-size: 39px;
       color: rgb(var(--purple-dark));
       font-weight: 500;
       line-height: normal;
       letter-spacing: 0.34px;
       text-align: center;

       @media (max-width: 800px) {
         font-size: 35px;
       }

       @media (max-width: 700px) {
         font-size: 30px;
       }
       @media (max-width: 600px) {
         font-size: 28px;
       }
       @media (max-width: 550px) {
         font-size: 23px;
         font-weight: 600;
       }
    }


`;

const WishlistScrollWrapper = styled.div`
    flex-grow: 1;  // Takes up remaining vertical space
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    overflow-y: auto;  // Allow scrolling only for wishlist items
    width: 95%;  // Ensures content fits inside the parent wrapper

`;

const WishlistItems = styled.div`
    
    // box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
    justify-content: ${({ isempty }) => (isempty ? 'center' : 'flex-start')}; // Dynamically set based on cart status
    align-items: ${({ isempty }) => (isempty ? 'center' : 'flex-start')}; // Center the empty message vertically
    width: 95%;
    padding: 2% 0;
    margin: 0 auto;  // Center the entire grid area within the available space
    max-width: 1300px;  // Optional: To limit the max width of the grid if needed
    // background-color: pink;

    @media (max-width: 950px) {
      justify-content: center;
      width: 85%;
    }

   
   
`;

const EmptyWishlistMessage = styled.p`
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



const Wishlist = () => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [pageRefresh, setPageRefresh] = useState(false);
  
    // Fetch wishlist when the component mounts or when dependencies change
    useEffect(() => {
      const getCustomerWishlist = async () => {
        if (!customerData.id || !token) {
          console.log("Customer ID or token is missing.");
          return;
        }
  
        try {
          console.log("Fetching wishlist for customer ID:", customerData.id);
  
          const updatedWishlist = await getWishlistAndItems(customerData.id, token);
          console.log("Fetched Wishlist:", updatedWishlist);
  
          // Ensure the API response is valid and contains items
          if (updatedWishlist && updatedWishlist.items) {
            console.log("Setting wishlist items:", updatedWishlist.items);
            setWishlistItems(updatedWishlist.items);
          } else {
            console.log("No items found in the wishlist.");
            setWishlistItems([]);
          }
        } catch (error) {
          console.error("Error fetching wishlist items:", error);
          setWishlistItems([]);
        }
      };
  
      getCustomerWishlist();
    }, [customerData.id, token, pageRefresh]); // Dependencies: run effect when any of these change
  
    const refreshHandlerWish = () => {
      console.log("Triggering page refresh.");
      setPageRefresh(!pageRefresh); 
    };
  
    // Debugging logs to monitor changes
    console.log("Current Wishlist Items:", wishlistItems);
    console.log("Page refresh state:", pageRefresh);
  
    return (
      <OuterWrapper>
        <InnerContentWrapper>
          <HeaderBox>
            <h1>A Place For The Things You Love</h1>
          </HeaderBox>
          <WishlistScrollWrapper>
           <WishlistItems isempty={wishlistItems.length <= 3}>
             {wishlistItems.length > 0 ? (
               wishlistItems.map((wishItem) => (
                 <WishlistCard
                 key={wishItem.wishlist_item_id}
                  wishItem={wishItem}
                 refresh={refreshHandlerWish}
                 />
               ))
             ) : (
              <EmptyWishlistMessage>
              {customerData.id && token
                ? "Your wishlist is empty. Check out our inventory to add the chic styles you love!"
                : "Log in or sign up to add chic styles you love!"}
            </EmptyWishlistMessage>
              )}
            </WishlistItems>
          </WishlistScrollWrapper>
        </InnerContentWrapper>
        <SideBar />
      </OuterWrapper>
    );
  };
export default Wishlist