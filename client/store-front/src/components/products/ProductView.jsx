import React, {useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct } from "../../api/product";
import { BASE_URL } from "../../api/apiConfig";
import styled from "styled-components";
import { getToken } from "../shared/auth";
import {CustomerContext} from '../../CustomerContext'
import windowResize from "../shared/hooks/windowResize";

import cartLight from '../../assets/icons-svg/cart/cartLight.svg';
import wishlistLight from '../../assets/icons-svg/wishlist/wishlistLight.svg';


const WebView = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 83vh;
  background-color: pink;
  
`;

const MobileView = styled.div`

`;


const RightWebWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: grey;
  align-items: center;
`;

const LeftWebWrapper = styled.div`

`;


const ProductName = styled.h1`
  color: #4A4E69;
  font-family: Cinzel;
  font-size: 85px;
  white-space: nowrap;
  text-align: start;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 1.32px;
  margin-bottom: 10px;
`;


const ProductImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: 45%;
  border-radius: 3px;
  // margin-bottom: 10px;
`
const ProductView = () => {
    const {width} = windowResize();
    const token = getToken();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [customerId, setCustomerId] = useState('')
    const { productId } = useParams();
    const navigate = useNavigate();

    

    useEffect(() => {
        const getProductById = async () => {
            try {
                const fetchedProduct = await fetchProduct(productId);
                console.log('Fetched Product (productView) -->', fetchedProduct);
                console.log('Product Array -->', fetchedProduct.inventory)
                setSelectedProduct(fetchedProduct);
            } catch (error) {
                setSelectedProduct('');
                console.error('Failed to fetch product', error);
            }
        };
        if (productId) {
            getProductById();
        }
    }, [productId])

    if (!selectedProduct) {
        return <div>Product Not Found! 🤦🏽‍♀️</div>;
      }

      const imageUrl = `${BASE_URL}${selectedProduct.image}`;

      const handleAddToCart = async () => {
        try {
            
        } catch (error) {
            
        }
      }


    return(
        <>
          {width <= 950 ? (
            <MobileView>

            </MobileView>
          ) : (
            <WebView>
              <RightWebWrapper>
                <ProductName>{selectedProduct.name}</ProductName>
                <ProductImage src={imageUrl}/>
              </RightWebWrapper>
              <LeftWebWrapper>

              </LeftWebWrapper>
            </WebView>
          )}

        </>
    )
}

export default ProductView