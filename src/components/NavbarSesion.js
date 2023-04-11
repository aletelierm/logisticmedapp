
import React from 'react';
import {BiExit} from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';

// import Login from '../components/Login'
import '../styles/navbar.css'

const NavbarSesion = () => {

    const user = auth.currentUser;
    const navigate = useNavigate();
   

    const handleChange = ()=>{
            
            navigate('/');

    }

    
    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='./logo2.png' alt='Logo' />
                </div>
                <div className='user'>
                     <h3>{user.email}</h3>
                   
                    <div className='icon' onClick={()=> handleChange()}>
                        <BiExit className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavbarSesion;