import React, {useContext} from "react";
import { CustomerContext } from "../../CustomerContext.jsx";


const Account = () => {
const {customerData} = useContext(CustomerContext);
    return (
        <>
        
        <h1>Account</h1>
        <h2>Welcome back {customerData.first_name} {customerData.last_name}!</h2>
        </>
    );
};

export default Account