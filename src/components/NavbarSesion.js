import { BiExit } from "react-icons/bi";
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from "firebase/auth";
import format from 'date-fns/format'
// import './../styles/navbarSession.css'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { NavSesion, ContenedorImagenSesion, ContenedorImagenSesion2, UserSesion, TextoNavSesion, BotonSesion, BotonSesion2 } from '../elementos/Navbar';

const NavbarSesion = () => {
    const { users } = useContext(UserContext);//Contexto Global
    const navigate = useNavigate();
    let fechaActual = format(new Date(), `dd 'de' MMMM 'de' yyyy`);
    /*  let horaActual = format (new Date(), `k ':' m`) */
    const cerrarSesion = () => {
        signOut(auth)
        navigate('/');
    }

    return (
        <>
            <NavSesion>
                <ContenedorImagenSesion>
                    {/* <img src='../../LogoLogisticMed.png' alt='LogoLogisticMed' style={{ height: '240px' }} /> */}
                    <img src='../../logo.png' alt='LogoLogisticMed' /* style={{ height: '140px' }} */ />
                </ContenedorImagenSesion>
                <ContenedorImagenSesion2>
                    <img src={`../../${users.emp_id}.png`} alt='LogoEmprsa' /* style={{ height: '60px', width: '100px' }} */ />
                </ContenedorImagenSesion2>
               {/*  <UserSesion>
                    <TextoNavSesion>
                        v1.0 Beta
                    </TextoNavSesion>
                </UserSesion> */}
                <UserSesion>
                    <TextoNavSesion>Empresa : {'   ' + users.empresa}</TextoNavSesion>
                </UserSesion>
                <UserSesion>
                    <TextoNavSesion>Hoy : {fechaActual}</TextoNavSesion>
                </UserSesion>
                <UserSesion>
                    <BotonSesion2>
                        <FaUserAlt style={{ color: '#328AC4', fontSize: '32px' }} />
                    </BotonSesion2>
                    <UserSesion>
                        <TextoNavSesion>{users.nombre + ' ' + users.apellido + '  (' + users.rol + ')'}</TextoNavSesion>

                        {/* <h4>{nombre +' '+ apellido}</h4> */}
                    </UserSesion>
                </UserSesion>
                <UserSesion style={{marginRight: '0px'}}>
                    <BotonSesion onClick={() => cerrarSesion()}>
                        <BiExit style={{fontSize: '64px', marginRight: '0px'}} title="Cerrar Sesióncl" />
                    </BotonSesion>
                </UserSesion>
            </NavSesion>
        </>
    )
}

export default NavbarSesion;