
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
    height: 83vh;
    align-items: center;
    font-family: Montserrat, sans-serif;

    @media (max-width: 768px) {
    height: 87vh;
    }
    
     @media (max-width: 500px) {
    height: 82vh;
    }
`;

const InnerContentWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-right: 250px;

    @media (max-width: 1300px) {
        margin-right: 200px; // Adjust margin for smaller sidebar
    }

    @media (max-width: 950px) {
        justify-content: center;
        margin-right: 0px; // No sidebar on smaller screens
        // padding: 2% 1% 0% 1%; // Adjust padding for smaller screens
       
    }
`;

const HeaderBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 110px;
    display: flex;
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;

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
    max-height: 60vh; 
    overflow-y: auto; 
    
`;



// const Wishlist = () => {
//     const { customerData } = useContext(CustomerContext);
//     const token = getToken();
//     const [wishlistItems, setWishlistItems] = useState([]); 
//     const [pageRefresh, setPageRefresh] = useState(false);
    
//     useEffect(() => {
//         const getCustomerWishlist = async () => {
//             if (!customerData.id) return;
//             try {
//                 const updatedWishlist = await getWishlistAndItems(customerData.id, token);
//                 console.log('Wishlist-(wl)->', updatedWishlist.items)
//                 setWishlistItems(updatedWishlist.items); // Handle the case where items might be undefined
//             } catch (error) {
//                 console.error('Error fetching wishlist items', error);
//                 setWishlistItems([]);
//             }
//         };
//         getCustomerWishlist();
//     }, [ customerData.id, token, pageRefresh]);

//     const refreshHandlerWish = () => {
//         setPageRefresh(!pageRefresh);
       
//     };


//     console.log("Wish Items-->-->",wishlistItems)
//     return (
//         <OuterWrapper>
//             <InnerContentWrapper>
//                 <HeaderBox>
//                     <h1>A Place For The Things You Love</h1>
//                 </HeaderBox>
//                 <WishlistItems>
//                     {wishlistItems.length > 0 ? (
//                         wishlistItems.map(wishItem => (
//                             <WishlistCard key={wishItem.wishlist_item_id}  wishItem={wishItem} refresh={refreshHandlerWish}/>
//                         ))
//                     ) : (
//                         <p>{customerData.id && token ? 'Your wishlist is empty. Check out our inventory and add some things you love!' : 'Log in to save the things you love!'}</p>
//                     )}
//                 </WishlistItems>
//             </InnerContentWrapper>
//             <SideBar />
//         </OuterWrapper>
//     );
// }


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
  
    // Handler to trigger refresh (by toggling the pageRefresh state)
    const refreshHandlerWish = () => {
      console.log("Triggering page refresh.");
      setPageRefresh((prevState) => !prevState); // Toggles the state to force useEffect re-run
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