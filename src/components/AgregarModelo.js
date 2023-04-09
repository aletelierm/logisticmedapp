import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaModelos from './ListaModelos';


const AgregarModelo = () => {

    const [modelos, setModelos] = useState([]);

    const [inputModelo, setInputModelo] = useState('')

    const handleInput = (e) => {
        setInputModelo(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setModelos(
            [
                ...modelos,
                {
                    id: uuidv4(),
                    texto: inputModelo,
                }
            ]
        );
    }

    console.log(modelos)

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Modelo de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='modelo' className='formFamily__label'>Agregar Modelo</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Modelo Equipamiento Médico'
                            value={inputModelo}
                            onChange={handleInput}
                            
                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn'/>
                    </button>
                </form>
            </div>
            <ListaModelos modelos={modelos} setModelos={setModelos} />
        </div >
    )
}


export default AgregarModelo;