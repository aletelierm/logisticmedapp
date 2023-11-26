import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
// import '../styles/navbar.css'
import { Nav, ContenedorImagen, User, Texto, Boton } from '../elementos/Navbar';

const Navbar = () => {
    const navigate = useNavigate();

    const handleChange = () => {
        navigate('/login');
    }

    return (
        <>
            <Nav>
                <ContenedorImagen >
                    <img src='../../logo.png' alt='Logo Logistic Med'/>
                </ContenedorImagen>
                <User >
                    <Texto>Iniciar Sesion</Texto>
                    <Boton onClick={() => handleChange()}>
                        <BiUserCircle style={{fontSize: '64px'}} />
                    </Boton>
                </User>
            </Nav>
        </>
    )
}

export default Navbar