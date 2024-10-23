import React, {useEffect, useState, useContext} from "react";
import styled from "styled-components";
import { getToken } from "../../shared/auth";
import { BASE_URL } from "../../../api/apiConfig";
import { updateCartItem, deleteCartItem } from "../../../api/cart";
import removePurpleMid from '../../../assets/icons-svg/removeIcon/removePurpleMid.svg';
import removePink from '../../../assets/icons-svg/removeIcon/removePink.svg'

const CardWrapper = styled.div`
    width: 300px;
    height: 220px;
    border: 2px solid rgba(var(--purple-light), 1); 
`;



const CartCard = (cartItem, refreshHandler) => {



    return (
        <CardWrapper>

        </CardWrapper>
    )
};

export default CartCard