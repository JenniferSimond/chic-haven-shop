import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct } from "../../api/product";
import { BASE_URL } from "../../api/apiConfig";
import styled from "styled-components";
import { getToken } from "../shared/auth";

import cartLight from '../../assets/icons-svg/cart/cartLight.svg';
import wishlistLight from '../../assets/icons-svg/wishlist/wishlistLight.svg';

const ProductView = () => {
    const token = getToken();
    const [selectedProduct, setSelectedProduct] = useState('');
    const { ProductId } = useParams();
    const navigate = useNavigate();

    


    return(
        <h1>Product View</h1>
    )
}

export default ProductView