import React, {useState, useEffect, useContext} from "react";
import { CustomerContext } from "../../CustomerContext";
import { getToken } from "../shared/auth";
import { useLocation } from "react-router-dom";
import { fetchAllProducts } from "../../api/product";
import { getWishlistAndItems } from "../../api/wishlist";
import ProductCard from "./productCard";
import SideBar from "../menuBars/SideBar";
import styled from "styled-components";

const ProductSection = styled.div`
display: flex;

margin-bottom: 2%;
`;
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
    justify-content: center;
    margin-bottom: 12%;
}
`

const Products = () => {
    const { customerData } = useContext(CustomerContext);
    const token = getToken();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [customerWishlist, setCustomerWishlist] = useState({});
    const [pageRefresh, setPageRefresh] = useState(false);
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
        
        const getCustomerWishlist = async () => {
            if (!customerData.id || !token) return;
          try {
            const updatedWishlist = await getWishlistAndItems(customerData.id, token);
                console.log('Wishlist-(products)->', updatedWishlist)
                updatedWishlist ? setCustomerWishlist(updatedWishlist) : setCustomerWishlist({})
          } catch (error) {
            console.error('Error fetching wishlist items', error);
            setCustomerWishlist({})
          }
        };
        getCustomerWishlist();
      }, [ customerData.id, token, pageRefresh])

      const refreshHandler = () => {
        setPageRefresh(!pageRefresh);
      };

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
            <ProductCard key={product.id} product={product} refreshHandler={refreshHandler} customerWishlist={customerWishlist}/>
        ))}
    </ProductWrapper>
        <SideBar></SideBar>
    </ProductSection>
    
)
}




export default Products