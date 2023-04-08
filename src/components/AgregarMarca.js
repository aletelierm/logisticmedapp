import React, { useState } from 'react'
import '../styles/agregarFamilia.css'

const AgregarMarca = () => {

    const [inputMarca, setInputMarca] = useState('')

    const handleChange = (e) => {
        if (e.target.name === 'familia') {
            setInputMarca(e.target.value);
        } else {
            alert('Esta Marca ya fue ingresada');
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Marca de Equipos</h2>
            <div>
                <form action='' className='formulario'>
                    <div>
                        <label htmlFor='marca' className='label'>Agregar Marca</label>
                        <input
                            type='text'
                            name='marca'
                            id='marca'
                            placeholder='Ingrese Marca Equipamiento Médico'
                            value={inputMarca}
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


export default AgregarMarca;