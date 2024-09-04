import styled from "styled-components";
import owner from '../../assets/img-png/owner.png';

const AboutBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1500px;
  width: 100%;
  margin-top:  1%;
//   padding: 20px;
`;

const OwnerImg = styled.img`
  display: block;
 min-width: 100px;
  max-width:250px;
  height: auto;
  margin: 0 auto;
`;

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 900px;
  border: 2px solid black;

  h1{
  color: #D81159;
  font-family: Cinzel;
  font-size: 3rem;
  white-space: nowrap;
  text-align: start;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 1.32px;
  margin-bottom: 10px;
  }
`;

const AboutContent = styled.div`
  max-width: 970px;
  min-width: 200px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  p {
  text-align: start;
  font-family: Montserrat;
  font-size: 15px;
  color: #4A4E69;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.4px;
  }
`;

const About = () => {
    return (
        <AboutBody>
        <AboutWrapper>
          <OwnerImg src={owner} alt={'Chic Haven Owner'} />
          <h1>What We're About</h1>
          <AboutContent>
            <p>
              Welcome to Chic Haven, a boutique that redefines online shopping with 
              a commitment to quality and sustainability. 
              Based in Detroit, MI, we offer a curated selection of clothing from talented 
              minority designers both in the United States and abroad. </p>
            <p>
              Our mission is to make high-quality, sustainably sourced fashion 
              accessible to all women. At the heart of Chic Haven is our visionary 
              founder, Gloria Antoinette, who believes that every person deserves to feel beautiful and seen. 
              This core belief drives our dedication to showcasing the exceptional work of up-and-coming designers 
              and models of color. We are proud to provide a platform that celebrates diversity and empowers our community.
            Discover fashion that stands for more than just trends. Discover Chic Haven!
  
            </p>
          </AboutContent>
        </AboutWrapper>
      </AboutBody>
    );
}

export default About