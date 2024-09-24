
import React, {useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import windowResize from '../shared/hooks/windowResize';
import { customerLogin } from '../../api/customers.js';
import { setToken } from '../shared/auth.js';
import SideBar from '../menuBars/SideBar.jsx';
import loginModImg from '../../assets/img-png/loginModImg.png';
import { CustomerContext } from '../../CustomerContext.jsx';

const WebLoginWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 80vh; 
    position: relative; // position children relative to the wrapper div

`;

const WebViewInnerWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10%;
    margin-top: 3%;
    // background-color: red;
    justify-content: center;
    transition: all 0.3s ease;

    @media (max-width: 1400px ) {
      padding-left: 8%;
    }
    
    @media (max-width: 1300px) {
    padding-left: 4.5%;
    }

    @media (max-width: 1050px) {
    padding-left: 4.5%;
  }
`;
// web only
const WebContentBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 900px;
  height: 400px;
  border: 3px solid rgb(var(--ras-pink));
  align-items: center;
  position: relative;
  margin-top: 70px;
  margin-left: 1.4%;
  transition: all 0.5s ease;

  @media (max-width: 1300px) {
    width: 750px;
    height: 350px;
    margin-top: 58px;
  }

  @media (max-width: 1050px) {
    width: 650px;
    height: 300px;
     margin-top: 55px;
    }  
      
`;

const WebYellowBox = styled.div`
  width: 50%;
  height: 100%;
  background-color: rgb(var(--mustard));
`;

// mobile only

const MobileLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;   
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 83vh;
  // margin-top: 3%;
  // background-color: pink;

  @media (max-width: 768px) {
    // margin-top: 10%;
  }
  @media (max-width: 500px) {
    // margin-top: 8%;
  }
  @media (max-width: 375px) {
    // margin-top: 15%;
  }
`
const MobileModelBox = styled.div`
    height: 290px;
    width: 290px;
    margin-top: 65px;
    background-color: rgb(var(--mustard));
    position: relative;

    @media (max-width: 375px) {
    margin-top: 15%;
`;

const ModelImg = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: 40%;
  position: absolute;
  top: 45%;
  left: 15%;
  transition: all 0.5s ease;

  transform: translate(-25%, -55.9%);

  @media (max-width: 1300px) {
    transform: translate(-25%, -53.7%);
  }

  @media (max-width: 1050px) {
    transform: translate(-25%, -54.2%);
  }

  @media (max-width: 950px) {
    min-width: 85%;
    position: absolute;
    top: 46%;
    left: 10%;
    transform: translate(-1.5%, -54.2%);
  }

`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items vertically */
  align-content: center;
  width: 50%;

 @media (min-width: 950) {
 margin-top: 20px;

 }
`;

const InnerFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;

   @media (max-width: 950px) {
 
  margin-top: 0px;
 }
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

  transition: all 0.2s ease;
  

  &::placeholder {
    color: #f9f5e3;
    opacity: 0.8;
  }

  @media (max-width: 1300px) {
    width: 210px;
  }

  @media (max-width: 1050px) {
    width: 170px;
  }

  @media (max-width: 950px) {
    max-width: 313.965px;
    width: 170px;
    height: 26px;
    font-size: 12px;
    
  }

  @media (max-width: 375px) {
    width: 165px;
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
  font-size: 85px;
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
 

  @media (max-width: 1300px) {
    font-size: 69px;
    }

  @media (max-width: 1050px) {
    font-size: 59px;
  }

  @media (max-width: 950px) {
    font-size: 38.67px;
  }
  @media (max-width: 560px) {
    font-size: 37px;
  }

  @media (max-width: 375px) {
    font-size: 30px;
    }
`;

const P1 = styled.p`
  color: #d81159;
  font-family: Cinzel;
  font-size: 70px;
  font-style: normal;
  font-weight: 200;
  line-height: normal;
  padding-left: 3.2%;
  margin-top: 30px;
  text-transform: uppercase;
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    text-align: center;
  }

  @media (max-width: 1300px) {
    font-size: 55px;
    padding-left: 3.5%;
    margin-top: 30px;
    }

    @media (max-width: 1050px) {
        font-size: 48px;
        padding-left: 3.5%;
        margin-top: 25px;
  }

  @media (max-width: 950px) {
    font-size: 40px;
     padding-left: 0%;
       margin-top: 15px;
       margin-bottom: 20px;
  }

  @media (max-width: 375px) {
    font-size: 35px;
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
  top: 93.6%;
  left: 66.5%;
  transform: translate(-23%, -75%);
  transition: all 0.5s ease;

    &:hover { 
      color: rgb(var(--purple-dark));
      font-weight: 600;
    }

    span {
    font-weight: 600;
     color: rgb(var(--ras-pink));
    }

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

    @media (max-width: 950px) {
    margin-top: 5%;
    text-align: center;
    position: static;
    transform: none;
  }


`;


const Login = () => {
  const navigate = useNavigate();
  const { width } = windowResize();
  const {customerData, setCustomerData} = useContext(CustomerContext);
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const data = await customerLogin(loginFormData);
      console.log('User Data (API) >>-->', data);
  
      if (data && data.token) {
        setToken(data.token);
        setCustomerData(data.userDetails)
        navigate('/account');
      } else {
        // If data doesn't contain a token but has a message, we handle it here.
        if (data.message === 'Account Not Found') {
          alert('Email address not found!');
        } else if (data.message === 'Invalid Password') {
          alert('Invalid password!');
        } else {
          alert('An error occurred during login, try again!');
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  
    setLoginFormData({
      email: '',
      password: ''
    });
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClick = () => {
    navigate('/signup');
    
  }



  return (
    <>
    {width <= 950 ? (
      <MobileLoginWrapper>
        <H1>
            Welcome <span>Back</span>
          </H1>
            <MobileModelBox>
                <ModelImg src={loginModImg}/>
            </MobileModelBox>
            <P1>Gorgeous</P1>
          <FormWrapper>
          <form onSubmit={handleSubmit} >
              <InnerFormWrapper>
                <InputDivs>
                  <Input
                    name="email"
                    type="text"
                    onChange={handleChange}
                    value={loginFormData.email}
                    placeholder="Email"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={loginFormData.password}
                    placeholder="Password"
                  />
                </InputDivs>
                <Button>Login</Button>
              </InnerFormWrapper>
            </form>
           
          </FormWrapper>
          <P2 onClick={handleClick}>Not a Member Yet, <span>Sign Up</span> Today!</P2>
      </MobileLoginWrapper>
    ):(
      <WebLoginWrapper>
        <WebViewInnerWrapper>
          <H1>
            Welcome <span>Back</span>
          </H1>
          <WebContentBox>
          <WebYellowBox />
          <ModelImg src={loginModImg}/>
        
          <FormWrapper>
          <form onSubmit={handleSubmit}>
              <InnerFormWrapper>
                <InputDivs>
                  <Input
                    name="email"
                    type="text"
                    onChange={handleChange}
                    value={loginFormData.email}
                    placeholder="Email"
                  />
                </InputDivs>
                <InputDivs>
                  <Input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={loginFormData.password}
                    placeholder="Password"
                  />
                </InputDivs>
                <Button>Login</Button>
              </InnerFormWrapper>
            </form>
            <P2 onClick={handleClick}>Not a Member Yet, Sign Up Today!</P2>
          </FormWrapper>
          </WebContentBox>
        <P1>Gorgeous</P1>
        </WebViewInnerWrapper>
        <SideBar />
       </WebLoginWrapper>
    )}
    
    </>
  )
}
export default Login;
