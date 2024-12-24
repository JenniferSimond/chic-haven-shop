import styled from "styled-components";
import logo2 from '../../assets/icons-svg/logo/logo2.svg'


const FooterSection = styled.footer`
    display: flex;
    align-items: center;
    background-color: rgba(var(--purple-dark), 1);
    width: 100%;
    min-height: 3.5rem;

    @media (max-width: 768px) {
        min-height: 3.5rem;
  }

  @media (max-width: 599px) {
        display: none;
  }
`;

const FooterImage = styled.img`
    width: 85px;
    height: 27.917px;
    margin-left: 3%;

    @media (max-width:768px) {
        width: 65px;
        height: auto;
  }
`;

const Footer = () => {
    return (
        <FooterSection>
             <FooterImage src={logo2} alt="Chic Haven Logo"/>
        </FooterSection>
    );
};


export default Footer