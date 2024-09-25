import React, {useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerContext";

const Cart = () => {
    const {customerData} = useContext(CustomerContext);

    if (!customerData.id) {

        return(

            <div>
        Please Login to view Cart
       </div>
    )
    }

    return (
        <h1>Cart</h1>
    );
};

export default Cart