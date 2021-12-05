
import styled from 'styled-components';
   
export const Box = styled.div`
  padding: 40px 10px;
  background: black;
  opacity: .8;
  
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  
  height: 10vh;

  /* overflow: auto; */
  
   
  @media (max-width: 1000px) {
    padding: 0px 0px;
  }
`;
   
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1000px;
    margin: 0 580px;
    /* background: red; */
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 60px;
`;
   
export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 
                         minmax(185px, 1fr));
  grid-gap: 20px;
   
  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, 
                           minmax(200px, 1fr));
  }
`;
   
export const FooterLink = styled.a`
  color: #e8e8e8;
  margin-bottom: 20px;
  font-size: 18px;
  text-decoration: none;
   
  &:hover {
      color: green;
      transition: 200ms ease-in;
  }
`;
   
export const Heading = styled.p`
  font-size: 24px;
  color: white;
  margin-bottom: 40px;
  font-weight: bold;
`;