import React, { useState } from 'react';
import '../styles/agregarFamilia.css';
import Alertas from './Alertas';

const AgregarFamilia = () => {

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
            
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Familias de Equipos</h2>
            <div>
                <form onSubmit={handleSubmit} className='formulario'>
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
            <Alertas tipo={alerta.tipo}
                     mensaje={alerta.mensaje}
                     estadoAlerta={estadoAlerta}
                     cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div >
        
    )
}


export default AgregarFamilia;