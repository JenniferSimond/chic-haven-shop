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
  align-items: center;
  justify-content: space-evenly;
  height: 82vh;
  padding: 0% 3%;
  
`;

const InnerWebWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const MobileView = styled.div`
  // background-color: pink;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-height: 82vh;
  padding: 0% 2%;

  @media (max-width: 768px) {
    min-height: 85vh;
  }

  @media (max-width: 500px) {
    min-height: 81vh;
  }
 
`;

const MobileButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  min-width: 50%;
  gap: 5px;

  @media (max-width: 800px) {
    gap: 15px;
  }

   @media (max-width: 370px) {
    gap: 7px;
  }
  
`;



const MobileButton = styled.button`
  background-color: rgb(var(--purple-light));
  color: rgb(var(--cream));
  font-family: Montserrat;
  font-size: ${props => props.$fontSize || '11px'};
  font-weight: 600;
   padding: ${props => props.$padding || '7px 12px' };
  border: none;
  border-radius: 3px;

  &:hover {
    background-color: rgb(var(--purple-mid));
  }

  @media (max-width: 800px) {
    padding: 7px 10px;
  }

  @media (max-width: 370px) {
   padding: 7px 5px;
   font-size: 10px;
  }

  @media (max-width: 331px) {
   padding: 7px 5px;
   font-size: 9px;
  }
`;

const MobileOptionButton = styled.button`
  background-color: rgb(var(--purple-light));
  color: rgb(var(--cream));
  font-family: Montserrat;
  font-size: ${props => props.$fontSize || '11px'};
  font-weight: 600;
   padding: ${props => props.$padding || '7px 12px' };
  border: none;
  border-radius: 3px;

  &:hover {
    background-color: rgb(var(--purple-mid));
  }
`;

const MobileReviewsBox = styled.div`
    // background-color: lightblue;
    flex-direction: column;
    align-content: center;
    margin-top: 1%;
    width: 90%;
    min-height: 90px;
    max-height: 120px;
    max-width: 350px;
    min-width: 120px;
   padding: 1%;
    border-radius: 3px;
    // margin-bottom: 2%;
    
`;

const LeftWebWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const RightWebWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 50%;
  flex-direction: column;
  justify-content: center;
  height: 100%;

`;

const ProductName = styled.h1`
  color: rgb(var(--purple-mid));
  font-family: Cinzel;
  font-size: ${props => props.$fontSize || '60px'};
  white-space: nowrap;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 1.32px;
  padding-top: 1%;

  @media (max-width: 950px) {
    padding-top: 0%;
  }

  @media (max-width: 768px) {
    font-size: 57px;
  }

   @media (max-width: 658px) {
    font-size: 54px;
  }

  @media (max-width: 570px) {
    font-size: 50px;
  }

   @media (max-width: 530px) {
    font-size: 45px;
    letter-spacing: 1.2px;
  }

  @media (max-width: 461px) {
    font-size: 40px;
    letter-spacing: 1.2px;
  }

   @media (max-width: 426px) {
    font-size: 37px;
    letter-spacing: 1px;
  }
   @media (max-width: 389px) {
    font-size: 35px;
    letter-spacing: 1px;
  }

  @media (max-width: 370px) {
    font-size: 32px;
    letter-spacing: 1px;
  }

   @media (max-width: 333px) {
    font-size: 30px;
    letter-spacing: 1px;
  }
`;

const ProductImage = styled.img`
  display: block;
  width: ${props => props.$width ||'100%'};
  height: auto;
  max-width:  ${props => props.$maxWidth || '530px'};
  border-radius: 3px;

  @media (max-width: 659px) {
  
    width: 60%;
  }
`;


const SelectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 15px; /* Space between price and select box */
  margin-top: 1%;

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


const QtySelectBox = styled.div`
   display: flex;
  flex-direction: row;
`;

const DescriptionBox = styled.div`
  margin: 2% 0% 1% 0%;
  width: 100%;
  max-width: 568px;

  @media (max-width: 950px) {
    max-width: 520px;
  }

  @media (max-width: 658px) {
    max-width: 480px;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
  }

   @media (max-width: 658px) {
    font-size: 13px;
  }

   @media (max-width: 451px) {
    font-size: 12px;
  
  }

`;

const Price = styled.p`
  color: rgb(var(--purple-dark));
  font-family: Montserrat;
  font-size: ${props => props.$fontSize || '15px'};
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.215px;

  @media (max-width: 425px) {
    font-size: 12px;
  }
`;

const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Button = styled.button`
  background-color: rgb(var(--purple-light));
  color: rgb(var(--cream));
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
  const [viewMobileReviews, setVewMobileReviews] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();

  const { customerData } = useContext(CustomerContext);
  let conditionalButtonText = '';

  viewMobileReviews === false ? conditionalButtonText = 'See Reviews' : conditionalButtonText = 'Leave Review';

  useEffect(() => {
    const getProductById = async () => {
      try {
        const fetchedProduct = await fetchProduct(productId);
        setSelectedProduct(fetchedProduct);
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

  const handleReviewOptClick = () => {
    setVewMobileReviews(!viewMobileReviews);
  }
 

  return (
    <>
      {width <= 950 ? (
        <MobileView>
          <ProductName $fontSize={'58px'}>{selectedProduct.name}</ProductName>
          <ProductImage $maxWidth={'320px'} $width={'50%'} src={imageUrl}/>
          <DescriptionBox>
            <Description>{selectedProduct.description}</Description>
          </DescriptionBox>
          <MobileButtonBox>
            <Price $fontSize={'14px'}>{selectedProduct.price}</Price>
              <QtySelectBox>
                  <form>
                  <Select $fontSize={'11px'} $fontWeight={'600'} $padding={'5px 5px '}>
                    {[1,2,3,4,5].map((value)=>(
                      <Option key={value}>{value}</Option>
                    ))}
                  </Select>
                  </form>
                </QtySelectBox>

                <SizeSelectionBox>
                  <Select $fontSize={'11px'} $fontWeight={'600'}>
                    {selectedProduct &&
                      selectedProduct.inventory.map((item) => (
                        <Option key={item.inventory_id}>{item.product_size}</Option>
                      ))}
                  </Select>
                </SizeSelectionBox>
            <MobileButton>Add to Cart</MobileButton>
            <MobileButton>Wishlist it</MobileButton>
          </MobileButtonBox>
          <MobileReviewsBox>
          <ProductReviews selectedProduct={selectedProduct} viewMobileReviews={viewMobileReviews} />
          </MobileReviewsBox>
          <MobileOptionButton $padding={'10px 15px'} onClick={handleReviewOptClick}>{conditionalButtonText}</MobileOptionButton>
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
                <QtySelectBox>
                  <form>
                  <Select>
                    {[1,2,3,4,5].map((value)=>(
                      <Option key={value}>{value}</Option>
                    ))}
                  </Select>
                  </form>
                </QtySelectBox>
                

                <SizeSelectionBox>
                  <Select>
                    {selectedProduct &&
                      selectedProduct.inventory.map((item) => (
                        <Option key={item.inventory_id}>{item.product_size}</Option>
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