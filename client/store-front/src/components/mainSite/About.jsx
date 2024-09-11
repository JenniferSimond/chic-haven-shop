import styled from "styled-components";
import owner from '../../assets/img-png/owner.png';

const OuterWrapper = styled.div`

    display: flex;
    height: 80vh;
    justify-content: center;
    align-items: center;
    margin:  0% 2%;
`;

const ContentBox = styled.div`
  display-flex;
  flex-direction: column;
  max-width: 700px;
  width: 50%;
  max-height: 800px;
  min-height: 200px;
  height: 90%;
  border: 5px solid rgb(var(--purple-light));
  border-radius: 3px;
  overflow-y: clip;
`;


const BottomTextWrapper = styled.div`
  padding: 0% 5%;
  display: flex;
  flex-direction: column;
  max-width: 620px;
  gap: 25px;
  max-height: 32vh;  /* Adjust this to control when the scrolling begins */
  overflow-y: auto;   /* This makes the content scrollable */
}

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
  max-width: 25%;
  z-index: 4;
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
`;

const P = styled.p`
  text-align: start;
  font-family: Montserrat;
  font-size: 15px;
  color: #4A4E69;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.4px;
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