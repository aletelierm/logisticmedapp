import React, { useState } from 'react'
import '../styles/agregarFamilia.css'

const AgregarTipo = () => {

    const [inputTipo, setInputTipo] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInputTipo(e.target.value);
        } else {
            alert('Esta Tipo ya fue ingresada');
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Tipo de Equipamiento</h2>
            <div>
                <form action='' className='formulario'>
                    <div>
                        <label htmlFor='tipo' className='label'>Agregar Tipo</label>
                        <input
                            type='text'
                            name='tipo'
                            id='tipo'
                            placeholder='Ingrese Tipo Equipamiento Medico'
                            value={inputTipo}
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


export default AgregarTipo;