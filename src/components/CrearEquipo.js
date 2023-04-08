import React, { useState } from 'react'
import '../styles/crearEquipo.css'

const CrearEquipo = () => {

    const [input, setInput] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInput(e.target.value);
        } else {
            alert('Esta Familia ya fue ingresada');
        }
    }

    return (
        <div className='containerEquipment'>
            <h2 className='titleFormEquipment'>Crear Dispositivos Médicos</h2>
            <div>
                <form action='' className='formEquipment'>
                    
                    <div>
                        <label htmlFor='familia' className='labelEquipment'>Familia</label>
                        <input
                            type='text'
                            name='familia'
                            id='familia'
                            placeholder='Ingrese Familia'
                            value={input}
                            onChange={handleChange}
                            className='inputEquipment'
                        />
                    </div>

                    <div>
                        <label htmlFor='tipo' className='labelEquipment'>Tipo</label>
                        <input
                            type='text'
                            name='tipo'
                            id='tipo'
                            placeholder='Ingrese Tipo Equipamiento Medico'
                            value={input}
                            onChange={handleChange}
                            className='inputEquipment'
                        />
                    </div>

                    <div>
                        <label htmlFor='marca' className='labelEquipment'>Marca</label>
                        <input
                            type='text'
                            name='marca'
                            id='marca'
                            placeholder='Ingrese Marca'
                            value={input}
                            onChange={handleChange}
                            className='inputEquipment'
                        />
                    </div>

                    <div>
                        <label htmlFor='modelo' className='labelEquipment'>Modelo</label>
                        <input
                            type='text'
                            name='modelo'
                            id='modelo'
                            placeholder='Ingrese Familia'
                            value={input}
                            onChange={handleChange}
                            className='inputEquipment'
                        />
                    </div>

                    <button as='button' type='submit' className='botonEquipment'>Guardar</button>
                </form>
            </div>
            
        </div >
    )
}


export default CrearEquipo;