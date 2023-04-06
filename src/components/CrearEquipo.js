import React, { useState } from 'react'
import '../styles/agregarFamilia.css'

const CrearEquipo = () => {

    const [inputFamily, setInputFamily] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInputFamily(e.target.value);
        } else {
            alert('Esta Familia ya fue ingresada');
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Crear Dispositivos Médicos</h2>
            <div>
                <div>
                    <h4>Creación de Marcas</h4>
                </div>
                <form action='' className='formulario'>
                    <div>
                        <label htmlFor='usuario' className='label'>Nombre Familia Equipamiento Medico</label>
                        <input
                            type='text'
                            name='familia'
                            id='familia'
                            placeholder='Ingrese Familia'
                            value={inputFamily}
                            onChange={handleChange}
                            className='input'
                        />
                    </div>
                    <button as='button' type='submit' className='boton'>Guardar</button>
                </form>
            </div>
            
        </div >
    )
}


export default CrearEquipo;