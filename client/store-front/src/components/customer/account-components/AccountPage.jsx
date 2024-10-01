import React, {useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CustomerContext } from "../../../CustomerContext.jsx";
import windowResize from "../../shared/hooks/windowResize.js";
import { getToken } from "../../shared/auth.js";
import { fetchReviewsByUser } from "../../../api/reviews.js";
import { getWishlistAndItems } from "../../../api/wishlist.js";
import { fetchCustomer } from "../../../api/customers.js";
import SideBar from "../../menuBars/SideBar.jsx";
import wishlistLP from "../../../assets/icons-svg/wishlist/wishlistLP.svg";
import diamondFilled from '../../../assets/icons-svg/reviewDiamond/diamondFilled.svg';


const MobileView = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 80vh; 
   
`;


const WebView = styled.div`
 display: flex;
  flex-direction: row;   
  width: 100%;
  height: 82vh;
  position: relative;

`;

const WebViewInnerWrapper = styled.div`

    flex-grow: 1;
    max-width: 1330px;
    display: flex;
    flex-direction: column;
    padding: 5% 4% 3% 4%;
    margin-right: 250px;
    justify-content: center;
    // background-color: pink;

    @media (max-width: 1300px) {
        margin-right: 200px; // Adjust margin for smaller sidebar
    }
 `;


 const SvgIcon = styled.img`
    max-height: ${props => props.$maxHeight || '25px'};
    max-width: ${props => props.$maxWidth || '25px'};
    height: ${props => props.$height ||'100%'};
    width: ${props => props.$width ||'100%'};
    margin: 10% 0%;
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
`;

const TileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  margin: 5% 5%;
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
    width: 350px;
    height: 298px;
    border-radius: 3px;
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

      p{
        font-family: Montserrat, sans-serif;
        color: rgb(var(--purple-mid));
        font-size: 15px;
        font-weight: 600;
    }
`;


const PurpleTile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(var(--purple-mid));
    width: 252px;
    height: 298px;
    border-radius: 3px;

    h3 {
    color: rgb(var(--cream));
    font-family: Cinzel;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    }

    p{
        font-family: Montserrat, sans-serif;
        color: rgb(var(--cream));
        font-size: 20px;
        font-weight: 600;
    }
`;


const Account = () => {
const {customerData} = useContext(CustomerContext);
const navigate = useNavigate()
const token = getToken();
const {width} = windowResize();

const [customerReviews, setCustomerReviews] = useState([]);
const [customerAccountInfo, setCustomerAccountInfo] = useState({});
const [customerWishlist, setCustomerWishlist] = useState();


    useEffect(() => {

        const customerAccountInfo = async () => {

            if (!customerData.id) {
                navigate('/login');
                return;
            }

            try {
                const fetchedInfo = await fetchCustomer(customerData.id, token);
                console.log('Customer Info ->', fetchedInfo);
                if (fetchedInfo) {
                    setCustomerAccountInfo(fetchedInfo)
                } else {
                    setCustomerAccountInfo({})
                }
            } catch (error) {
                console.error('Error fetching Customer info', error);
                setCustomerAccountInfo({})
            }
        }
        customerAccountInfo();
    }, [ customerData.id])

    const memberDate = new Date(customerAccountInfo.created_at);
    
   
    return (
        <>
        {width <= 950 ? (
            <MobileView>
                <p>Mobile View</p>
            </MobileView>
        ):(
            <WebView>
              <WebViewInnerWrapper>
                <MainTitle>We Love That You're Here!</MainTitle>
                <TileWrapper>
                    <AccountDetailTile>
                    <DetailsDiv>
                            <p>{`Customer: ${customerAccountInfo.first_name} ${customerAccountInfo.last_name}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p>{`Email: ${customerAccountInfo.email}`}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p>Review Status: {customerAccountInfo.review_permissions === 'allowed' ? 'Allowed' : 'Restricted'}</p>
                        </DetailsDiv>
                        <DetailsDiv>
                            <p>{`Member Since: ${memberDate}`} </p>
                        </DetailsDiv>
                    </AccountDetailTile>
                    <PurpleTile>
                        <SvgIcon src={diamondFilled} />
                        <h3>Reviews Posted</h3>
                        <p>12</p>
                    </PurpleTile>
                    <PurpleTile>
                        <SvgIcon src={wishlistLP} />
                        <h3>Reviews Posted</h3>
                        <p>10</p>
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