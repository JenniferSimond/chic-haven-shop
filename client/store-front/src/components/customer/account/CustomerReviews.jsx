import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../../CustomerContext";
import { getToken } from "../../shared/auth";
import { getOrderAndItems } from "../../../api/orders.js";
import { getReviewsByUser } from "../../../api/reviews.js";
import ReviewCard from "./ReviewCard.jsx";

const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3% 3% 1% 3%;
    box-sizing: border-box;
    height: calc(100vh - 7rem - 3rem);  
    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  
    }
    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem);  
        padding-top: 10%;
    }
`;

const HeaderBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 105px;
    min-height: 105px;
    border: 3px solid rgb(var(--ras-pink));
    border-radius: 3px;
    width: 95%;
    background-color: rgb(var(--ras-pink));
    position: sticky;
    top: 0;
    z-index: 1;

    h1 {
       font-family: Cinzel; 
       font-size: 39px;
       color: rgb(var(--cream));
       font-weight: 500;
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

const ReviewsScrollWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    
    margin-top: 2%;
   margin-bottom: 2%;
    overflow-y: auto;
    width: 95%;
   // background-color: pink;
    
`;

const ReviewItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: 25px;
    column-gap: 25px;
    justify-content: center; 
    align-items: flex-start; 
    height: auto;
    width: 90%;
  padding-top: 1%;
    margin: 0 auto;  

    

    @media (max-width: 950px) {
      justify-content: center;
      width: 85%;
    }
`;


const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const token = getToken();
    const {customerData} = useContext(CustomerContext);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                
                const fetchedReviews = await getReviewsByUser(customerData.id, token);
                if (fetchedReviews && fetchedReviews.reviews.length > 0) {
                    setReviews(fetchedReviews.reviews)
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [customerData.id, token]);

    return (
       <OuterWrapper>
            <HeaderBox>
                <h1>Customer Reviews</h1>
            </HeaderBox>
            <ReviewsScrollWrapper>
                <ReviewItems>
                  {
                    reviews.map(review => (
                        <ReviewCard key={review.review_id} review={review}/>
                    ))
                  }
                </ReviewItems>
            </ReviewsScrollWrapper>
       </OuterWrapper>
    );
};

export default CustomerReviews