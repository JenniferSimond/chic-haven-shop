import styled from "styled-components"
import React, {useEffect} from "react";
import instagram from '../../assets/icons-svg/socialMedia/instagram.svg';
import instagramPink from '../../assets/icons-svg/socialMedia/instagramPink.svg';
import facebook from '../../assets/icons-svg/socialMedia/facebook.svg';
import facebookPink from '../../assets/icons-svg/socialMedia/facebookPink.svg'
import tiktok from '../../assets/icons-svg/socialMedia/tiktok.svg';
import tiktokPink from '../../assets/icons-svg/socialMedia/tiktokPink.svg'


const SideWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;
    background-color: rgba(var(--mustard), 1);
    right: 0;
    z-index: 90; 
    position: fixed;
    gap: 10%;

    height: calc(100vh - 7rem - 3rem);  

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem);  
    }
    
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
    align-items: center;
    border-radius: 3%;
    width: 80%;
    height: ${props => props.$height || '20%'};
    background-color: ${({ $backgroundColor }) => $backgroundColor || 'rgb(var(--cream))'};
     visibility: ${({$visibility}) => $visibility || 'collapse'};
`;

const FirstContainerText = styled.p`
    font-family: Cinzel;
    font-size: 28px;
    color: ${props => props.$color || 'rgb(var(--ras-pink))'};
    font-weight:${props => props.$fontWeight || '550'};
     letter-spacing: 0.34px;

    span {
        color: rgb(var(--cream));
    }

    @media (max-width: 1300px) {
        font-size: 25px;
    }

`;

const SecondContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 80%;
    height: ${props => props.$height || '12%'};
    border-radius: 3%;
    box-sizing: border-box;
    text-align: center;
    padding: 2% 4%;
    background-color: ${({ $backgroundColor }) => $backgroundColor || 'rgb(var(--cream))'};
    visibility: ${({$visibility}) => $visibility || 'hidden'};

    font-family: Montserrat, sans-serif;
    font-size: ${props => props.$fontSize || '15px'};
    font-weight: 600;
    color: ${({ $color }) => $color || 'rgb(var(--ras-pink))'};
    letter-spacing: 0.5px;
    margin-bottom: 0px;
    font-style: italic;

    @media(max-width: 1300px) {
        font-size: 15px;
    }
`;

const ThirdContainer = styled.div`
    display: ${({ $display }) => $display};
    flex-direction: column;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    align-content: center;
    background-color: ${({ $backgroundColor }) => $backgroundColor || 'rgb(var(--cream))'};
    width: 80%;
    height: ${props => props.$height || '20%'};
    border-radius: 3%;
    visibility: ${({$visibility}) => $visibility || 'visible'};
    padding: 2% 5%;
    font-family: Montserrat, sans-serif;
    font-size: ${props => props.$fontSize || '18px'};
    font-weight: 600;
    color: rgb(var(--purple-dark));
    letter-spacing: 0.5px;
`;

const ButtonContainer = styled.div`
   display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    gap: 20px;
     visibility: ${({$visibility}) => $visibility || 'collapse'};
`;

const SocialContainer = styled.div`
    display: ${({ $display }) => $display || 'none'};
     visibility: ${({$visibility}) => $visibility || 'collapse'};
     background-color: rgb(var(--mustard));
     width: 80%;
     height: 5%;
     justify-content: space-around;
     align-items: center;
`;

const Button = styled.button`
  display: ${({ $display }) => $display}
  width: 100px;
  height: 29px;
  background: rgb(var(--purple-dark));
  color: rgb(var(--cream));
  border-radius: 3px;
  border: none;
  font-weight: 500;
  letter-spacing: 0.95px;
   visibility: ${({$visibility}) => $visibility || 'collapse'};

   &:hover {
    background: rgb(var(--ras-pink));
    color: rgb(var(--purple-dark));
    font-weight: 600;
   }
`;

const SvgIcon = styled.img`
    max-height: ${props => props.$maxHeight || '25px'};
    max-width: ${props => props.$maxWidth || '25px'};
    height: ${props => props.$height ||'100%'};
    width: ${props => props.$width ||'100%'};

  &:hover {
    content: url(${props => props.$hoverIcon2})

    }

    @media (max-width: 1300px) {
        margin: 0% 0%;
        max-height: 22px;
        max-width: 22px;
    }
    


    `;

    const P = styled.p`
    font-family: Montserrat, sans-serif;
    font-size: ${props => props.$fontSize || '14px'};
    font-weight: 600;
    color: rgb(var(--purple-mid));
    letter-spacing: 0.5px;
    margin-bottom: 2px;
    `

const SideBar = ({ sidebarConfig={}, topHandleFunction, bottomHandleFunction }) => {
    const {
        firstContainer = {},
        secondContainer = {},
        thirdContainer = {},
        buttonContainer = {},
        socialContainer = {},
    } = sidebarConfig;

    const topButtonHandler = () => {
        topHandleFunction();
    };
    
    const bottomButtonHandler = () => {
        bottomHandleFunction();
    };

 
    

    return (
        <SideWrapper>
        <FirstContainer 
            $visibility={firstContainer.visibility ||'collapse'}
            $backgroundColor={firstContainer.backgroundColor || 'rgb(var(--cream))'}
            $height={firstContainer.height || '20%'}
        >
           <FirstContainerText>
            Your Little
           </FirstContainerText>
           <FirstContainerText>
            <span>Piece of</span>
           </FirstContainerText>
           <FirstContainerText>
            of Haven
           </FirstContainerText>
        </FirstContainer>
        <SecondContainer 
           $visibility={secondContainer.visibility || 'collapse'} $backgroundColor={secondContainer.backgroundColor || 'rgb(var(--cream))'} $height={secondContainer.height}
        >
            {secondContainer.text || ''}
        </SecondContainer>
        <ThirdContainer $visibility={thirdContainer.visibility || 'collapse'} $height={thirdContainer.height}>
            {thirdContainer.text || ''}
        </ThirdContainer>
        <ButtonContainer >
            
            <Button $visibility={buttonContainer.bottomVisibility || 'collapse'} onClick={bottomButtonHandler} >
                {buttonContainer.bottomButtonText || ''}
            </Button>
        </ButtonContainer>
        <SocialContainer $display={socialContainer.$display} $visibility={socialContainer.visibility || 'hidden'}>
            <SvgIcon src={instagram} $hoverIcon2={instagramPink}/>
            <SvgIcon src={facebook}$hoverIcon2={facebookPink}/>
            <SvgIcon src={tiktok} $hoverIcon2={tiktokPink}/>
        </SocialContainer>
   </SideWrapper>
    );
};  
export default SideBar;
