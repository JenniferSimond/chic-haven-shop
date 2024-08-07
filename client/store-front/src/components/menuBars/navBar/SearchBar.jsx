import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import search from '../../../assets/icons-svg/search.svg'

import searchLight from '../../../assets/icons-svg/searchLight.svg'

const SearchBarWrapper = styled.form`
  display: flex;
  align-items: center;
  background-color: #F9F5E3;
  border-radius: 2px;
  overflow: hidden;
  width: 300px;
  height: 25px;
  transition: all 0.2s ease;
  
  @media (max-width: 849px) {
      width: 200px;
      height: 20px;
      margin-top: 2.5%
  }
  
  @media (max-width: 500px) {
        width: 145px;
        height: 20px;
  }

`;


const SearchBox = styled.input`
    background-color: #F9F5E3;
    width: 300px;
    height: 29px;
    border: none;
  transition: all 0.2s ease;
    margin: 8px;
    outline: none;
     @media (max-width: 849px) {
        width: 200px;
        height: 20px;
  }

  @media (max-width: 500px) {
        width: 95px;
        height: 20px;

          &::placeholder {
          font-size: 10px;
        }
  }

`

const SearchButton = styled.button`
  background-color: #FFBC42;
  border: none;
  width: 41px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
  background-color: #22223B;
  }

  @media (max-width: 849px) {
        width: 31px;
        height: 20px;
  }

  @media (max-width: 500px) {
        width: 23px;
        height: 20px;

      
  }
`;

const SearchIcon = styled.img`
  width: 29px;
  height: 29px;
  transition: all 0.2s ease;
  ${SearchButton}:hover & {
  opacity:0.8;
    content: url(${props => props.$hoverIcon});
  }

  @media (max-width: 849px) {
        width: 22px;
        height: auto;
  }

    @media (max-width: 500px) {
        width: 20px;
        height: auto;
  }
`;

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // trim white space 
    if (searchInput.trim()) {
      // sedning the search input with url as a query parameter --> Learn more about this
      navigate(`/products?search=${searchInput.trim()}`)
    }
    setSearchInput('')
    console.log('Search Form!')
  }

  const handleChange = (event) => {
    console.log('Event ->', event.target.value)
    setSearchInput(event.target.value)
  }

  console.log('Search Input (Search) -->', searchInput)
    return(
        <SearchBarWrapper onSubmit={handleSubmit} >
            <SearchBox type='text' onChange={handleChange} value={searchInput} placeholder='Search products'/>
            <SearchButton>
                <SearchIcon src={search} $hoverIcon={searchLight} alt='Search Icon'/>
            </SearchButton>
        </SearchBarWrapper>
        
    );
}

export default SearchBar