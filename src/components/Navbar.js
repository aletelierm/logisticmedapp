
import React, {useState} from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
// import Login from '../components/Login'
import '../styles/navbar.css'

const Navbar = () => {

    const navigate = useNavigate();
    const [sesion, setSesion] = useState(false);

    const handleChange = ()=>{
            setSesion(true);
            navigate('/login');

    }

    console.log('Valor de la sesion',sesion)
    return (
        <>
            <div className='navbar'>
                <div className='imageLogo'>
                    <img src='./logo2.png' alt='Logo' />
                </div>
                <div className='user'>
                    {!sesion ? <h3>Iniciar Sesion</h3> : <h3>Cerrar Sesion</h3>}
                   
                    <div className='icon' onClick={()=> handleChange()}>
                        <BiUserCircle className='iconUser' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar