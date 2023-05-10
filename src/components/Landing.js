import Footer from "./Footer";
import Navbar from "./Navbar";
import Section from "./Section"
import Styled from 'styled-components';


const Landing = () => {

   
    return (
        <ContenedorLanding>
            <Navbar/>
            <Section/>
            <Footer/>
        </ContenedorLanding>

      );
}
 
const ContenedorLanding = Styled.div`
       /*  width: 100%; */
        /* height: 100vh; */
`

export default Landing;




