import React, { useState } from 'react'
import '../styles/agregarFamilia.css'
import * as FaIcons from 'react-icons/fa';

import styled from 'styled-components';


const ContainerFamily = styled.div`
        width: 600px;
        font-family: 'Roboto', sans-serif;
        text-align: center;
        padding: 40px 80px;
        border-radius: 10px ;
        border: 2px solid green;
        box-shadow:   7px 4px 5px 0px rgba(0,0,0,0.55);;
        margin-top: 100px;
        margin-left: 100px;
        /* background-color: #C7DCC7; */
     
`
const Formulario = styled.form`
    display: flex;
    justify-content: space-around ;
    gap: 20px;
    margin: 30px 0 0 0;
    padding-left: 150px;
    
`
const Boton = styled.form`
    margin-top: 15px;
    font-size: 40px;
	color: #80BE4E;
	cursor: pointer;
  

`
const Etiqueta = styled.input`
        border-color: green;
`


const AgregarFamilia = () => {

    const [inputFamily, setInputFamily] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInputFamily(e.target.value);
        } else {
            alert('Esta Familia ya fue ingresada');
        }
    }

    return (
        <ContainerFamily>
            <h2 className='titleForm'>Equipamiento Médico</h2>
            <div>
                <Formulario action='' className='formulario'>
                    <div>
                        <label htmlFor='usuario' className='label'>Agregar Familia</label>
                        <Etiqueta
                            type='text'
                            name='familia'
                            id='familia'
                            placeholder='Nombre Familia Equipamiento Medico'
                            value={inputFamily}
                            onChange={handleChange}
                            className='input'
                        />
                    </div>
                    <div>

                    </div>
                    <Boton type='submit'><FaIcons.FaPlusSquare/></Boton>
                </Formulario>
            </div>
            
        </ContainerFamily >
    )
}


export default AgregarFamilia;