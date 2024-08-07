


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import home from '../../assets/icons-svg/tab-bar/home.svg';
import basket from '../../assets/icons-svg/tab-bar/basket.svg';
import wish from '../../assets/icons-svg/tab-bar/wish.svg';
import shop from '../../assets/icons-svg/tab-bar/shop.svg';

const SvgIcon = styled.img`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    cursor: pointer;
`;

const TabBarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(var(--purple-deep), 1);
    width: 100%;
    min-height: 7rem;
    
    @media (min-width: 501px) {
        display: none;
    }
`;

const InnerWrapper = styled.div`
    display: flex;
    flex-direction: row;  
    justify-content: space-between; 
    width: 100%; 
    height: 100%;
    margin: 0% 4%;
`;

const SvgBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 70px;
    min-height: 55px;
    // background-color: red;

    p {
        text-align: center;
        font-size: 0.75rem;
        font-family: Montserrat;
        font-weight: 500;
        letter-spacing: 0.09rem;
        color: rgba(var(--cream), 0.9);
        margin-top: 5px;
    }
`;

const MobileTabBar = () => {
    const navigate = useNavigate();

    return (
        <TabBarWrapper>
            <InnerWrapper>
                <SvgBox>
                    <SvgIcon
                        width={'35px'}
                        height={'auto'}
                        src={home}
                        alt="Home"
                        onClick={() => navigate('/home')}
                    />
                    <p>Home</p>
                </SvgBox>
                <SvgBox>
                    <SvgIcon
                        width={'28px'}
                        height={'auto'}
                        src={shop}
                        alt="Shop"
                        onClick={() => navigate('/products')}
                    />
                    <p>Shop</p>
                </SvgBox>
                <SvgBox>
                    <SvgIcon
                        width={'35px'}
                        height={'auto'}
                        src={wish}
                        alt="Wishlist"
                        onClick={() => navigate('/wishlist')}
                    />
                    <p>Wishlist</p>
                </SvgBox>
                <SvgBox>
                    <SvgIcon
                        width={'39px'}
                        height={'auto'}
                        src={basket}
                        alt="Cart"
                        onClick={() => navigate('/cart')}
                    />
                    <p>Basket</p>
                </SvgBox>
            </InnerWrapper>
        </TabBarWrapper>
    );
}

export default MobileTabBar;
