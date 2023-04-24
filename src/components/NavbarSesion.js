
import React from 'react';
import {BiExit} from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import format from 'date-fns/format'
import {es} from 'date-fns/locale';

// import Login from '../components/Login'
import './../styles/navbar.css'

const NavbarSesion = () => {


    let fechaActual = format(new Date(),`dd 'de' MMMM 'de' yyyy`, {locale: es});
   /*  let horaActual = format (new Date(), `k ':' m`) */
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
                <div>
                    <h4>Hoy : {fechaActual}</h4>                   
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