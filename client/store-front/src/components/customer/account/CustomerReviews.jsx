import React, {useState, useEffect, useContext} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../../CustomerContext";
import { getToken } from "../../shared/auth";
import { getOrderAndItems } from "../../../api/orders.js";

const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3%;
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
    height: 110px;
    min-height: 100px;
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;
    background-color: rgb(var(--cream));
    position: sticky;
    top: 0;
    z-index: 1;

    h1 {
       font-family: Cinzel; 
       font-size: 39px;
       color: rgb(var(--purple-dark));
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
    overflow-y: auto;
    width: 100%;
    
`;

const ReviewItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
    justify-content: center; 
    align-items: center; 
    width: 90%;
    padding: 2% 0;
    margin: 0 auto;  
    // max-width: 1300px;
    

    @media (max-width: 950px) {
      justify-content: center;
      width: 85%;
    }
`;

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    // border-top: 1px solid rgb(var(--purple-light));
    border-bottom: 1px solid rgb(var(--purple-light));
   padding: 0px 10px 2px 10px;
    width: 100%;
    gap: 25px;
`;

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const token = getToken();
    const {customerData} = useContext(CustomerContext);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                
                const fetchedReviews = await getOrderAndItems(customerData.id, token);
                setOrders(fetchedReviews || []);
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
                  
                </ReviewItems>
            </ReviewsScrollWrapper>
       </OuterWrapper>
    );
};

export default CustomerReviews