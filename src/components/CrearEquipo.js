import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import '../styles/crearEquipo.css'


const CrearEquipo = () => {

    const [series, setSeries] = useState([])
    const [inputSerie, setInputSerie] = useState('')

    const handleInput = (e) => {
        setInputSerie(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setSeries(
            [
                ...series,
                {
                    id: uuidv4(),
                    texto: inputSerie,
                }
            ]
        )
    }

    return (
        <div className='containerEquipment'>
            <h2 className='titleFormEquipment'>Crear Dispositivos Médicos</h2>
            <div>
                <form action='' className='formEquipment' onSubmit={handleSubmit}>

                    <div className='formItem'>
                        <div >
                            <label htmlFor='familia' className='labelEquipment'>Familia</label>
                            <input
                                type='text'
                                placeholder='Seleccione Familia'
                                // value={input}
                                // onChange={handleChange}
                                className='inputEquipment'
                            />
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className='formItem_Bnt' />
                    </div>

                    <div className='formItem'>
                        <div>
                            <label htmlFor='tipo' className='labelEquipment'>Tipo</label>
                            <input
                                type='text'
                                placeholder='Seleccione Tipo Equipamiento'
                                // value={input}
                                // onChange={handleChange}
                                className='inputEquipment'
                            />
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className='formItem_Bnt' />
                    </div>

                    <div className='formItem'>
                        <div>
                            <label htmlFor='marca' className='labelEquipment'>Marca</label>
                            <input
                                type='text'
                                placeholder='Seleccione Marca'
                                // value={input}
                                // onChange={handleChange}
                                className='inputEquipment'
                            />
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className='formItem_Bnt' />
                    </div>

                    <div className='formItem'>
                        <div>
                            <label htmlFor='modelo' className='labelEquipment'>Modelo</label>
                            <input
                                type='text'
                                placeholder='Seleccione Modelo'
                                // value={input}
                                // onChange={handleChange}
                                className='inputEquipment'
                            />
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className='formItem_Bnt' />
                    </div>

                    <div className='formItem'>
                        <div>
                            <label htmlFor='serie' className='labelEquipment'>N° Serie</label>
                            <input
                                type='text'
                                placeholder='Ingrese Numero Serie'
                                value={inputSerie}
                                onChange={(e) => handleInput(e)}
                                className='inputEquipment'
                            />
                        </div>
                    </div>

                    <button as='button' type='submit' className='botonEquipment'>Guardar</button>
                </form>
            </div>

        </div >
    )
}


export default CrearEquipo;