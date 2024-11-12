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
        padding-top: 8%;
    }
`;

const HeaderBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 105px;
    min-height: 105px;
    border: 3px solid rgb(var(--ras-pink));
    width: 95%;
    background-color: rgb(var(--ras-pink));
    position: sticky;
    border-radius: 3px;
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

const OrderScrollWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
   // justify-content: center;
    margin: 2% 0%;
    overflow-y: auto;
    width: 95%;
    // background-color: pink;
`;

const OrderItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
    justify-content: center; 
    align-items: flex-start; 
    width: 90%;
    padding: 5% 0;
    margin: 0 auto;  
    // max-width: 1300px;
    background-color: pink;

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
    border-bottom: 2px solid rgba(var(--purple-light), 0.5);
    padding: 0px 15px 5px 15px;
    width: 95%;
    gap: 25px;

    @media(max-width: 600px) {
        width: 100%;
        padding: 0px 12px 5px 12px;
    }

    @media (max-width: 449px) {
        font-size: 10px;
         padding: 0px 10px 5px 10px;
    }
`;

const InnerItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 4px;

`;

const OrderText = styled.p`
    font-family: Montserrat, sans-serif;
    font-family: Montserrat, sans-serif;
    font-weight: ${props => props.$fontWeight || '500'};
    font-size: ${props => props.$fontSize || '13px'};
    color: ${props => props.$color || 'rgb(var(--purple-deep))'};

    @media (max-width: 600px) {
        font-size: 11px;
    }
    @media (max-width: 449px) {
        font-size: 10px;
    }
`;

const EmptyOrderMessage = styled.p`
font-family: Montserrat, sans-serif;
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

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const token = getToken();
    const {customerData} = useContext(CustomerContext);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                
                const fetchedOrders = await getOrderAndItems(customerData.id, token);
              if (fetchOrders) {
                setOrders(fetchedOrders)
              } else {
                setOrders([])
                setOrderDetails([])
              }
                
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [customerData.id, token]);

    useEffect(() => {
       
            const infoArray = []
            for (const order of orders) {
                const orderNumSections = order.id.split("-");
                const formattedOrderDate = dateFormatter(order.created_at);
                console.log('Formatted Date ->',formattedOrderDate)
                console.log('Order', order);
                console.log('Order Num Split -->', orderNumSections);
                console.log('Last num', orderNumSections.at(-1))
                infoArray.push(
                    {
                        orderNumber: order.id,
                        truncatedOrderNum: orderNumSections.at(-1),
                        orderDate: `${formattedOrderDate}`,
                        totalItems: order.ordered_items.length,
                        orderTotal: parseFloat(order.order_total),
                    }
                )
    
            }
            console.log('Info Array ->',infoArray);
            setOrderDetails(infoArray)
            console.log('Order Details->',orderDetails)
    }, [orders])

    

    const dateFormatter = (dateInfo) => {
        const orderDate = new Date(dateInfo);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return formattedDate
    }

    return (
       <OuterWrapper>
            <HeaderBox>
                <h1>Order History</h1>
            </HeaderBox>
            <OrderScrollWrapper>
                <OrderItems>
                    { orderDetails.length > 0 ? (orderDetails.map(order => (
                        
                        <ItemWrapper key={order.orderNumber}>
                            <InnerItemWrapper>
                                <OrderText $fontWeight={`600`} $color={'rgb(var(--ras-pink))'} $fontSize={'14px'}>Order Number</OrderText>
                                <OrderText>{order.truncatedOrderNum}</OrderText>
                            </InnerItemWrapper>
                            <InnerItemWrapper>
                                <OrderText $fontWeight={'600'} $color={'rgb(var(--ras-pink))'} $fontSize={'14px'}>Order Date</OrderText>
                                <OrderText>{order.orderDate}</OrderText>
                            </InnerItemWrapper>
                            <InnerItemWrapper>
                                <OrderText $fontWeight={'600'} $color={'rgb(var(--ras-pink))'} $fontSize={'14px'}>Total Items</OrderText>
                                <OrderText>{order.totalItems}</OrderText>
                            </InnerItemWrapper>
                            <InnerItemWrapper>
                                <OrderText $fontWeight={'600'} $color={'rgb(var(--ras-pink))'} $fontSize={'14px'}>Order Total</OrderText>
                                <OrderText>{`$${order.orderTotal}`}</OrderText>
                            </InnerItemWrapper>
                            
                        </ItemWrapper>
                    ))
                ): (
                    <EmptyOrderMessage>
                        No orders, start shopping today!
                    </EmptyOrderMessage>
                )}
                </OrderItems>
            </OrderScrollWrapper>
       </OuterWrapper>
    );
};

export default OrderHistory