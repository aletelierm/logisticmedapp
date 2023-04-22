
import React from 'react';
import {BiExit} from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from "firebase/auth";

// import Login from '../components/Login'
import './../styles/navbar.css'

const NavbarSesion = () => {

    const user = auth.currentUser;
    const navigate = useNavigate();
   

    const cerrarSesion= ()=>{
            signOut(auth)
            navigate('/');

    }

    
    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='../logo2.png' alt='Logo' />
                </div>
                <div className='user'>
                     <h4>{user.email}</h4>
                   
                    <div className='icon' onClick={()=> cerrarSesion()}>
                        <BiExit className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavbarSesion;