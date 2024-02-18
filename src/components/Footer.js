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
                    <li><FaWhatsapp style={{color:'#ffffff'}}/>  +569 76321481</li>
                    <li><TfiEmail style={{color: '#ffffff'}}/>  ventas@dormirbien.cl</li>
                    <li><FiPhoneCall />  +569 54234538</li>
                </ul>
                <div className='reserved-right'>
                    <h4>© 5 REM 2024. Todos los derechos reservados.</h4>
                </div>
            </div>
        
    )
}

export default Footer;