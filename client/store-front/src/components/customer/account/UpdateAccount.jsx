import React, {useState, useEffect, useContext} from "react";
import { updateCustomerAddress, fetchCustomerAddress, updateCustomer, fetchCustomer } from "../../../api/customers";
import { CustomerContext } from "../../../CustomerContext";
import styled from "styled-components";
import { getToken } from "../../shared/auth";

const CheckoutWrapper = styled.div`
    display: flex;
   flex-direction: column;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

   padding: 5% 10%;

    height: calc(100vh - 7rem - 3rem); 

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  
        padding: 0% 5%;
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem); 
         padding: 5% 5%;
    }

    @media (max-width: 500px) {
    padding: 2%;
}
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 560px) minmax(160px, 560px);
  //grid-template-columns: 1fr 1fr; 
  grid-template-rows: auto auto auto; 
  gap: 20px;
  // width: 1000px;
  max-length: 100%;
  max-height: 100%
  
`;

const Title = styled.div`
  grid-column: 1 / -1; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--ras-pink)); 
  text-align: center;
  border-radius: 3px;
  font-size: 2rem;
  font-weight: bold;
  padding: 2%;

  
  h1 {
  font-family: Cinzel; 
  font-size: 39px;
  color: rgb(var(--cream));
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.34px;
  text-align: center;
  text-wrap: nowrap;

  @media (max-width: 950px) {
     font-size: 30px;
  }
  @media (max-width: 650px) {
     font-size: 25px;
  }


  @media (max-width: 500px) {
     font-size: 20px;
  }
  @media (max-width: 375px) {
     font-size: 22px;
  }
  
`;

const H2 = styled.h2`
  font-family: Cinzel; 
  font-size: 25px;
  color: ${props => props.$color || 'rgb(var(--cream))' };
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.6px;
  text-align: center;
  text-wrap: nowrap;

  @media (max-width: 950px) {
     font-size: 20px;
  }

  @media (max-width: 600px) {
     font-size: 17px;
  }
  @media (max-width: 500px) {
     font-size: 15px;
  }
  @media (max-width: 450px) {
     font-size: 14px;
  }
  @media (max-width: 395px) {
     font-size: 14px;
  }
`;

const AccountDetails = styled.div`
  grid-column: 2 / 3; // Left column
  grid-row: 2 / 4; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: rgb(var(--purple-light));
  padding: 7%;
  border-radius: 3px;
  gap: 15px;

`;
const Address = styled.div`
  grid-column: 1 / 2; // Left column
  grid-row: 2 / 4; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: rgb(var(--purple-mid));
  padding: 7%;
  border-radius: 3px;
  gap: 15px;

`;

const BottomAddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  //background-color: pink;
  justify-content: center;
  align-items: center;
  width: 95%;
  align-self: center;
`;



const Input = styled.input`

  padding: ${props => props.$padding ||  '8px 0px 8px 15px'};
  background-color: rgb(var(--cream));
  max-width: ${props => props.$maxWidth || '100%'};
  border: none;
  outline: none;
  border-radius: 3px;
  color: ${props => props.$color || 'rgb(var(--purple-deep))' };
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.361px;
  text-align: ${props => props.$textAlign || 'start'};

  &::placeholder {
    color: rgb(var(--purple-light));
  }
  

  &:-webkit-autofill {
    box-shadow: 0 0 0 30px rgb(var(--cream)) inset !important;
    -webkit-box-shadow: 0 0 0 30px rgb(var(--cream)) inset !important;
    -webkit-text-fill-color: rgb(var(--purple-deep)) !important;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.35px;
    }


  @media (max-width 700px) {
    font-size: 13px;  
      letter-spacing: 0.1px;

      &:-webkit-autofill {
      font-size: 13px;
      
    }
  }

    @media (max-width: 600px) {
    font-size: 13px;

    &:-webkit-autofill {
    font-size: 13px;
  
  }

}


`;

const Button = styled.button`
  width: 65px;
  height: 65px;
  background-color: rgb(var(--ras-pink));
  border-radius: 50%;
  border: none;
  cursor: pointer;
  align-self: ${props => props.$alignSelf};
  margin: 10px 0px;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.35px;
  text-transform: capitalize;
  color: rgb(var(--cream));

  @media (max-width: 950px) {
    width: 60px;
    height: 60px;
    margin: 5px 0px ;
  }

  @media (max-width: 500px) {
    width: 55px;
    height: 55px;
    font-size: 12px;
  }

  &:hover{
  background-color: rgb(var(--mustard));
  color: rgb(var(--purple-dark));
  }
  `;

const UpdateAccount = () => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const [originalAddress, setOriginalAddress] = useState({});
    const [address, setAddress] = useState({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    });
    const [checkPasswordMatch, setCheckPasswordMatch] = useState(false);
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [customerInfo, setCustomerInfo] = useState({});
    const [newCustomerInfo, setNewCustomerInfo] = useState({
        last_name: '',
        first_name: '',
        email: '',
        newPassword: '',
        originalPassword: '',
    });

    useEffect(() => {
        if (!customerData.id) {
            return;
        }
        const getCustomerAddress = async () => {
            try {
                const addressInDatabase = await fetchCustomerAddress(customerData.id);
                setOriginalAddress(addressInDatabase);
                setAddress(addressInDatabase);
            } catch (error) {
                console.error("Failed to fetch customer address:", error);
            }
        };
        getCustomerAddress();
    }, [customerData.id]);

    useEffect(() => {
        if (!customerData.id) {
            return;
        }
        const getCustomerAccountInfo = async () => {
            try {
                const fetchedAccountInfo = await fetchCustomer(customerData.id, token);
                setCustomerInfo(fetchedAccountInfo);
                setNewCustomerInfo({
                    last_name: fetchedAccountInfo.last_name || '',
                    first_name: fetchedAccountInfo.first_name || '',
                    email: fetchedAccountInfo.email || '',
                    newPassword: '',
                    originalPassword: '',
                });
            } catch (error) {
                console.error("Failed to fetch customer account info:", error);
            }
        };
        getCustomerAccountInfo();
    }, [customerData.id]);

    const handleAddressInputChange = (event) => {
        const { name, value } = event.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleSaveAddress = async () => {
        if (JSON.stringify(address) !== JSON.stringify(originalAddress)) {
            try {
                const updatedAddress = await updateCustomerAddress(customerData.id, address, token);
                setAddress(updatedAddress);
            } catch (error) {
                console.error("Error updating address:", error);
            }
        }
    };

    const handleAccountInputChange = (event) => {
        const { name, value } = event.target;
        setNewCustomerInfo((prevAccountInfo) => ({
            ...prevAccountInfo,
            [name]: value,
        }));
    };

    const handleNewPasswordInputChange = (event) => {
        const { value } = event.target;
        setNewPasswordCheck(value);
        setCheckPasswordMatch(value === newCustomerInfo.newPassword);
    };

    const handleSaveAccount = async () => {
        try {
            const updatedAccount = await updateCustomer(customerData.id, newCustomerInfo, token);
            console.log(updatedAccount);
        } catch (error) {
            console.error('Error updating customer details:', error);
        }
    };

    return (
        <CheckoutWrapper>
            <CheckoutContainer>
                <Title><h1>Customer Details</h1></Title>

                <AccountDetails>
                    <H2>Account Details</H2>
                    <Input
                        placeholder="First Name"
                        name="first_name"
                        value={newCustomerInfo.first_name}
                        onChange={handleAccountInputChange}
                    />
                    <Input
                        placeholder="Last Name"
                        name="last_name"
                        value={newCustomerInfo.last_name}
                        onChange={handleAccountInputChange}
                    />
                    <Input
                        placeholder="Email Address"
                        name="email"
                        value={newCustomerInfo.email}
                        onChange={handleAccountInputChange}
                    />
                    <Input
                        type="password"
                        placeholder="Current Password"
                        name="originalPassword"
                        value={newCustomerInfo.originalPassword}
                        onChange={handleAccountInputChange}
                    />
                    <Input
                        type="password"
                        placeholder="New Password"
                        name="newPassword"
                        value={newCustomerInfo.newPassword}
                        onChange={handleAccountInputChange}
                    />
                    <Input
                        $color={checkPasswordMatch ? 'rgb(var(--purple-dark))' : 'rgb(var(--ras-pink))'}
                        type="password"
                        placeholder="Confirm Password"
                        value={newPasswordCheck}
                        onChange={handleNewPasswordInputChange}
                    />
                    <BottomAddressWrapper>
                        <Button disabled={!checkPasswordMatch} onClick={handleSaveAccount}>Update</Button>
                    </BottomAddressWrapper>
                </AccountDetails>

                <Address>
                    <H2>Address</H2>
                    <Input
                        placeholder="Address Line 1"
                        name="address_line1"
                        value={address.address_line1}
                        onChange={handleAddressInputChange}
                    />
                    <Input
                        placeholder="Apt, Suite, etc."
                        name="address_line2"
                        value={address.address_line2}
                        onChange={handleAddressInputChange}
                    />
                    <Input
                        placeholder="City"
                        name="city"
                        value={address.city}
                        onChange={handleAddressInputChange}
                    />
                    <Input
                        placeholder="State"
                        name="state"
                        value={address.state}
                        onChange={handleAddressInputChange}
                    />
                    <Input
                        placeholder="Zip Code"
                        name="zip_code"
                        value={address.zip_code}
                        onChange={handleAddressInputChange}
                    />
                    <Input
                        placeholder="Country"
                        name="country"
                        value={address.country}
                        onChange={handleAddressInputChange}
                    />
                    <BottomAddressWrapper>
                        <Button onClick={handleSaveAddress}>Update</Button>
                    </BottomAddressWrapper>
                </Address>
            </CheckoutContainer>
        </CheckoutWrapper>
    );
};

export default UpdateAccount;
