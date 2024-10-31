import React, {useContext} from "react"
import {useNavigate} from 'react-router-dom'
import styled from "styled-components"
import account from '../../../assets/icons-svg/account/account.svg'
import accountLight from '../../../assets/icons-svg/account/accountLight.svg'
import logo2Light from '../../../assets/icons-svg/logo/logo2Light.svg'
import cart from '../../../assets/icons-svg/cart/cart.svg'
import cartLight from '../../../assets/icons-svg/cart/cartLight.svg'
import SearchBar from './SearchBar'
import NavLinks from './NavLinks'
import { getToken, removeToken } from '../../shared/auth'
import { CustomerContext } from "../../../CustomerContext.jsx"

const Header = styled.header`
    display: flex;
    align-items: center;
    background-color: rgba(var(--purple-light), 1);
    height: 7rem;
    transition: all 0.5s ease;
    @media (max-width: 768px) {
        height: 5rem;
  }
    @media (max-width: 600px) {
        height: 5rem;
  }
 `;

const DesktopBar = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    // margin: 0% 2%;
`;


const NavbarLeft = styled.div`
   margin-left: 3%;
`;

const NavbarCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    flex-direction: column;
    height: 70px;
    gap: 10%;
   // background-color: red;

    @media (600px) {
    height: 80px;
    justify-content: center;
    gap: 0%;
    }

    @media (max-width: 768px) {
        gap: 8%;
    }
`;

const NavbarRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    gap: 5px;
    min-width: 85px;
    margin-right: 3%;
    transition: all 0.5s ease;
    @media (max-width: 768px ) {
         min-width: 70px;
    }

  @media (max-width: 500px) {
        display: none;
  }

 
 `;

 const NavBarRightMobile = styled.div`
 margin-right: 3%;
 transition: all 0.5s ease;
    @media (min-width: 501px) {
        display: none;
        
  }
 `;

const Logo = styled.img`
   
    width: 154px;
    height: 49.63px;
    cursor: pointer;
    // margin-left: 10%;
    
     @media (max-width: 768px) {
        width: 100px;
        height: auto;
  }

    @media (max-width: 500px) {
        width: 90px;
        height: auto;
  }

  @media (max-width: 374px) {
        width: 78px;
        height: auto;
        
  }

`;


const IconContainer = styled.div`
  
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
`;

const Account = styled.img`
    width: 33px;
    height: auto;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    content: url(${props => props.$hoverIcon})
}
     @media (max-width: 768px) {
        width: 30px;
        height: auto; 

}

     @media (max-width: 500px) {
        width: 27px;
        height: auto; 

}

`;

const Cart = styled.img`
    width: 38px;
    height: auto;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    content: url(${props => props.$hoverIcon})
}
    @media (max-width: 768px) {
        width: 30px;
        height: auto; 

}
`;

const LogInOut = styled.button` 
    background-color: rgba(var(--purple-mid), 1);
    border: none;
    border-radius: 3px;
    padding: 6px 10px;
    color: rgba(var(--cream), 1);
    font-family:  Cinzel;
    font-weight: 500;
    cursor: pointer;
     &:hover {
      background-color: rgba(var(--purple-deep), 1);
      
     }
`;

const NavBar = () => {
    const {setCustomerData} = useContext(CustomerContext);
    const token = getToken()
    const { customerData } = useContext(CustomerContext);

    const customerId = customerData.id;
    
    const navigate = useNavigate();

    const logoClickHandler = () => {
        navigate('/home')
    }

    const accountClickHandler = () => {
        navigate('/account')
    }

    const cartClickHandler = () => {
        navigate('/cart')
    }

    const loginClickHandler = () => {
        navigate('/login')
    }

    const logoutClickHandler = () => {
        removeToken()
        setCustomerData({})
        navigate('/home')
    }

    return(
       <Header>
        <DesktopBar>
        <NavbarLeft>
            <Logo src={logo2Light} onClick={logoClickHandler}/>
        </NavbarLeft>
        <NavbarCenter>
            <SearchBar />
            <NavLinks />
        </NavbarCenter>
        <NavbarRight>
            <IconContainer>
                <Account  src={account} alt='Account' $hoverIcon={accountLight} onClick={accountClickHandler}/>
                <Cart src={cart} alt='Cart' $hoverIcon={cartLight} onClick={cartClickHandler}/>
            </IconContainer>
            {token && customerId ? <LogInOut onClick={logoutClickHandler}>Logout</LogInOut> : <LogInOut onClick={loginClickHandler} >Login</LogInOut>}
        </NavbarRight>

        <NavBarRightMobile>
        <Account  src={account} alt='Account' $hoverIcon={accountLight} onClick={accountClickHandler}/>
        </NavBarRightMobile>
     
        </DesktopBar>
       </Header>
    )
}

export default NavBar