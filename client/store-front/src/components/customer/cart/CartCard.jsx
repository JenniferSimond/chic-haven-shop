


import  {useState, useContext} from "react";
import styled from "styled-components";
import { getToken } from "../../shared/auth";
import { BASE_URL } from "../../../api/apiConfig";
import { updateCartItem, deleteCartItem } from "../../../api/cart";
import removePurpleMid from '../../../assets/icons-svg/removeIcon/removePurpleMid.svg';
import removePink from '../../../assets/icons-svg/removeIcon/removePink.svg'
import { CustomerContext } from "../../../CustomerContext";

const CardWrapper = styled.div`
    width: 315px;
    height: 230px;
    border: 2.5px solid rgba(var(--purple-mid), 1); 
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
`;

const InsideWrapper = styled.div`
    display: flex;
    flex-direction: column; 
    height: 100%;
    justify-content: center;
    gap: 10px;
    padding: 4%
`;

const InnerCardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;
   
`;

const ItemImage = styled.div`
    background-image: url(${props => props.$imageUrl});
    width: 110px;
    height: 140px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 3px;
`;

const InnerDiv = styled.div`
    border: ${props => props.$border || ''}; 
    display: flex;
    border-radius: 3px;
    box-sizing: border-box;
    flex-direction: column;
    padding: ${props => props.$padding || ''};
    justify-content: ${props => props.$justifyContent || 'center'};
    width: ${props => props.$width || ''};
    height: ${props => props.$height || ''};
    gap: 7px;

`;

const BottomWrapper = styled.div`
    display: flex;
    flex-direction: row;
      width: 100%;
     justify-content: center;
    gap: 10px;
`

const BottomLeftWrapper = styled.div`
    display: flex;
    box-sizing: border-box;
    flex-direction: row;
    border: 2.5px solid rgba(var(--purple-light));
    justify-content: space-around;
    border-radius: 3px;
    align-items: center;
    width: 110px;
    height: ${props => props.$height || '50px'}
    margin-top: 10px;
`;


const BottomRightWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-around;
    border-radius: 3px;
    background-color: rgba(var(--purple-mid), 1);
    width: ${props => props.$width || '155px'};
    height: ${props => props.$height || '50px'};
    // padding: 0% 2;

`;

const BottomInnerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.$justifyContent || 'center'};
    // text-align: ${props => props.$textAlign || 'center'};
    gap: 5px;
   
`;

const SvgIcon = styled.img`
    width: ${props => props.$width || '25px'};
    height: ${props => props.$height || '25px'};
    cursor: pointer;

    &:hover {
    content: url(${props => props.$hoverIcon2});
    width: ${props => props.$width || '22px'};
    height: ${props => props.$height || '22px'};

    }

    opacity: 0.9;
    `;

    const Header = styled.h3`
        color: rgb(var(--purple-dark));
        font-family: Cinzel;
        font-size: 14px;
        white-space: nowrap;
        text-align: center;
        font-style: normal;
        font-weight: 600;
    `;

    const Text = styled.p`
        color: ${props => props.$color || 'rgb(var(--cream))'};
        font-family: Montserrat;
        font-size: ${props => props.$fontSize || '11px'};
        font-style: ${props => props.$fontStyle || 'normal'};
        font-weight: ${props => props.$fontWeight || '400'};
        text-align: ${props => props.$textAlign || 'center'};
        letter-spacing: 1.3px;
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

const CartCard = ({cartItem, refresh}) => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const imageUrl = `${BASE_URL}${cartItem.product_image}`;
    const [cartQuantity, setCartQuantity] = useState(cartItem.quantity)
    const sizeDictionary = {
        'X-Small': 'XS',
        'Small': 'S',
        'Medium': 'M',
        'Large': 'L',
        'X-Large': 'X-l',
        'XX-Large': 'XXL'
    }

    const handleQuantitySelect = async (event) => {
        const newQuantity = parseInt(event.target.value, 10);
    
        setCartQuantity(newQuantity);
    
        try {
            const updatedCartItem = await updateCartItem(token, customerData.cart_id, cartItem.cart_item_id, newQuantity);
            console.log('Updated cartItem -(CartCard)-->', updatedCartItem);
    
            refresh();
        } catch (error) {
            console.error('Error updating cart item.');
        }
    };
    
    
    const handleRemoveClick = async () => {
        try {
            const removedCartItem = await deleteCartItem(token, customerData.cart_id, cartItem.cart_item_id);
            console.log('Removed cartItem -(cartCard)-->', removedCartItem);

           
                refresh()
            
        } catch (error) {
            console.error('Error deleting item from cart.')
        }
    };

    return (
        <CardWrapper>
            <InsideWrapper>

            <InnerCardWrapper>
                <InnerDiv $justifyContent={'start'} >
                    <ItemImage $imageUrl={imageUrl}/>
                    
                </InnerDiv>
                
                <InnerDiv $justifyContent={'center'} $border={'2.5px solid rgba(var(--purple-light), 1)'} $padding={'0% 2%'} $width={'175px'}>
                    <Header>{cartItem.product_name}</Header>
                    <Text $color={'rgba(var(--purple-mid), 1)'} $fontWeight={'500'} $fontSize={'11px'}>{cartItem.product_description}</Text>
                   
                </InnerDiv>
            </InnerCardWrapper>
            <BottomWrapper>
            <BottomLeftWrapper>
                <Text $color={'rgba(var(--purple-mid), 1)'} $fontWeight={'600'} $fontSize={'13px'} >{`$${cartItem.product_price}`}</Text>
                <SvgIcon
                 $width={'21px'}
                 $height={'21px'}
                 src={removePurpleMid}
                 $hoverIcon2={removePink}
                 onClick={handleRemoveClick}
                />
            </BottomLeftWrapper>
            <BottomRightWrapper>
                        <BottomInnerDiv>
                            <Text $fontWeight={'600'} $fontSize={'11px'}>Qty.</Text>
                            <SelectBox>
                               
                                <Select 
                                $fontSize={'11px'} 
                                $fontWeight={'700'} 
                                $padding={'0px 0px '}
                                defaultValue={cartItem.quantity} 
                                onChange={handleQuantitySelect}>
                                    <Option key={cartItem.cart_item_id} value={cartItem.quantity} disabled >{`-${cartItem.quantity}-`}</Option>

                                {[1, 2, 3, 4, 5].map((value) => (
                                    <Option 
                                    key={value}value={value}>{value}</Option>
                                ))}
                            </Select>
                            </SelectBox>
                        </BottomInnerDiv>
                        <BottomInnerDiv>
                            <Text $fontWeight={'600'} $fontSize={'12px'} $textAlign={'center'}>Size:</Text>
                            <Text $fontWeight={'600'} $textAlign={'center'} $fontSize={'12px'}>{`${sizeDictionary[cartItem.product_size]}`}</Text>
                        </BottomInnerDiv>
                    </BottomRightWrapper>
            </BottomWrapper>
            
        </InsideWrapper>
        </CardWrapper>
    )
};

export default CartCard