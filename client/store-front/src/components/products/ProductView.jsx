import React, {useEffect, useState, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../../api/product';
import { BASE_URL } from '../../api/apiConfig';
import styled from 'styled-components';
import { getToken } from '../shared/auth';
import { CustomerContext } from '../../CustomerContext'
import windowResize from '../shared/hooks/windowResize';
import { addCartIem } from '../../api/cart';
import  {addWishlistItem} from '../../api/wishlist';
import ProductReviews from './ProductReviews';
import cartCream from '../../assets/icons-svg/cart/cartCream.svg';
import wishlistLight from '../../assets/icons-svg/wishlist/wishlistLight.svg';

const NullProductView = styled.div`
   display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  height: 83vh;
  padding: 0% 3%;

  p {
    font-family: Montserrat;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: rgb(var(--purple-mid));
  }
`;

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
  margin: 2% 5%;

`;

const MobileView = styled.div`
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

  @media (max-width: 397px) {
   padding: 7px 7px;
   font-size: 10px;
  }

  @media (max-width: 331px) {
   padding: 7px 5px;
   font-size: 9px;
  }

`;

const MobileOptionButton = styled.button`
  background-color: rgba(var(--purple-light), 1);
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
    flex-direction: column;
    align-content: center;
    margin-top: 0%;
    width: 90%;
    min-height: 90px;
    max-height: 120px;
    max-width: 350px;
    min-width: 120px;
    padding: 1%;
    border-radius: 3px;
    
`;

const LeftWebWrapper = styled.div`
  display: flex;
  // flex-grow: 1;
  flex-basis: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
`;

const RightWebWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 40px;
`;

const ProductName = styled.h1`
  color: rgb(var(--purple-mid));
  font-family: Cinzel;
  font-size: ${props => props.$fontSize || '75px'};
  white-space: nowrap;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 1.32px;
  padding-top: 1.5%;

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
  max-width:  ${props => props.$maxWidth || '550px'};
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
  margin-top: 20px;
  width: 75%;
  align-self: center;
  padding-left: 2%;
  //background-color: pink;
 
  @media (max-width: 950px) {
    max-width: 450px;
    fonst-size: 15px;
    width: 100%;
    padding-left: 0%;
    margin-top: 0%;
  }

  @media (max-width: 658px) {
    max-width: 400px;
  }
`;

const Description = styled.p`
  color: rgb(var(--purple-mid));
  font-family: Montserrat;
  font-size: 20px;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  // line-height: 35px;
  letter-spacing: 1px;
  opacity: 1;

  @media (max-width: 1050px) {
    font-size: 18px;
  }

  @media (max-width: 950px) {
    margin: 2% 0% 1% 0%;
   width: 100%;
   font-size: 15px;
   text-align: center;
   font-weight: 500;
   line-height: 22px;
  }

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

  &:hover {
    background-color: rgb(var(--purple-mid));
  }
`;

const AddedCartText = styled.p`
  color: rgb(var(--purple-dark));
  font-family: Montserrat;
  font-size: ${props => props.$fontSize || '15px'};
  font-style: italic;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.215px;

  @media (max-width: 425px) {
    font-size: 10px;
  }

  ::first-letter {
    text-transform: uppercase;
  }
`;

const ProductView = () => {
  const navigate = useNavigate();
  const { width } = windowResize();
  const token = getToken();
  const { productId } = useParams();
  const { customerData } = useContext(CustomerContext);

  const [cartAddMessage, setCartAddMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [viewMobileReviews, setVewMobileReviews] = useState(false);
  const [customerSelection, setCustomerSelection] = useState({
    inventoryId: '',
    productSize: '',
    quantity: 1,
  })

  let conditionalButtonText = '';

  viewMobileReviews === false ? conditionalButtonText = 'See Reviews' : conditionalButtonText = 'Leave Review';

  useEffect(() => {
    const getProductById = async () => {
      try {
        const fetchedProduct = await fetchProduct(productId);
        setSelectedProduct(fetchedProduct);
      } catch (error) {
        setSelectedProduct('');
      }
    };
    if (productId) {
      getProductById();
    }
  }, [productId]);

  if (!selectedProduct.inventory) {
    return <NullProductView>
      <p>Product Not Found! 🤦🏽‍♀️</p>
    </NullProductView>;
  }

  const imageUrl = `${BASE_URL}${selectedProduct.image}`;

  const handleReviewOptClick = () => {
    setVewMobileReviews(!viewMobileReviews);
  };

  const handleSizeSelect = (event) => {
    const selectedSize = event.target.value;
    const selectedInventory = selectedProduct.inventory.find((item) => item.product_size === selectedSize);
    setCustomerSelection(prevState => ({
      ...prevState,
      productSize: selectedSize,
      inventoryId: selectedInventory ? selectedInventory.inventory_id : ''
    }))

    console.log('Customer Selection Size Select ->', selectedInventory, selectedSize)
  };

  const handleQtySelect = (event) => {
    const selectedQty = parseInt(event.target.value, 10);
    setCustomerSelection(prevState => ({
      ...prevState,
      quantity: selectedQty
    }))
  }

  const handleAddCartClick = async () => {
    if (!customerData.id) {
      alert('Please log in to add items to cart.')
    }

    if (!customerSelection.quantity || customerSelection.quantity === 'Qty.') {
      alert('Please select a valid quantity.');
      return;
    }

    if (!customerSelection.productSize || customerSelection.productSize === '--Size--') {
      alert('Please select a valid size.');
      return;
    }
    
    
    try {
      const newCartItem = await addCartIem(token, customerData.cart_id, selectedProduct.id, customerSelection.inventoryId, customerSelection.productSize, customerSelection.quantity)
      console.log('Added Item -->', newCartItem);

      if (newCartItem) {
        setCartAddMessage(!cartAddMessage);
      }
      setTimeout(() => {
        setCartAddMessage(!cartAddMessage);
        navigate('/products');
      }, 600);
      
      
    } catch (error) {
      console.error('Error adding cart item: ', error);
    }
  }

  const handleAddWishlistClick = async () => {
    if (!customerData.id) {
      alert('Please log in to add items to wishlist.')
    }

    try {
      const newWishlistItem = await addWishlistItem(token, customerData.wishlist_id, selectedProduct.id);
      console.log('New Wishlist Item ->',newWishlistItem)

    } catch (error) {
      console.error('Error adding wishlist item: ', error)
    }
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
            <Price $fontSize={'13px'}>{`$${selectedProduct.price}`}</Price>
              <QtySelectBox>
                  
                  <Select $fontSize={'11px'} $fontWeight={'600'} $padding={'5px 5px '} onChange={handleQtySelect}>
                    {[0,1,2,3,4,5].map((value)=>(
                      <Option key={value}>{value}</Option>
                    ))}
                  </Select>
                  
                </QtySelectBox>

                <SizeSelectionBox>
                  <Select $fontSize={'11px'} $fontWeight={'600'} onChange={handleSizeSelect}>
                    <Option value={''} selected disabled hidden>Size</Option>
                    {selectedProduct.inventory && 
                      selectedProduct.inventory.map((item) => (
                        <Option key={item.inventory_id} value={item.product_size}>{item.product_size}</Option>
                      ))}
                  </Select>
                </SizeSelectionBox>
            
                <MobileButton onClick={handleAddCartClick}>Add to Cart</MobileButton>
                <MobileButton onClick={handleAddWishlistClick}>Wishlist it</MobileButton>
            </MobileButtonBox>
            <AddedCartText>{cartAddMessage ? (
              `${selectedProduct.name} added to cart`
             ):('')
              
              }</AddedCartText>
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
            {/* <DescriptionBox>
                <Description>{selectedProduct.description}</Description>
              </DescriptionBox> */}
            <SelectionWrapper>
              
                <Price>${selectedProduct.price}</Price>
                <QtySelectBox>
                  <form>
                  <Select onChange={handleQtySelect}>
                    <Option>Qty.</Option>
                    {[1,2,3,4,5].map((value)=>(
                      <Option key={value}>{value}</Option>
                    ))}
                  </Select>
                  </form>
                </QtySelectBox>
                

                <SizeSelectionBox>
                  <Select onChange={handleSizeSelect} defaultValue='size'>
                  <Option value='size' selected disabled hidden>--Size--</Option>
                    {selectedProduct.inventory &&
                      selectedProduct.inventory.map((item) => (
                        <Option key={item.inventory_id}>{item.product_size}</Option>
                      ))}
                  </Select>
                </SizeSelectionBox>
                
                <Button onClick={handleAddCartClick}>
                  <ButtonIcon src={cartCream}/>
                  Cart
                </Button>
                <Button onClick={handleAddWishlistClick}>
                  <ButtonIcon src={wishlistLight} />
                  Wishlist
                </Button>
              </SelectionWrapper>
             <AddedCartText>{cartAddMessage ? (
              `${selectedProduct.name} added to cart`
             ):('')
              
              }</AddedCartText>
              
          </LeftWebWrapper>
          <RightWebWrapper>
          <DescriptionBox>
                <Description>{selectedProduct.description}</Description>
              </DescriptionBox>
            <ProductReviews selectedProduct={selectedProduct} />
          </RightWebWrapper>
          </InnerWebWrapper>
        </WebView>
      )}
    </>
  );
};

export default ProductView