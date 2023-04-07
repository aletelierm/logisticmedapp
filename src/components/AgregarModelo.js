import React, { useState } from 'react'
import '../styles/agregarFamilia.css'

const AgregarModelo = () => {

    const [inputModelo, setInputModelo] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInputModelo(e.target.value);
        } else {
            alert('Este Modelo ya fue ingresada');
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Modelo de Equipos</h2>
            <div>
                <form action='' className='formulario'>
                    <div>
                        <label htmlFor='modelo' className='label'>Agregar Modelo</label>
                        <input
                            type='text'
                            name='modelo'
                            id='modelo'
                            placeholder='Ingrese Modelo Equipamiento Médico'
                            value={inputModelo}
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


export default AgregarModelo;