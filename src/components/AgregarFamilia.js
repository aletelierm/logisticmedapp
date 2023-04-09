<<<<<<< HEAD
import React, { useState } from 'react';
import '../styles/agregarFamilia.css';
import Alertas from './Alertas';
=======
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaFamilias from './ListaFamilias';
>>>>>>> master


<<<<<<< HEAD
    const [inputFamily, setInputFamily] = useState('')
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});


    const handleChange = (e) => {
        setInputFamily(e.target.value);
       /*  if (e.target.name === 'familia') {
            
        } else {
            alert('Esta Familia ya fue ingresada');
        } */
    }
    
    const handleSubmit = (e)=>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        console.log(inputFamily)
        if (inputFamily === 'familia') {
          /*   setInputFamily(e.target.value); */
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Familia Ingresada Correctamente'
            })
            e.target.value = 0;
        } else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor Ingrese una familia¡¡'
            })
            
=======
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
>>>>>>> master
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
<<<<<<< HEAD
                <form onSubmit={handleSubmit} className='formulario'>
=======
                <form action='' className='formFamily' onSubmit={handleSubmit}>
>>>>>>> master
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
<<<<<<< HEAD
            <Alertas tipo={alerta.tipo}
                     mensaje={alerta.mensaje}
                     estadoAlerta={estadoAlerta}
                     cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
=======
        <ListaFamilias familias={familias} setFamilias={setFamilias} />
>>>>>>> master
        </div >
        
    )
}


export default AgregarFamilia;