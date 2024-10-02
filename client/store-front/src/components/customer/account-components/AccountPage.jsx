import React, {useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CustomerContext } from "../../../CustomerContext.jsx";
import windowResize from "../../shared/hooks/windowResize.js";
import { getToken } from "../../shared/auth.js";
import { getReviewsByUser } from "../../../api/reviews.js";
import { getWishlistAndItems } from "../../../api/wishlist.js";
import { fetchCustomer } from "../../../api/customers.js";
import SideBar from "../../menuBars/SideBar.jsx";
import wishlistLP from "../../../assets/icons-svg/wishlist/wishlistLP.svg";
import diamondFilled from '../../../assets/icons-svg/reviewDiamond/diamondFilled.svg';
import Wishlist from "../Wishlist.jsx";


const MobileView = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    width: 100%;
    min-height: 80vh; 
    font-family: Montserrat, sans-serif;
    // margin: 0% 2%;
   
`;

const WebView = styled.div`
 display: flex;
  flex-direction: row;   
  width: 100%;
  height: 82vh;
  position: relative;
  font-family: Montserrat, sans-serif;

`;

const WebViewInnerWrapper = styled.div`

    flex-grow: 1;
    max-width: 1330px;
    display: flex;
    flex-direction: column;
    padding: 5% 4% 3% 4%;
    margin-right: 250px;
    justify-content: center;

    @media (max-width: 1300px) {
        margin-right: 200px; // Adjust margin for smaller sidebar
    }
 `;


 const SvgIcon = styled.img`
    max-height: ${props => props.$maxHeight || '30px'};
    max-width: ${props => props.$maxWidth || '30px'};
    height: ${props => props.$height ||'100%'};
    width: ${props => props.$width ||'100%'};
    margin: 10% 0%;

    @media (max-width: 950px) {
        margin: 0% 0%;
        max-height: 25px;
        max-width: 25px;
        // margin-top: 3%;
    }
`;

const MainTitle = styled.p`
  color: rgb(var(--purple-mid));
  font-family: Cinzel;
  font-size: 55px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 4.38px;
  text-align: center;

  @media (max-width: 950px) {
    font-size: 45px;
    font-wight: 500;
  }

  @media (max-width: 850px) {
    font-size: 40px
  }
  @media (max-width: 700px) {
    font-size: 35px
  }
  @media (max-width: 600px) {
    font-size: 29px
  }
  @media (max-width: 520px) {
    font-size: 27px
  }
  @media (max-width: 451px) {
    font-size: 20px
  }
`;


const TileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  margin: 5% 2%;

`;

const AccountDetailTile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    gap: 5%;
    border-radius: 3px;
    border: 2px solid rgb(var(--purple-mid));
    max-width: ${props => props.$maxWidth || '350px'};
    height: ${props => props.$height || '300px'};
    width: ${props => props.$width || '33%'};
    border-radius: 3px;

    @media (max-width: 950px) {
        max-width: 500px;
        height: 200px;
        width: 80%;
        gap: 10px;
    }
`;

const DetailsDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
     border: 2px solid rgb(var(--purple-light));
     max-width: 340px;
     width: 90%;
     height: 40px;
      border-radius: 3px;
      font-size: 15px;

      p{
       
        color: rgb(var(--purple-mid));
        font-weight: 500;
        
    }

    span {
    font-family: Cinzel;
    font-weight: 600;
    color: rgb(var(--ras-pink));
    }

    @media (max-width: 950px) {
        max-width: 440px;
        height: 25px;
        font-size: 14px;
    }
`;



const PurpleTile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(var(--purple-mid));
    max-width: ${props => props.$maxWidth || '350px'};
    height: ${props => props.$height || '300px'};
    width: ${props => props.$width || '33%'};
    border-radius: 3px;

    h3 {
    color: rgb(var(--cream));
    font-family: Cinzel;
    font-size: 22px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: .6px;

    @media (max-width: 950px) {
        font-size: 18px;
    }

    }

    p{
        color: rgb(var(--cream));
        font-size: 22px;
        font-weight: 400;
        letter-spacing: 1.6px;
        margin: 5% 0% 10% 0%;

        @media (max-width: 950px) {
            margin: 0% 0%;
            font-size: 18px;
        }
    }

    @media (max-width: 950px) {
        max-width: 500px;
        height: 150px;
        width: 80%;
        gap: 4%;
         justify-content: center;
    }
    
`;

const TileButton = styled.button`
    background-color: rgb(var(--cream));
    color: rgb(var(--purple-mid));
    border: none;
    border-radius: 3px;
    width: 130px;
    height: 35px;
    font-size: 13px;
    font-weight: 500;

    &:hover {
    background-color: rgb(var(--purple-light)) ;
    color: rgb(var(--cream));
    }

    @media (max-width: 950px) {
        font-size: 12px;
        width: 100px;
        height: 25px;
        font-weight: 600;
    }
`;

const MobileButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    max-width: 350px;
    width: 80%;
    // background-color: pink;
   padding: 0px 10px;
   gap: 20px;
`;

const DarkButton = styled.button`
    background-color: rgb(var(--purple-deep));
    color: rgb(var(--cream));
    border: none;
    border-radius: 3px;
    width: 150px;
    height: 35px;
    font-size: 13px;
    font-weight: 500;

    &:hover {
    background-color: rgb(var(--purple-light)) ;
    color: rgb(var(--purple-deep));
    font-weight: 600;
    }
`;

const CircleButton = styled.button`
  width: 85px;
  height: 85px;
  border: none;
  border-radius: 50%;
  background-color: rgb(var(--ras-pink));
  color: rgb(var(--cream));
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.263px;
  text-transform: capitalize;

  @media (max-width: 850px) {
    width: 80px;
    height: 80px;
  }
  @media (max-width: 700px) {
    width: 75px;
    height: 75px;
  }
  @media (max-width: 500px) {
    width: 65px;
    height: 65px;
    font-size: 12px;
  }
  `;

const Account = () => {
const {customerData} = useContext(CustomerContext);
const navigate = useNavigate();
const token = getToken();
const {width} = windowResize();


const [customerReviews, setCustomerReviews] = useState({});
const [customerAccountInfo, setCustomerAccountInfo] = useState({});
const [customerWishlist, setCustomerWishlist] = useState({});

    if (!customerData.id) {
        navigate('/login');
         return;
    }

    useEffect(() => {

        const customerAccountInfo = async () => {

            
            try {
                const fetchedInfo = await fetchCustomer(customerData.id, token);
                console.log('Customer Info ->', fetchedInfo);
                if (fetchedInfo) {
                    setCustomerAccountInfo(fetchedInfo)
                } else {
                    setCustomerAccountInfo({});
                }

                const fetchedReviews = await getReviewsByUser(customerData.id, token);
                console.log('Fetched Reviews ->',fetchedReviews);
                console.log('Fetched Reviews # ->',fetchedReviews.reviews.length);
                    if (fetchedReviews) {
                        setCustomerReviews(fetchedReviews);
                    } else {
                        setCustomerReviews({});
                    }

                const fetchedwishlist = await getWishlistAndItems(customerData.id, token);
                console.log('Fetched Wishlist ->',fetchedwishlist);
                    if (fetchedwishlist) {
                        setCustomerWishlist(fetchedwishlist);
                    } else {
                        setCustomerWishlist({})
                    }
              

            } catch (error) {
                console.error('Error fetching Customer info', error);
                setCustomerAccountInfo({});
                setCustomerReviews({});
                setCustomerWishlist({});
            }
        }
        customerAccountInfo();
    }, [ customerData.id, token, navigate])

    const memberDate = new Date(customerAccountInfo.created_at);
    const formattedMemberDate = memberDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
   
    return (
        <>
        {width <= 950 ? (
            <MobileView>
                <MainTitle>We Love That You're Here!</MainTitle>
                <AccountDetailTile>
                    <DetailsDiv>
                            <p> <span>Customer:</span>{` ${customerAccountInfo.first_name} ${customerAccountInfo.last_name}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Email:</span>{` ${customerAccountInfo.email}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Review Status:</span> {customerAccountInfo.review_permissions === 'allowed' ? ' Allowed' : ' Restricted'}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Member Since:</span>{` ${formattedMemberDate}`} </p>
                        </DetailsDiv>
                    </AccountDetailTile>
                    <PurpleTile>
                        <SvgIcon src={diamondFilled} />
                        <h3>Reviews Posted</h3>
                      <p>{!customerReviews.customer_id || customerReviews.reviews.length == 0 ? 0 : customerReviews.reviews.length}</p>
                        <TileButton>See Reviews</TileButton>
                    </PurpleTile>
                    <MobileButtonWrapper>
                        <DarkButton>Update Account</DarkButton>
                        <DarkButton>Order History</DarkButton>
                    </MobileButtonWrapper>
                    <CircleButton>Log Out</CircleButton>
            </MobileView>
        ):(
            <WebView>
              <WebViewInnerWrapper>
                <MainTitle>We Love That You're Here!</MainTitle>
                <TileWrapper>
                    <AccountDetailTile>
                    <DetailsDiv>
                            <p> <span>Customer:</span>{` ${customerAccountInfo.first_name} ${customerAccountInfo.last_name}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Email:</span>{` ${customerAccountInfo.email}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Review Status:</span> {customerAccountInfo.review_permissions === 'allowed' ? ' Allowed' : ' Restricted'}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p><span>Member Since:</span>{` ${formattedMemberDate}`} </p>
                        </DetailsDiv>
                    </AccountDetailTile>
                    <PurpleTile>
                        <SvgIcon src={diamondFilled} />
                        <h3>Reviews Posted</h3>
                      <p>{!customerReviews.customer_id || customerReviews.reviews.length == 0 ? 0 : customerReviews.reviews.length}</p>
                        <TileButton>Manage Reviews</TileButton>
                    </PurpleTile>
                    <PurpleTile>
                        <SvgIcon src={wishlistLP} />
                        <h3>Items in Wishlist</h3>
                        <p>{!customerWishlist.customer_id || customerWishlist.items.length == 0 ? 0 : customerWishlist.items.length}</p>
                        <TileButton>View Wishlist</TileButton>
                    </PurpleTile>
                </TileWrapper>
              
              </WebViewInnerWrapper>
              <SideBar />
            </WebView>
        )};
        </>
    );
};

export default Account