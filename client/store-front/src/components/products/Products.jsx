import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { fetchAllProducts } from "../../api/product";
import { ProductCard } from "./productCard";
import SideBar from "../menuBars/SideBar";
import styled from "styled-components";

const ProductSection = styled.div`
display: flex;

margin-bottom: 2%;
`
const ProductWrapper = styled.div`
    
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 40px;
    column-gap: 15px;
    justify-content: center;  // align products 
    align-content: flex-start;
    width: 100%;  
    max-height: 100%;
    margin-right: 250px; 
    margin-bottom: 2%;
    margin-top: 2%;
    
@media (max-width: 950px) {
    margin-right: 0px;
    margin-bottom: 10%;
}
`

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const getProducts = async () => {

            try {
                const chicProducts = await fetchAllProducts()
                console.log('Products (productPage) -->',chicProducts); 
                setProducts(chicProducts) 
                setFilteredProducts(chicProducts)
               
            } catch (error) {
              console.error(error)
            }
        }
        getProducts()
        
    },[]); // dependency array --> controls when useEffect is called --> empty array means -> the side-effect runs once after the initial rendering.
   
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchTermQuery = params.get('search') || '';
        const filter = products.filter(product =>
            product.name.toLowerCase().includes(searchTermQuery.toLocaleLowerCase())
        );
        setFilteredProducts(filter)
    }, [products, location.search]);

return(
    <ProductSection>

    <ProductWrapper>
        {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product}/>
        ))}
    </ProductWrapper>
        <SideBar></SideBar>
    </ProductSection>
    
)
}




export default Products