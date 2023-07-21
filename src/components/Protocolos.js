import React, { useState } from 'react';
import Modal from './Modal';
import styled from 'styled-components';

const Protocolos = () => {

    const [estadoModal, setEstadoModal] = useState(false);

    return (
        <div>
            <h1>Protocolos</h1>
            <Boton onClick={()=>setEstadoModal(!estadoModal)}>Modal</Boton>
            <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
                <Contenido>
                    <h1>Ventana Modal</h1>
                    <p>reutilizaba</p>
                 <Boton onClick={()=>setEstadoModal(!estadoModal)}>Aceptar</Boton>
                </Contenido>
            </Modal>
        </div>
    );
};

export default Protocolos ;

const Boton = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;

	&:hover {
		background: #0066FF;
	}
`

const Contenido = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

`
