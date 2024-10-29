

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../menuBars/SideBar";
import product1 from '../../assets/img-png/product1.png';
import product2 from '../../assets/img-png/product2.png';
import product3 from '../../assets/img-png/product3.png';
import newCollection from '../../assets/img-png/newCollection.png';
import homeHero from '../../assets/img-png/homeHero.png';
import PromoSidebar from "../menuBars/PromoSidebar";


const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 7rem - 3rem);  // For larger screens: subtract NavBar and Footer heights

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  // For tablets: adjust for smaller NavBar height
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem);  // For mobile: subtract NavBar and MobileTabBar only (no Footer)
    }
`;


const InnerContentWrapper = styled.div`
    box-sizing: border-box;
    flex-grow: 1;
    max-width: 1400px;
    height: 90%;
    justify-content: center;
    display: flex;
    flex-direction: column;
    // padding: 0% 4% 0% 4%;
    margin-right: 250px; // Ensuring space for the sidebar

    @media (max-width: 1300px) {
        margin-right: 200px; // Adjust margin for smaller sidebar
    }

    @media (max-width: 950px) {
        justify-content: center;
        margin-right: 0px; // No sidebar on smaller screens
        padding: 2% 1% 0% 1%; // Adjust padding for smaller screens
       
    }
`;

const HeroWrapper = styled.div`
    display: grid;
    box-sizing: border-box;
    margin: 0 5% 3% 5%;
    grid-template-columns: 40% 61%; // Two equal columns for web layout
    column-gap: 6%;
    grid-template-areas: "image text";  // Order for larger screens
    @media (max-width: 1300px) {
          margin: 0 5% 6% 5%;
    }
    
    @media (max-width: 950px) {
        grid-template-columns: 1fr; // Single column for mobile layout
        grid-template-rows: auto auto;
        grid-template-areas: 
            "text" 
            "image";  // Text above the image on mobile
        margin: 0% 0% 3% 0%;
        gap: 20px; // Add space between image and text
          justify-items: center;
    }

     @media (max-width: 768px) {
          margin: 4% 0% 4% 0%;
    }
    
`;

const HeroImage = styled.img`
  grid-area: image; // Position in the grid
  width: 100%;
  max-width: 495px;
  min-width: 260px;
  height: auto;
  border-radius: 3px;

  @media (max-width: 950px) {
    max-width: 350px;
    margin-right: 0; 
    justify-self: center; 
  }

  @media (max-width: 768px) {
       max-width: 300px;
     
    margin-right: 0; 
  }

   @media (max-width: 359px) {
       max-width: 260px;
     
  }

`;

const HeroTextWrapper = styled.div`
    max-width: 560px;
    grid-area: text; // Position in the grid
    display: flex;
    flex-direction: column;
    justify-content: center;
    // background-color: blue;

    @media (max-width: 1368px) {
        max-width: 500px;
    }

    @media (max-width: 950px) {
    max-width: 660px;
        padding-bottom: 20px;
    }
`;


const P1 = styled.p`
    color: #22223B;
    text-align: start;
    font-family: Cinzel;
    font-size: 56px;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.34px;
    padding-left: 1px;

    span {
        color: #FFBC42;
    }

    @media (max-width: 1505px) {
        font-size: 50px;
    }

    @media (max-width: 1244px) {
        font-size: 45px;
    }
    @media (max-width: 1148px) {
        font-size: 40px;
    }
    @media (max-width: 1052px) {
        font-size: 34px;
    }

    @media (max-width: 950px) {
        text-align: center;
        font-size: 55px;
    }
    @media (max-width: 543px) {
        text-align: center;
        font-size: 50px;
    }


    @media (max-width: 486px) {
        text-align: center;
        font-size: 45px;
    }



    @media (max-width: 438px) {
   
        font-size: 42px;
    }
    @media (max-width: 409px) {
   
        font-size: 40px;
    }
    @media (max-width: 391px) {
   
        font-size: 35px;
    }

    
`;

const P2 = styled.p`
    color: #D81159;
    font-size: 43px;
    font-weight: 400;
    text-align: start;
    line-height: .9;
    padding-top: 2px;
    padding-left: 1px;
    text-transform: uppercase;

     @media (max-width: 1505px) {
        font-size: 40px;
    }

    @media (max-width: 1357px) {
        font-size: 35px;
    }
    @media (max-width: 1194px) {
        font-size: 30px;
    }
    @media (max-width: 1148px) {
        font-size: 25px;
    }

    @media (max-width: 950px) {
    text-align: center;
        font-size: 40px; // Adjust text size for mobile
    }

     @media (max-width: 543px) {
        text-align: center;
        font-size: 27px;
    }


    @media (max-width: 486px) {
        text-align: center;
        font-size: 25px;
    }

`;

const P3 = styled.p`
    color: #4A4E69;
    font-size: 18px;
    font-style: italic;
    font-weight: 500;
    line-height: 25px;
    letter-spacing: 1px;
    padding-top: 20px;
    padding-left: 5px;
    margin-right: 60px;
    font-family: Montserrat, sans-serif;
   
    span {
        color: #D81159;
    }

    @media (max-width: 1148px) {
        font-size: 14px;
        line-height: 20px;
    }

    @media (max-width: 950px) {
        display: none;
    }
`;

// Promo box for mobile


const PromoBox2 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 5px;
`;

const PromoText = styled.p`
    font-size: 20px;
    font-weight: 600;
    color: #22223B;

    @media (min-width: 951px) {
      display: none;
    }

     @media (max-width: 543px) {
        text-align: center;
        font-size: 18px;
    }


    @media (max-width: 486px) {
        text-align: center;
        font-size: 16px;
    }
`;


const PromoCode = styled.p`
    color: #D81159;
    font-size: 15px;
    font-weight: 600;

    span {
    color: #4B908B;
    font-weight: 700;
    text-transform: capitalize;
    }
   
    @media (min-width: 951px) {
      display: none;
    }

     @media (max-width: 543px) {
        text-align: center;
        font-size: 12px;
    }


    @media (max-width: 486px) {
        text-align: center;
        font-size: 10px;
    }
`;
const HeroButton = styled.button`
    width: 100px;
    height: 29px;
    background: #FFBC42;
    border-radius: 3px;
    border: none;
    margin-top: 20px;

    p {
        color: #22223B;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0.32px;

        @media (max-width: 1244px) {
            font-size: 10px;
        }
    }

     @media (max-width: 1244px) {
        width: 80px;
        height: 25px;

      
        
    }
    @media (max-width: 950px) {
        display: none;
    }

`;

const ProductWrapper = styled.div`
    max-width: 1300px;
    display: inline-grid;
    grid-template-columns: 25% 25% 25% 25%;
    margin: 0% 5% 0% 5%;

     @media (max-width: 950) {
     justify-content: center;
    

        margin: 0% 0% 0% 0%;
     }

     @media (max-width: 596px) {
     
       grid-column-gap: 0px;
      margin: 0% 0% 0% 5%;
     }
     
`;

const Product = styled.div`
    box-sizing: border-box;
    text-align: center;
    max-width: 300px;
    min-width: 95px;
    padding: 0;
    margin-right: 40%;
    border-radius: 3px;

    @media (max-width: 950) {
        max-width: 190px;
         margin-right: 0%;
    }

`;

const ProductImage = styled.img`
   width: 100%;
    border-radius: 3px;

    @media (max-width: 950px) {
        max-width: 100%; // Adjust product image size for mobile
    }
`;

const ProductText = styled.p`
    color: ${props => props.$highlight ? '#D81159' : '#4A4E69'};
    font-size: 15px;
    font-weight: 550;
    text-align: center;

     @media (max-width: 1180px) {
       font-size: 13px;
    }

    @media (max-width: 1055px) {
       font-size: 12px;
    }
    @media (max-width: 980px) {
       font-size: 11px;
    }
    @media (max-width: 465px) {
       font-size: 10px;
       font-weight: 600;
    }
`;

const MobileSignUpDiv = styled.div`
    display: none;
    text-align: center;
    color: rgb(var(--purple-mid));
    font-size: 15px;
    font-style: italic;
    font-weight: 500;
    letter-spacing: 0.326px;
    margin-top: 30px;

    &:hover { 
      color: rgb(var(--purple-dark));
      font-weight: 600;
    }

    span {
    font-weight: 600;
     color: rgb(var(--ras-pink));
    }

    @media (max-width: 950px) {
        display: block;
    }

    
`;

const LandingPage = () => {
    const navigate = useNavigate();
    const homePageProducts = [
        { id: 1, image: product1, text: 'Hot Pick!', highlight: 'true' },
        { id: 2, image: product2, text: 'Back In Stock!', highlight: 'false' },
        { id: 3, image: product3, text: 'Top Seller', highlight: 'true' },
        { id: 4, image: newCollection, text: 'New Collection!', highlight: 'false' }
    ];

    const sidebarConfig = {
        firstContainer: {
          display: 'none',
          backgroundColor: 'rgb(var(--mustard))',
          text: '',
        },
        secondContainer: {
          display: 'none',
          backgroundColor: 'rgb(var(--mustard))',
          text: '',
        },
        thirdContainer: {
          display: 'none',
          backgroundColor: 'rgb(var(--mustard))',
          text: '',
        },
        buttonContainer: {
          display: 'none',
          backgroundColor: 'rgb(var(--mustard))',
          leftText: '',
          rightText: '',
          buttonColor: '',
  
        },
        socialContainer: {
          display: 'none',
        }
      }

    const handleClick = () => {
        navigate('/sign-up')
    }

    return (
        <OuterWrapper>
            <PromoSidebar />
            <InnerContentWrapper>
                <HeroWrapper>
                    <HeroImage src={homeHero} alt="Hero" />
                    <PromoBox2>
                        <PromoText>
                            Save on Summer Dresses!
                        </PromoText>
                        <PromoCode>
                        Code: <span>SUMMERBREEZE</span>
                        </PromoCode>
                    </PromoBox2>
                    <HeroTextWrapper>
                        <P1>EVERY <span>CHIC</span> GIRL</P1>
                        <P2>NEEDS A HAVEN</P2>
                        <P3>
                            Become a member, earn points with every purchase, and enjoy <span>15%</span> off your first order!
                        </P3>
                        <HeroButton onClick={handleClick}>Register</HeroButton>
                    </HeroTextWrapper>
                </HeroWrapper>
                <ProductWrapper>
                    {homePageProducts.map((product) => (
                        <Product key={product.id}>
                            <ProductImage src={product.image} alt={product.text} />
                            <ProductText $highlight={product.highlight}>{product.text}</ProductText>
                        </Product>
                    ))}
                </ProductWrapper>
                <MobileSignUpDiv>
                    <p onClick={handleClick}>Not a member yet, <span>sign up</span> today!</p>
                </MobileSignUpDiv>
            </InnerContentWrapper>
        </OuterWrapper>
    );
}

export default LandingPage;
