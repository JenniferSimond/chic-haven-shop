import React, {useEffect, useState, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../../api/product';
import { BASE_URL } from '../../api/apiConfig';
import styled from 'styled-components';
import { getToken } from '../shared/auth';
import {CustomerContext} from '../../CustomerContext'
import windowResize from '../shared/hooks/windowResize';
import { addCartIem } from '../../api/cart';
import  {addWishlistItem} from '../../api/wishlist';
import ProductReviews from './ProductReviews';
import cartCream from '../../assets/icons-svg/cart/cartCream.svg';
import wishlistLight from '../../assets/icons-svg/wishlist/wishlistLight.svg';

const WebView = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  height: 83vh;
  margin: 0% 2.5%;
  // background-color: pink;
`;

const InnerWebWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  
`;

const MobileView = styled.div``;

const LeftWebWrapper = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%
`;

const RightWebWrapper = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
 align-items: center;
  justify-content: center;
  height: 100%;

`;

const ProductName = styled.h1`
  color: rgb(var(--purple-mid));
  font-family: Cinzel;
  font-size: 70px;
  white-space: nowrap;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 1.32px;
  margin-top: 1%;
`;

const ProductImage = styled.img`
  display: block;
  width: 80%;
  height: auto;
  max-width: 540px;
  border-radius: 3px;
`;


const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 15px; /* Space between price and select box */
  margin-top: 1%;
  // width: 100%;

`;

const SizeSelectionBox = styled.div`
  display: flex;
  flex-direction: row;
`;


const Select = styled.select`
  background-color: rgb(var(--cream)); 
  border: 2px solid rgba(var(--purple-light), 1); 
  border-radius: 3px; 
  color: rgb(var(--purple-mid)); 
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  font-size: 15px;
  text-align: center;
  padding: 4px 8px;
  // cursor: pointer;
  outline: none;

  &:focus {
    border-color: rgba(var(--purple-mid), 1);
  }

  &:hover {
    background-color: rgba(var(--purple-dark), 1);
    border-color: rgba(var(--purple-dark), 1);
    color: rgb(var(--cream));
  }
`;

const Option = styled.option``;

const DescriptionBox = styled.div`
  margin: 2% 0% 1% 0%;
  width: 78%;
  max-width: 560px;
  // background-color: pink;
`;

const Description = styled.p`
  color: rgb(var(--purple-mid));
  font-family: Montserrat;
  font-size: 15px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 1px;
  opacity: 1;
`;

const Price = styled.p`
  color: rgb(var(--purple-dark));
  font-family: Montserrat;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.215px;
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Button = styled.button`
  background-color: rgb(var(--purple-light));
  color: #fff;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  width: 75px;
  padding: 7px 20px;
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  // cursor: pointer;

  &:hover {
    background-color: rgb(var(--purple-mid));
  }
`;

const ProductView = () => {
  const { width } = windowResize();
  const token = getToken();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productInventory, setProductInventory] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  const customerId = customerData.id;
  const cartId = customerData.cart_id;
  const wishlistId = customerData.wishlist_id;

  useEffect(() => {
    const getProductById = async () => {
      try {
        const fetchedProduct = await fetchProduct(productId);
        setSelectedProduct(fetchedProduct);
        setProductInventory(fetchedProduct.inventory);
      } catch (error) {
        setSelectedProduct('');
        setProductInventory([]);
      }
    };
    if (productId) {
      getProductById();
    }
  }, [productId]);

  if (!selectedProduct) {
    return <div>Product Not Found! 🤦🏽‍♀️</div>;
  }

  const imageUrl = `${BASE_URL}${selectedProduct.image}`;

  return (
    <>
      {width <= 950 ? (
        <MobileView>
          {/* Add mobile view logic here */}
        </MobileView>
      ) : (
        <WebView>
            <ProductName>{selectedProduct.name}</ProductName>
          <InnerWebWrapper>

          <LeftWebWrapper>
            <ProductImage src={imageUrl} />
            <DescriptionBox>
                <Description>{selectedProduct.description}</Description>
              </DescriptionBox>
            <SelectionWrapper>
              
                <Price>${selectedProduct.price}</Price>
                <SizeSelectionBox>
                  <Select>
                    {productInventory &&
                      productInventory.map((inventory) => (
                        <Option key={inventory.id}>{inventory.product_size}</Option>
                      ))}
                  </Select>
                </SizeSelectionBox>
                <Button>
                  <ButtonIcon src={cartCream} />
                  Cart
                </Button>
                <Button>
                  <ButtonIcon src={wishlistLight} />
                  Wishlist
                </Button>
              </SelectionWrapper>
              
          </LeftWebWrapper>
          <RightWebWrapper>

            <ProductReviews selectedProduct={selectedProduct} />
          </RightWebWrapper>
          </InnerWebWrapper>
        </WebView>
      )}
    </>
  );
};

export default ProductView