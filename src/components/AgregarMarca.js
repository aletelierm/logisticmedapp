import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'


const AgregarMarca = () => {

const [marcas, setMarcas] = useState([]);

    const [inputMarca, setInputMarca] = useState('')

    const handleInput = (e) => {
        setInputMarca(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setMarcas(
            [
                ...marcas,
                {
                    id: uuidv4(),
                    texto: inputMarca,
                }
            ]
        );
    }

    console.log(marcas)

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Marca de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='marca' className='formFamily__label'>Agregar Marca</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Marca Equipamiento Médico'
                            value={inputMarca}
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


export default AgregarMarca;