import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Alertas from './Alertas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaModelos from './ListaModelos';


const AgregarModelo = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [modelos, setModelos] = useState([]);
    const [inputModelo, setInputModelo] = useState('')

    const handleInput = (e) => {
        setInputModelo(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (inputModelo.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado un Modelo'
            })

        } else {
            setModelos(
                [
                    ...modelos,
                    {
                        id: uuidv4(),
                        texto: inputModelo,
                    }
                ]
            );

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Familia Ingresada Correctamente'
            })
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Modelo de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='modelo' className='formFamily__label'>Agregar Modelo</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Modelo Equipamiento Médico'
                            value={inputModelo}
                            onChange={handleInput}

                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn' />
                    </button>
                </form>
            </div>
            <ListaModelos modelos={modelos} setModelos={setModelos} />
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div >
    )
}


export default AgregarModelo;