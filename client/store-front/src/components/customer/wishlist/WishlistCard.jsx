import React, { useState, useContext } from "react";
import styled from "styled-components";
import { BASE_URL } from "../../../api/apiConfig";
import { getToken } from "../../shared/auth";
import { CustomerContext } from "../../../CustomerContext";
import { fetchProduct } from "../../../api/product";
import { addCartIem } from "../../../api/cart";
import { deleteWishlistItem } from "../../../api/wishlist";

import removePurpleMid from '../../../assets/icons-svg/removeIcon/removePurpleMid.svg';
import removePink from '../../../assets/icons-svg/removeIcon/removePink.svg'



const CardWrapper = styled.div`
  width: 255px;
  height: 335.461px;
  margin-top: 10px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
 
`;

const ProductName = styled.p`
  color: rgb(var(--purple-mid));
  font-family: Cinzel;
  font-size: 20px;
  white-space: nowrap;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 1.32px;
  margin-bottom: 10px;
`;

const ProductImageCard = styled.div`
  width: 199px;
  height: 254px;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
 margin-bottom: 5%;
`;

const PriceButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 199px;
  cursor: pointer;
  opacity: 1;
`;

const SvgIcon = styled.img`
    width: ${props => props.width || '25px'};
    height: ${props => props.width || '25px'};
    cursor: pointer;

    &:hover {
    content: url(${props => props.$hoverIcon2})

    }

    opacity: 0.9;
    `;


const Button = styled.button`
  background-color: ${props => props.$backgroundColor || 'rgb(var(--purple-mid))'};
  color: rgb(var(--cream));
  font-family: Montserrat;
  font-size: ${props => props.$fontSize || '12px'};
  font-weight: 600;
  // width: 75px;
  padding: ${props => props.$padding ||  '7px 10px'};
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;

  &:hover {
    background-color: ${props => props.$hoverBackgroundColor || 'rgb(var(--purple-dark))'};
  }
`;

const OrderBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 199px;
  margin-top: 5px;
  justify-content: center;
  gap: 10px;

`;


const Select = styled.select`
  background-color: rgb(var(--cream)); 
  border: 2px solid rgba(var(--purple-light), 1); 
  border-radius: 3px; 
  color: rgb(var(--purple-mid)); 
  font-family: Montserrat, sans-serif;
  font-weight: ${props => props.$fontWeight || '500'};
  font-size: ${props => props.$fontSize || '12px'};
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
   display: flex;
  flex-direction: row;
`;


const WishlistCard = ({ wishItem, refresh }) => {
  const token = getToken();
  const { customerData } = useContext(CustomerContext);
  const imageUrl = `${BASE_URL}${wishItem.product_image}`;
  const [showOrderBox, setShowOrderBox] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);  // Initially null
  const [customerSelection, setCustomerSelection] = useState({
    inventoryId: '',
    productSize: '',
    quantity: 1,
  });
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple clicks while processing

  // Handle size selection
  const handleSizeSelect = (event) => {
    const selectedSize = event.target.value;
    const selectedInventory = selectedProduct?.inventory.find((item) => item.product_size === selectedSize);
    setCustomerSelection((prevState) => ({
      ...prevState,
      productSize: selectedSize,
      inventoryId: selectedInventory ? selectedInventory.inventory_id : '',
    }));
  };

  // Handle quantity selection
  const handleQtySelect = (event) => {
    const selectedQty = event.target.value;
    setCustomerSelection((prevState) => ({
      ...prevState,
      quantity: selectedQty,
    }));
  };

  // Add product to cart
  const handleAddCartClick = async () => {
    setShowOrderBox(!showOrderBox);

    if (!selectedProduct) {
      try {
        const fetchedProduct = await fetchProduct(wishItem.product_id);
        if (!fetchedProduct) {
          console.error('Failed to fetch product details');
          return;
        }
        setSelectedProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
  };

  // Submit the selected product to cart and delete from wishlist
  const handleSubmitClick = async () => {
    if (!selectedProduct || !customerSelection.inventoryId) {
      console.error('Product or inventory not selected correctly.');
      return; // Prevent action if product details are missing
    }

    try {
      setIsProcessing(true);  // Start processing

      // Step 1: Add to cart
      const newCartItem = await addCartIem(
        token,
        customerData.cart_id,
        selectedProduct.id,
        customerSelection.inventoryId,
        customerSelection.productSize,
        customerSelection.quantity
      );
      console.log('Item added to cart:', newCartItem);

      const deletedWishlistItem = await deleteWishlistItem(token, customerData.wishlist_id, wishItem.wishlist_item_id);
      console.log('Item removed from wishlist:', deletedWishlistItem);

      refresh();

      setShowOrderBox(false);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsProcessing(false); 
    }
  };

  const handleRemoveClick = async () => {

    try {
      const deletedWishlistItem = await deleteWishlistItem(token, customerData.wishlist_id, wishItem.wishlist_item_id);
      console.log('Item removed from wishlist:', deletedWishlistItem);

      refresh();
    } catch (error) {
      console.error('Error removing wishlist item.')
    }
  }

  return (
    <CardWrapper>
      <ProductName>{wishItem.product_name}</ProductName>
      <ProductImageCard $imageUrl={imageUrl} />
      <PriceButtonWrapper>
        <Button onClick={handleAddCartClick} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Add to Cart'}
        </Button>
        <SvgIcon
          width={'21px'}
          height={'21px'}
          src={removePurpleMid}
          $hoverIcon2={removePink}
          onClick={handleRemoveClick}
        />
      </PriceButtonWrapper>

      {showOrderBox && (
        <OrderBox>
          <SelectBox>
            <Select $fontSize={'10px'} $fontWeight={'600'} $padding={'0px 0px '} onChange={handleQtySelect}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Option key={value}>{value}</Option>
              ))}
            </Select>
          </SelectBox>
          <SelectBox>
            <Select $fontSize={'10px'} $fontWeight={'600'} $padding={'0px 0px '} onChange={handleSizeSelect}>
              {selectedProduct?.inventory &&
                selectedProduct.inventory.map((item) => (
                  <Option key={item.inventory_id} value={item.product_size}>
                    {item.product_size}
                  </Option>
                ))}
            </Select>
          </SelectBox>
          <Button onClick={handleSubmitClick} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Submit'}
          </Button>
        </OrderBox>
      )}
    </CardWrapper>
  );
};
export default WishlistCard