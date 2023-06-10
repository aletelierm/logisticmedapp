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


const NavbarSesion = () => { 
    
    const {users} = useContext(UserContext);
    console.log('obtener usuario contexto global:',users);   
   
    const navigate = useNavigate();     
    
 
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
                    <h4>Empresa : {'   ' + users.empresa}</h4>
                </div>
                <div>
                    <h4>Hoy : {fechaActual}</h4>
                </div>

                <div className='user'>
                    <div>
                        <FaUserAlt style={{color:'green', marginRight:'10px'}}/>
                    </div>
                    <div>
                         <h4>{users.nombre +' '+ users.apellido}</h4>
                         {/* <h4>{nombre +' '+ apellido}</h4> */}
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