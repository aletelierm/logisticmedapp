import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css'

const Navbar = () => {
    const navigate = useNavigate();

    const handleChange = () => {
        navigate('/login');
    }

    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='../../logo.png' alt='Logo Logistic Med'/>
                </div>
                <div className='user'>
                    <h4>Iniciar Sesion</h4>
                    <div className='icon' onClick={() => handleChange()}>
                        <BiUserCircle className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar