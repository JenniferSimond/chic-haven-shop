import styled from "styled-components"
import React from "react";
import { useNavigate, Link } from "react-router-dom";

import instagram from '../../assets/icons-svg/socialMedia/instagram.svg';
import instagramPink from '../../assets/icons-svg/socialMedia/instagramPink.svg';
import facebook from '../../assets/icons-svg/socialMedia/facebook.svg';
import facebookPink from '../../assets/icons-svg/socialMedia/facebookPink.svg'
import tiktok from '../../assets/icons-svg/socialMedia/tiktok.svg';
import tiktokPink from '../../assets/icons-svg/socialMedia/tiktokPink.svg';
import sidebarImg from '../../assets/img-png/sidebarImg.png';


const SideWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 4%;
    align-items: center;
    width: 250px;
    background-color: rgba(var(--mustard), 1);
    right: 0;
    z-index: 90; 
    position: fixed;
    gap: 6%;
    height: 100vh;

    @media (max-width: 950px) {
        display: none;
    }
    @media (max-width: 1300px) {
        width: 200px;
    }
`;

const FirstContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    border-radius: 3%;
    width: 80%;
    height: 20%;
    padding: 5%;
    gap: 20px;
    box-sizing: border-box;
    background-color: rgb(var(--cream));
`;

const MainPromoText = styled.p`
    font-family: Montserrat, sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: rgb(var(--purple-mid));
    letter-spacing: 0.5px;
    margin-bottom: 2px;
    text-align: start;
    line-height: 25px; 

    @media (max-width: 1300px) {
        font-size: 15px;
         line-height: 20px; 
    }
`;

const PromoCode = styled.p`
    color: #D81159;
    font-size: 15px;
    font-weight: 600;
    text-align: start;

    span {
        color: #4B908B;
        font-weight: 700;
        text-transform: capitalize;
    }

     @media (max-width: 1300px) {
        font-size: 12px;
    }
`;

const SecondContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 80%;
    height: 10%;
    border-radius: 3%;
    text-align: center;
    box-sizing: border-box;
    padding: 2% 5%;
    background-color: rgb(var(--mustard));
`;

const SecondContainerText = styled.p`
    font-family: Cinzel;
    font-size: 28px;
    color: ${props => props.$color || 'rgb(var(--ras-pink))'};
    font-weight:${props => props.$fontWeight || '600'};
     letter-spacing: 0.34px;

    span {
        color: rgb(var(--cream));
    }

    @media (max-width: 1300px) {
        font-size: 25px;
    }

`;



const ThirdContainer = styled.div`
    width: 80%;
    height: 20%;
    background-image: url(${props => props.$imageUrl});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 3px;
`;



const SocialContainer = styled.div`
    display: flex;
    background-color: rgb(var(--mustard));
    width: 80%;
    height: 5%;
    justify-content: space-around;
    align-items: center;
`;

const SvgIcon = styled.img`
    max-height: 25px;
    max-width: 25px;
    height: 100%;
    width: 100%;

    &:hover {
        content: url(${props => props.$hoverIcon});
    }

    @media (max-width: 1300px) {
        max-height: 22px;
        max-width: 22px;
    }
`;

const PromoSidebar = () => {
    const navigate = useNavigate()
    return (
        <SideWrapper>
            <FirstContainer>
                <MainPromoText>Save on Summer Dresses!</MainPromoText>
                <PromoCode>
                    Code: <span>SUMMERBREEZE</span>
                </PromoCode>
            </FirstContainer>
            <SecondContainer>
                <SecondContainerText>
                    Join <span>The</span>
                </SecondContainerText>
                <SecondContainerText $fontWeight={'400'} $color={'rgb(var(--purple-dark))'}>
                  Movement
                </SecondContainerText>
            </SecondContainer>
            <ThirdContainer $imageUrl={sidebarImg} />
            <SocialContainer>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <SvgIcon src={instagram} $hoverIcon={instagramPink} />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <SvgIcon src={facebook} $hoverIcon={facebookPink} />
                </a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                    <SvgIcon src={tiktok} $hoverIcon={tiktokPink} />
                </a>
            </SocialContainer>
        </SideWrapper>
    );
};  
export default PromoSidebar;
