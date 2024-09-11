import React, { useContext, useState, useEffect} from 'react';
import { Route, Routes, useInRouterContext } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './components/mainSite/LandingPage';
import NavBar from './components/menuBars/navBar/NavBar'
import Footer from './components/menuBars/Footer';
import Login from './components/customer/Login';
import Register from './components/mainSite/Register';
import Account from './components/customer/AccountPage';
import About from './components/mainSite/About';
import Wishlist from './components/customer/Wishlist';
import Products from './components/products/Products';
import ProductView from './components/products/ProductView'
import Cart from './components/customer/Cart';
import MobileTabBar from './components/menuBars/MobileTabBar';

import { CustomerContext, CustomerProvider } from './CustomerContext';




const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 100%;
  overflow-y: hidden;

`;

const NavWrapper = styled.div`
    width: 100%;
    top: 0;
    z-index: 100; 
    position: fixed;
`;
const ContentWindow = styled.div`
  flex-grow: 1;
  padding-top: 7rem;
  padding-bottom: 5rem;
  overflow-y auto;

   @media (max-width: 768px) {
        padding-top: 5rem;
        pdding-bottom: 3rem;
  }

  @media (max-width: 500px) {
        padding-top: 4rem;
        pdding-bottom: 3rem;
  }
`;

const FootWrapper = styled.div`
    width: 100%;
    bottom: 0;
    z-index: 100; 
    position: fixed;

`;

function App() {

    const { customerData } = useContext(CustomerContext);
    useEffect(() => {
      console.log('Customer Data updated:', customerData);
    }, [customerData]);

  return (
  <AppWrapper>
        <CustomerProvider>
    <NavWrapper>
    <NavBar />
    </NavWrapper>
      <ContentWindow>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/Home' element={<LandingPage />} />
          <Route path='/Products' element={<Products />} />
          <Route path='/Products/:ProductId' element={ProductView}/>
          <Route path='/about' element={<About />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Register />}/>
          <Route path='/account' element={<Account />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/wishlist' element={<Wishlist />}/>
        </Routes>
      </ContentWindow>
      <FootWrapper>
      <Footer />
      <MobileTabBar />
      </FootWrapper>
        </CustomerProvider>
  </AppWrapper>
  
  
  );
}

export default App
