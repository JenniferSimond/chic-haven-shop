import styled from "styled-components";
import owner from '../../assets/img-png/owner.png';

const OuterWrapper = styled.div`


    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: calc(100vh - 7rem - 3rem);  // For larger screens: subtract NavBar and Footer heights

    @media (max-width: 768px) {
        height: calc(100vh - 5rem - 3rem);  // For tablets: adjust for smaller NavBar height
    }

    @media (max-width: 600px) {
        height: calc(100vh - 4rem - 7rem);  // For mobile: subtract NavBar and MobileTabBar only (no Footer)
    }

`;

const ContentBox = styled.div`
  display-flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  max-width: 750px;
  width: 70%;
  height: 100%;
  margin-bottom: 2%;
  // border: 5px solid rgb(var(--purple-light));
  border-radius: 3px;
  overflow-y: clip;


  @media (max-width: 950px) {
    width: 70%;
  }
  @media (max-width: 750px) {
    width: 90%;
    height: 80%;
 
  }
`;


const BottomTextWrapper = styled.div`
  padding: 0% 5%;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  gap: 25px;
  margin-bottom: 1%;
  max-height: 32vh;  
  overflow-y: auto;  
  
  

`;

const TopInnerWrapper = styled.div`
  padding-top: 2%;
  display: flex;
  gap: 2%;
  flex-direction: column;
  align-items: center;
`;


const OwnerImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-width: 30%;
  z-index: 4;

  @media (max-width: 750px) {
    max-width: 35%;
  }
`;

const H1 = styled.h1`
  color: rgb(var(--ras-pink));
  font-family: Cinzel;
  font-size: 2.6rem;
  white-space: nowrap;
  text-align: start;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 1.32px;
  margin-bottom: 10px;
  

  @media (max-width: 600px) {
    font-size: 2.4rem;
  }
  @media (max-width: 500px) {
    font-size: 2rem;
  }
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  @media (max-width: 300px) {
    font-size: 1.2rem;
  }
`;

const P = styled.p`
  text-align: center;
  font-family: Montserrat;
  font-size: 18px;
  color: #4A4E69;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.4px;
  text-align: start;

  @media (max-width: 900px) {
    font-size: 15px;
  }

  @media (max-width: 450px) {
    font-size: 13px;
    line-height: 25px;
  }

  @media (max-width: 500px){
    font-size: 15px;
  }

`;



const About = () => {
    return (
      <OuterWrapper>
        <ContentBox>
          <TopInnerWrapper>
          <OwnerImage src={owner}/>
          <H1>What We're About</H1>
          </TopInnerWrapper>

          <BottomTextWrapper>
            <P>
              Welcome to Chic Haven, a boutique that redefines online shopping with a commitment to quality and sustainability. 
              Based in Detroit, MI, we offer a curated selection of clothing from talented minority designers both in the United States and abroad.
            </P>

            <P>
              Our mission is to make high-quality, sustainably sourced fashion accessible to all women. 
              At the heart of Chic Haven is our visionary founder, Gloria Antoinette, 
              who believes that every person deserves to feel beautiful and seen. 
              This core belief drives our dedication to showcasing the exceptional work of up-and-coming designers and models of color. 
              We are proud to provide a platform that celebrates diversity and empowers our community. 
              Discover fashion that stands for more than just trends. Discover Chic Haven!
          </P>



          </BottomTextWrapper>
          
        </ContentBox>

      </OuterWrapper>
    );
}

export default About