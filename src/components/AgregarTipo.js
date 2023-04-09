import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'


const AgregarTipo = () => {

    const [tipos, setTipos] = useState([]);

    const [inputTipo, setInputTipo] = useState('')

    const handleInput = (e) => {
        setInputTipo(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setTipos(
            [
                ...tipos,
                {
                    id: uuidv4(),
                    texto: inputTipo,
                }
            ]
        );
    }

    console.log(tipos)

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Tipo de Equipamiento</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='tipo' className='formFamily__label'>Agregar Tipo</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Tipo Equipamiento Medico'
                            value={inputTipo}
                            onChange={handleInput}
                            
                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn'/>
                    </button>
                </form>
            </div>
            
        </div >
    )
}


export default AgregarTipo;