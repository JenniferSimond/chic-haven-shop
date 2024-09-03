import React, { useState} from 'react';
import styled from 'styled-components';
import loginModImg from '../../../assets/img-png/loginModImg.png';
import signupPic from '../../../assets/img-png/signupPic.png';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../shared/auth';
import { customerSignup } from '../../../api/customers';


const MobileWrapper = styled.div`
display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;
width: 100%;
height: 90%;
justify-content: center;
transition: all 0.3s ease;
margin-top: 50px;
`;

const ModelBox = styled.div`
    // border: 4px solid rgb(var(--ras-pink));
    height: 290px;
    width: 290px;
    margin-top: 60px;
    background-color: rgb(var(--mustard));
    position: relative;

    @media (max-width: 375px) {
    margin-top: 15%;
   }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items vertically */
  align-content: center;
  width: 50%;
  margin-top: 2%;

  @media (max-width: 375px) {
    margin-top: 2%;
   }
`;

const ModelImg = styled.img`
display: block;
  width: auto;
  height: auto;
  max-width: 90%;
  position: absolute;
  top: 46%;
  left: 7%;
  transform: translate(-1.5%, -53.9%);
`

const InnerFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputDivs = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 0px 12px 0px;
  border-radius: 3px;
`;

const Input = styled.input`
  max-width: 313.965px;
  width: 190px;
  height: 20px;
  border: none;
  border-radius: 3px;
  background-color: rgb(var(--ras-pink));
  outline: none;
  color: #f9f5e3;
  font-family: Montserrat;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.361px;
  text-align: center;

  transition: all 0.3s ease;
  

  &::placeholder {
    color: #f9f5e3;
    opacity: 0.8;
  }

   @media (max-width: 375px) {
    width: 165px;
   }

`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background-color: #4a4e69;
  color: rgb(var(--mustard));
  font-family: Montserrat;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.263px;
  text-transform: capitalize;
  margin-top: 2%;
    


  &:hover {
    background-color: #FFBC42;
    color: #D81159;
    font-size: 15px;
  }
`;

const H1 = styled.h1`
  color: #ffbc42;
  font-family: Cinzel;
  font-size: 38.67px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 4.38px;
  text-align: start;
  text-transform: uppercase;
  transition: all 0.3s ease;

  span {
    color: rgb(var(--purple-mid));
  }
 
  @media (max-width: 425px) {
    font-size: 30px;
    }

    @media (max-width: 385px) {
    font-size: 25px;
    }

    @media (max-width:323px) {
      font-size: 20px
    }
`;

const P1 = styled.p`
  color: #d81159;
  font-family: Cinzel;
  font-size: 40px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
//   padding-left: 3.2%;
  margin-top: 2%;
  text-transform: uppercase;
  transition: all 0.3s ease;

  @media (max-width: 375px) {
    font-size: 40px;
    }

`;



const RegisterMobile = () => {
  
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

      if (data) {
        setToken(data.token);
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
        <MobileWrapper>
            <H1>
            Become A <span>Member</span>
          </H1>
            <ModelBox>
                <ModelImg src={signupPic}/>
            </ModelBox>
            <P1>today!</P1>
          <FormWrapper>
          <form >
              <InnerFormWrapper>
                <InputDivs>
                  <Input
                    name="first_name"
                    type="text"
                    // onChange={handleChange}
                    // value={loginFormData.email}
                    placeholder="First Name"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="last_name"
                    type="text"
                    // onChange={handleChange}
                    // value={loginFormData.email}
                    placeholder="Last Name"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="email"
                    type="text"
                    // onChange={handleChange}
                    // value={loginFormData.email}
                    placeholder="Email"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="password"
                    type="password"
                    // onChange={handleChange}
                    // value={loginFormData.password}
                    placeholder="Password"
                  />
                </InputDivs>
                <Button>Login</Button>
              </InnerFormWrapper>
            </form>
           
          </FormWrapper>
        </MobileWrapper>
    );
}

export default RegisterMobile