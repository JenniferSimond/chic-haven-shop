import React, {useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { CustomerContext } from "../../CustomerContext.jsx";


const Account = () => {
const {customerData} = useContext(CustomerContext);
const navigate = useNavigate()

    if (!customerData.id) {

        return(

            <div>
        Please Login to view Account
       </div>
    )
    }
    return (
        <>
        
        <h1>Account</h1>
        <h2>Welcome back {customerData.first_name} {customerData.last_name}!</h2>
        </>
    );
};

export default Account