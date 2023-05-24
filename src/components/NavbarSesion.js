import React, { useEffect, useState } from 'react';
import { BiExit } from "react-icons/bi";
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import format from 'date-fns/format'
/* import { es } from 'date-fns/locale'; */
import './../styles/navbarSession.css'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import useObtenerUsuario from '../hooks/useObtenerUsuario';

const NavbarSesion = () => { 
    
    const user = auth.currentUser;
    const id = user.uid;
    console.log('id de aut:', id)
    const [usuarios] = useObtenerUsuario(id);
    const {usuario, setUsuario} = useContext(UserContext);
    console.log('obtener usuario:',usuario);
    //Varibals de estado para crear el contexto global
    
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('');
    /* const [rol, setRol] = useState('');
    const [empresa, setEmpresa] = useState(''); */
    
    const navigate = useNavigate();  
    
    useEffect(()=>{
         if(usuarios){
             setNombre(usuarios.nombre);
             setApellido(usuarios.apellido);
             /* setRol(usuarios.ROL);
             setEmpresa(usuarios.empresa); */
             console.log('de useffect navbarsesion:',nombre)
             setUsuario(usuarios);
         }else{
            console.log('ejecuta else de useeffect')
            navigate('/misequipos');
         }
     },[setUsuario,usuarios,  nombre, navigate])
    
    
 
    let fechaActual = format(new Date(),`dd 'de' MMMM 'de' yyyy`);
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
                        {/*  <h4>{user.email}</h4> * */}
                         <h4>{nombre +' '+ apellido}</h4>
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