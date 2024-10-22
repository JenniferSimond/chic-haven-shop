
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


// const OuterWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     height: calc(100vh - 7rem - 3.5rem);  // Full height minus NavBar and Footer heights
//     align-items: center;
//     font-family: Montserrat, sans-serif;

//     @media (max-width: 768px) {
//         height: calc(100vh - 5rem - 3.5rem);  // Adjust for smaller screens
//     }
    
//     @media (max-width: 500px) {
//         height: calc(100vh - 4rem - 3rem);  // Adjust for even smaller screens
//     }
// `;

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
    flex-grow: 1;  // Allow the inner content to grow and fill the remaining space
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-right: 250px;
    background-color: pink;
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
    box-sizing: border-box;
    height: 110px;
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;
    position: sticky;
    top: 0;  // Keep the header at the top
    // background-color: white;  // Ensure background is set

    h1 {
       font-family: Cinzel; 
       font-size: 39px;
       color: rgb(var(--purple-dark));
       font-weight: 500;
       line-height: normal;
       letter-spacing: 0.34px;
       text-align: center;
    }
`;

const WishlistItems = styled.div`
    box-sizing: border-box;
    flex-grow: 1;  // Ensure it grows to take up remaining space
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
    justify-content: center;  
    align-content: center;
    margin-bottom: 2%;
    margin-top: 3%;
    width: 95%;
    padding: 5% 0% 2% 0%;
    height: 62%;
    max-height: 60vh; 
    overflow-y: auto; 
    background-color: white; 
    
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
  
          <WishlistItems>
            {wishlistItems.length > 0 ? (
              wishlistItems.map((wishItem) => (
                <WishlistCard
                  key={wishItem.wishlist_item_id}
                  wishItem={wishItem}
                  refresh={refreshHandlerWish}
                />
              ))
            ) : (
              <p>
                {customerData.id && token
                  ? "Your wishlist is empty. Check out our inventory and add some things you love!"
                  : "Log in to save the things you love!"}
              </p>
            )}
          </WishlistItems>
        </InnerContentWrapper>
        <SideBar />
      </OuterWrapper>
    );
  };
export default Wishlist