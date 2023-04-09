import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaFamilias from './ListaFamilias';


const AgregarFamilia = () => {

    const [familias, setFamilias] = useState([
        // Ejemplos
        {
            id: 1,
            texto: 'Ventilador'
        },
        {
            id: 2,
            texto: 'Mascarilla'
        }
    ]);

    const [inputFamilia, setInputFamilia] = useState('')

    const handleInput = (e) => {
        setInputFamilia(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setFamilias(
            [
                ...familias,
                {
                    id: uuidv4(),
                    texto: inputFamilia,
                }
            ]
        );
    }

    console.log(familias)

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Familias de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='familia' className='formFamily__label'>Agregar Familia</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Familia Equipamiento Médico'
                            value={inputFamilia}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn' />
                    </button>
                </form>
            </div>
        <ListaFamilias familias={familias} setFamilias={setFamilias} />
        </div >
    )
}


export default AgregarFamilia;