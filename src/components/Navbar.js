
import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css'

const Navbar = () => {

    const navigate = useNavigate();
    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='./logo2.png' alt='Logo' />
                </div>
                <div className='user'>
                    <h3>Iniciar Sesion</h3>
                    <div className='icon' onClick={()=> navigate('/home')}>
                        <BiUserCircle className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar