import styled from "styled-components"

const SideWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
    background-color: rgba(var(--mustard), 1);
    right: 0;
    z-index: 90; 
    position: fixed;
    height: 100vh; // Ensure it takes the full height of the viewport
    // transition: all 0.3s ease;
    
    @media (max-width: 950px) {
    display: none;
    }
    @media (max-width: 1300px) {
    width: 200px;
    }
`;

const SideBar = () => {
    return (
       <SideWrapper>
         
       </SideWrapper>
    )
}

export default SideBar;
