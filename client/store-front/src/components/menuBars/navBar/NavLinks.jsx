import {Link} from 'react-router-dom'
import styled from 'styled-components'

const UL = styled.ul`
    list-style-type: none;
`;

const LI = styled.li`
    display: inline;
     &:not(:last-child) {
        margin-right: 1rem;
    }
    a {
        text-decoration: none;
        color: rgba(var(--purple-deep), 1);
        text-align: center;
        font-family: Cinzel;
        font-size: 1rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: 0.040rem;
        padding-right: 0.5rem;
        &:hover {
        color: rgba(var(--cream), 0.8);
        
        }

        @media (max-width: 849px) {
        font-size: 0.70rem;
        color: rgba(var(--purple-deep), 1);
        font-weight: 700;
  }

      @media (max-width: 500px) {
        display:none;
      }
    }
`;

const NavLinks = () => {
    return(
      <nav>
        <UL>

            <LI>
              <Link to='/products'>SHOP</Link>
            </LI>

            <LI>
              <Link to='/wishlist'>WISHLIST</Link>
            </LI>

            <LI>
              <Link to='/about'>ABOUT</Link>
            </LI>
            
        </UL>


      </nav>
    );
}

export default NavLinks