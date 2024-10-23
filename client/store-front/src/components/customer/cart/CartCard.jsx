import React, {useEffect, useState, useContext} from "react";
import styled from "styled-components";
import { getToken } from "../../shared/auth";
import { BASE_URL } from "../../../api/apiConfig";
import { updateCartItem, deleteCartItem } from "../../../api/cart";
import removePurpleMid from '../../../assets/icons-svg/removeIcon/removePurpleMid.svg';
import removePink from '../../../assets/icons-svg/removeIcon/removePink.svg'
import { CustomerContext } from "../../../CustomerContext";

const CardWrapper = styled.div`
    width: 315px;
    height: 225px;
    border: 2px solid rgba(var(--purple-light), 1); 
    border-radius: 5px;
`;

const InnerCardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    // box-sizing: border-box;
    width: 100%;
    gap: 10px;
    
`;

const ItemImage = styled.div`
    background-image: url(${props => props.$imageUrl});
    width: 114.69px;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 3px;
`;

const InnderDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.$justifyContent || 'center'};
    // background-color: pink;
    gap: 7px;

`;

const BottomLeftWrapper = styled.div`
    display: flex;
    flex-direction: row;
    // background-color: white;
    justify-content: space-around;
    border-radius: 3px;
    align-items: center;
    width: 40%;
    height: 30px;
    margin-top: 10px;
`;

const InsideWrapper = styled.div`
    padding: 5%;
`;
const BottomRightWrapper = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-around;
    border-radius: 3px;
    background-color: rgba(var(--purple-mid), 1);
    // width: ${props => props.$width || '148px'};
    height: ${props => props.$height || '53px'};
    // padding: 0% 2$;

`;

const BottomInnerDiv = styled.div`
    display: flex;
    flex-direction: column;
    // background-color: blue;
    justify-content: ${props => props.$justifyContent || 'center'};
    // align-content: center;
    // text-align: ${props => props.$textAlign || 'center'};
    gap: 5px;
   
`;

const SvgIcon = styled.img`
    width: ${props => props.$width || '25px'};
    height: ${props => props.$height || '25px'};
    cursor: pointer;

    &:hover {
    content: url(${props => props.$hoverIcon2})

    }

    opacity: 0.9;
    `;

    const Header = styled.h3`
        color: rgb(var(--purple-mid));
        font-family: Cinzel;
        font-size: 13px;
        white-space: nowrap;
        text-align: center;
        font-style: normal;
        font-weight: 600;
        // line-height: 1.5;
        // letter-spacing: 1.2px;
        // margin-bottom: 10px;
    `;

    const Text = styled.p`
        color: ${props => props.$color || 'rgb(var(--cream))'};
        font-family: Montserrat;
        font-size: ${props => props.$fontSize || '11px'};
        font-style: ${props => props.$fontStyle || 'normal'};
        font-weight: ${props => props.$fontWeight || '400'};
        text-align: ${props => props.$textAlign || 'center'};
        letter-spacing: 1.2px;
        opacity: 1;
    `;

    const Select = styled.select`
        background-color: rgb(var(--cream)); 
        border: 2px solid rgba(var(--purple-light), 1); 
        border-radius: 3px; 
        color: rgb(var(--purple-mid)); 
        font-family: Montserrat, sans-serif;
        font-weight: ${props => props.$fontWeight || '500'};
        font-size: ${props => props.$fontSize || '11px'};
        text-align: center;
        padding: ${props => props.$padding || '7px 5px'};
        outline: none;

     @media (max-width: 400px) {
        padding: 4px 4px;
        font-size: 10px;
  }
     
  
  &:focus {
    border-color: rgba(var(--purple-mid), 1);
  }

  &:hover {
    background-color: rgba(var(--purple-dark), 1);
    border-color: rgba(var(--purple-dark), 1);
    color: rgb(var(--cream));

    @media (max-width: 950px) {
      background-color: rgba(var(--purple-mid), 1);
    border-color: rgba(var(--purple-mid), 1);
    }
  }

`;

const Option = styled.option`
  
`;

const SelectBox = styled.div`
//    display: flex;
//   flex-direction: row;
//   width: 26px;
//   height: 17px;
`;

const CartCard = ({cartItem, refreshHandler}) => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const imageUrl = `${BASE_URL}${cartItem.product_image}`;

    return (
        <CardWrapper>
            <InsideWrapper>

            <InnerCardWrapper>
                <InnderDiv $justifyContent={'start'}>
                    <ItemImage $imageUrl={imageUrl}/>
                    
                </InnderDiv>
                
                <InnderDiv $justifyContent={'space-between'}>
                    <Header>{cartItem.product_name}</Header>
                    <Text $color={'rgba(var(--purple-mid), 1)'} $fontWeight={'500'} $fontSize={'10px'}>{cartItem.product_description}</Text>
                    <BottomRightWrapper>
                        <BottomInnerDiv>
                            <Text $fontWeight={'600'} $fontSize={'12px'}>Qty.</Text>
                            <SelectBox>
                                <Select $fontSize={'11px'} $fontWeight={'600'} $padding={'0px 0px '} >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <Option key={value}>{value}</Option>
                                ))}
                            </Select>
                            </SelectBox>
                        </BottomInnerDiv>
                        <BottomInnerDiv>
                            <Text $fontWeight={'600'} $fontSize={'11px'}>Total Price</Text>
                            <Text $fontWeight={'500'} $textAlign={'start'} $fontStyle={'italic'}>{`$${cartItem.product_price * cartItem.quantity}`}</Text>
                        </BottomInnerDiv>
                    </BottomRightWrapper>
                </InnderDiv>
            </InnerCardWrapper>
            <BottomLeftWrapper>
                <Text $color={'rgba(var(--purple-mid), 1)'} $fontWeight={'600'} $fontSize={'13px'} >{`$${cartItem.product_price}`}</Text>
                <SvgIcon
                 $width={'21px'}
                 $height={'21px'}
                 src={removePurpleMid}
                 $hoverIcon2={removePink}
                />
            </BottomLeftWrapper>
        </InsideWrapper>
        </CardWrapper>
    )
};

export default CartCard