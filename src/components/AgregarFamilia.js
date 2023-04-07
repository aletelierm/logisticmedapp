import React, { useState } from 'react'
import '../styles/agregarFamilia.css'

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
        <div className='containerFamily'>
            <h2 className='titleForm'>Familias de Equipos</h2>
            <div>
                <form action='' className='formulario'>
                    <div>
                        <label htmlFor='familia' className='label'>Agregar Familia</label>
                        <input
                            type='text'
                            name='familia'
                            id='familia'
                            placeholder='Ingrese Familia Equipamiento Médico'
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


export default AgregarFamilia;