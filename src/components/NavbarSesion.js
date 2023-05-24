import React, { useEffect, useState } from 'react';
import { BiExit } from "react-icons/bi";
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import format from 'date-fns/format'
import { es } from 'date-fns/locale';
import './../styles/navbarSession.css'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import useObtenerUsuario from '../hooks/useObtenerUsuario';

const NavbarSesion = () => { 
    
    const user = auth.currentUser;
    const id = user.uid;
    // const [usuarios] = useObtenerUsuario(id);
    const {usuario, setUsuario} = useContext(UserContext);
    const [nombre, setNombre] = useState('Catalina')
    const [apellido, setApellido] = useState('Astudillo');
    const [rol, setRol] = useState('DADMIN');
    const [empresa, setEmpresa] = useState('ALLCOMPANY');

    const navigate = useNavigate();

   console.log('id de aut', id)
    
    // useEffect(()=>{
        // if(usuarios){
            // setNombre(usuarios.nombre);
            // setApellido(usuarios.apellido);
            // setRol(usuarios.ROL);
            // setEmpresa(usuarios.empresa);
            // console.log('de useffect:',nombre)
            // setUsuario(usuarios);
        // }else{
            // navigate('/home/misequipos');
        // }
    // },[setUsuario,usuarios,  nombre, navigate])
    
    
 
    let fechaActual = format(new Date(),`dd 'de' MMMM 'de' yyyy`, {locale: es});
   /*  let horaActual = format (new Date(), `k ':' m`) */
    
   


    const cerrarSesion = () => {
        signOut(auth)
        navigate('/');

    }


    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='../logo.png' alt='Logo' />
                </div>
                <div>
                    <h4>Hoy : {fechaActual}</h4>
                </div>

                <div className='user'>
                    <div>
                        <FaUserAlt style={{color:'green', marginRight:'10px'}}/>
                    </div>
                    <div>
                        {/*  <h4>{user.email}</h4> */}
                        <h4>{nombre +' '+ apellido}</h4>               
                        {/* <h6>{rol}</h6>               
                        <h6>{empresa}</h6>  */}   
                    </div>
                              
                </div>
                <div>
                    <div className='icon' onClick={() => cerrarSesion()}>
                        <BiExit className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavbarSesion;