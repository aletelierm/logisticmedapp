import React from 'react';
import '../styles/footer.css'
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
    return (        
            <div className='footer'>
                <h2>Contactanos</h2>
                <ul className='contact'>
                    <li><FaWhatsapp style={{color:'#ffffff'}}/>  +569 54016368</li>
                    <li><TfiEmail style={{color: '#ffffff'}}/>  almlogistico@gmail.com</li>
                    <li><FiPhoneCall />  +569 54016368</li>
                </ul>
                <div className='reserved-right'>
                    <h4>© Logis-Tics 2023. Todos los derechos reservados.</h4>
                </div>
            </div>
        
    )
}

export default Footer;