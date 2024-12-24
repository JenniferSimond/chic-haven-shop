
import {useContext, useState, useEffect} from "react";
import styled from "styled-components";
import { CustomerContext } from "../../../CustomerContext";
import { getWishlistAndItems } from "../../../api/wishlist";
import SideBar from "../../menuBars/SideBar";
import WishlistCard from "./WishlistCard";
import { getToken } from "../../shared/auth";
import PromoSidebar from "../../menuBars/PromoSidebar";




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
    overflow-y: auto;  

    @media (max-width: 1300px) {
        margin-right: 200px;  
    }

    @media (max-width: 950px) {
        margin-right: 0px;  
    }
`;


const HeaderBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 110px;
    min-height: 100px;
    border: 3px solid rgb(var(--ras-pink));
    border-radius: 3px;
    width: 95%;
    background-color: rgb(var(--cream));
    position: sticky;
    top: 0;  
    z-index: 1;
    margin-top: 2%;

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
    flex-grow: 1;  
    display: flex;
    flex-direction: column;
    margin-top: 2%;
    overflow-y: auto; 
    width: 95%;  

`;

const WishlistItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
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

const EmptyWishlistMessage = styled.p`
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 500;
    font-style: italic;
    letter-spacing: normal;
    color: rgb(var(--purple-mid));
    text-align: center; 
    align-self: center; 
    padding: 20px; 

     @media (max-width: 800px) {
      font-size: 15px;
     }
`;



const Wishlist = () => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [pageRefresh, setPageRefresh] = useState(false);

    const sidebarConfig = {
      firstContainer: {
        display: 'none',
        backgroundColor: 'rgb(var(--mustard))',
        text: '',
      },
      secondContainer: {
        display: 'none',
        backgroundColor: 'rgb(var(--mustard))',
        text: '',
      },
      thirdContainer: {
        display: 'none',
        backgroundColor: 'rgb(var(--mustard))',
        text: '',
      },
      buttonContainer: {
        display: 'none',
        backgroundColor: 'rgb(var(--mustard))',
        leftText: '',
        rightText: '',
        buttonColor: '',

      },
      socialContainer: {
        display: 'none',
      }
    }

    const info = {
    leftButtonText: '',
    rightButtonText: '', 
    firstContainerText: '', 
    secondContainerText: '', 
    thirdContainerText: '', 
    firstContainerDisplay: 'none', 
    secondContainerDisplay: 'none', 
    displaySocial: 'none', 
    displayButton: 'none'
    }
  
    // Fetch wishlist when the component mounts or when dependencies change
    useEffect(() => {
      const getCustomerWishlist = async () => {
        if (!customerData.id || !token) {
          return;
        }
  
        try {
          const updatedWishlist = await getWishlistAndItems(customerData.id, token);
  
          // Ensure the API response is valid and contains items
          if (updatedWishlist && updatedWishlist.items) {
            setWishlistItems(updatedWishlist.items);
          } else {
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
      setPageRefresh(!pageRefresh); 
    };
  
    return (
      <OuterWrapper>
        <InnerContentWrapper>
          <HeaderBox>
            <h1>A Place For The Things You Love</h1>
          </HeaderBox>
          <WishlistScrollWrapper>
           <WishlistItems >
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
                ? "Check out our inventory to add chic styles you love!"
                : "Log in or sign up to add chic styles you love!"}
            </EmptyWishlistMessage>
              )}
            </WishlistItems>
          </WishlistScrollWrapper>
        </InnerContentWrapper>
        <PromoSidebar />
      </OuterWrapper>
    );
  };
export default Wishlist