import React, { useContext, useState } from 'react';
import { customerSignup } from '../../../api/customers.js';
import styled from 'styled-components';
import SideBar from '../../menuBars/SideBar.jsx';
import signupPic from '../../../assets/img-png/signupPic.png';
import {useNavigate} from 'react-router-dom';
import { setToken } from '../../shared/auth.js';
import { CustomerContext } from '../../../CustomerContext.jsx';

const WebWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    
    min-height: 80vh; // Ensure it takes the full height of the viewport
    position: relative; // Ensure it positions children relative to this container

`;

const InnerContentWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
   margin-right: 250px;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;

    @media (max-width: 1300px) {
        margin-right: 200px; // Adjust margin for smaller sidebar
    }
    
    @media (max-width: 1400px) {
        margin-right: 10%;
    }

    @media (max-width: 1050px) {
   margin-right: 16%;
  }

`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 900px;
  height: 400px;
  border: 3px solid rgb(var(--ras-pink));
  align-items: center;
  position: relative;
  margin-top: 7%;
  transition: all 0.5s ease;

  @media (max-width: 1399px) {
     width: 840px;
     height: 340px;
  }

  @media (max-width: 1300px) {
    width: 720px;
    height: 320px;
  }

  @media (max-width: 1050px) {
    width: 650px;
    height: 300px;
    }
`;

const YellowBox = styled.div`
  width: 50%;
  height: 100%;
  background-color: rgb(var(--mustard));
`;

const ModelImg = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: 42%;
  position: absolute;
  top: 46%;
  left: 13%;
  transition: all 0.5s ease;

  transform: translate(-25%, -55.6%);

    @media (max-width: 1399px) {
        max-width: 40%;
        position: absolute;
        top: 40%;
        left: 13%;
        transform: translate(-23%, -52.9%);
    }
    @media (max-width: 1300px) {
        max-width: 43%;
        position: absolute;
        top: 45%;
        left: 13%;
        transform: translate(-25%, -53.7%);
    }

     @media (max-width: 1050px) {
         top: 45%;
        left: 13%;
        transform: translate(-25%, -54.2%);
  }

`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items vertically */
  align-content: center;
  width: 50%;
  margin-top: 2%;

 
`;

const InnerFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputDivs = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 0px 15px 0px;
  border-radius: 3px;
`;

const Input = styled.input`
  max-width: 313.965px;
  width: 250px;
  height: 27px;
  border: none;
  border-radius: 3px;
  background-color: #d81159;
  outline: none;
  color: #f9f5e3;
  font-family: Montserrat;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.361px;
  text-align: center;

  transition: all 0.5s ease;
  

  &::placeholder {
    color: #f9f5e3;
    opacity: 0.8;
  }

  @media (max-width: 1300px) {
    width: 210px;
    height: 25px;
  }

  @media (max-width: 1050px) {
    width: 170px;
    height: 20px;
  }
`;

const Button = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: #4a4e69;
  color: rgb(var(--mustard));
  font-family: Montserrat;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.263px;
  text-transform: capitalize;
  margin-top: 2%;
    

   @media (max-width: 1300px) {
    width: 55px;
    height: 55px;
    font-size: 12px;
  }
   @media (max-width: 1050px) {
    width: 50px;
    height: 50px;
    font-size: 11px;
  }

  &:hover {
    background-color: #FFBC42;
    color: #D81159;
    font-size: 15px;
  }
`;

const H1 = styled.h1`
  color: #ffbc42;
  font-family: Cinzel;
  font-size: 65px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 4.38px;
  text-align: start;
  text-transform: uppercase;
  transition: all 0.5s ease;

  span {
    color: rgb(var(--purple-mid));
  }
 
  @media (max-width: 1399px) {
     font-size: 60px;
  }

  @media (max-width: 1300px) {
    font-size: 50px;
    }

  @media (max-width: 1050px) {
    font-size: 42px;
  }
`;


const P2 = styled.p`
  font-family: Montserrat;
  color: rgb(var(--purple-mid));
  font-size: 15px;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.326px;

  position: absolute;
  top: 94.6%;
  left: 66.5%;
  transform: translate(-25%, -20%);
  transition: all 0.5s ease;

  @media (max-width: 1300px) {
    font-size: 11px;
    font-weight: 500;
    top: 94.6%;
    left: 70%;
    transform: translate(-25%, -20%);
    }
    
    @media (max-width: 1050px) {
      font-size: 11px;
      font-weight: 500;
      top: 94.6%;
      left: 68%;
      transform: translate(-25%, -20%);
      }
`;

const RegisterWeb = () => {
  const {setCustomerData} = useContext(CustomerContext);
  const [signupFormData, setSignupData] = useState({
    last_name: '',
    first_name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = customerSignup(signupFormData);
      console.log(data)
      if (data ) {
        setToken(data.token);
        setCustomerData(data.userDetails);
        navigate('/account')
      } else {
        alert('There was an issue with account signup!', error)
      }

    } catch (error) {
      console.error(error)
    }

    setSignupData({
      last_name: '',
      first_name: '',
      email: '',
      password: '',
    });
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    setSignupData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  };
    return (
       <WebWrapper>
        <InnerContentWrapper>
          <H1>
            Become <span>A Member</span> Today!
          </H1>
          <ContentBox>
          <YellowBox />
          <ModelImg src={signupPic}/>
        
          <FormWrapper>
          <form onSubmit={handleSubmit} >
              <InnerFormWrapper>
                <InputDivs>
                  <Input
                    name="first_name"
                    type="text"
                    onChange={handleChange}
                    value={signupFormData.first_name}
                    placeholder="First Name"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="last_name"
                    type="text"
                    onChange={handleChange}
                    value={signupFormData.last_name}
                    placeholder="Last Name"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="email"
                    type="text"
                    onChange={handleChange}
                    value={signupFormData.email}
                    placeholder="Email"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={signupFormData.password}
                    placeholder="Password"
                  />
                </InputDivs>
                <Button>Login</Button>
              </InnerFormWrapper>
            </form>
          </FormWrapper>
          </ContentBox>
        </InnerContentWrapper>
        <SideBar />
       </WebWrapper>
    );
}

export default RegisterWeb;
