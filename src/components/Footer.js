import React from 'react';
import './footer.css'
import { FaWhatsapp } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
    return (
        <>
            <div className='footer'>
                <h2>Contactanos</h2>
                <ul className='contact'>
                    <li><FaWhatsapp />  +569 4798 6702</li>
                    <li><TfiEmail />  LogisticMed@logistic.cl</li>
                    <li><FiPhoneCall />  +569 32760999</li>
                </ul>
                <div className='reserved-right'>
                    <h4>© LogistcMed 2023. Todos los derechos reservados.</h4>
                </div>
            </div>
        </>
    )
}

export default Footer;