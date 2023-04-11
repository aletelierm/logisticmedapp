import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Alertas from './Alertas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaTipos from './ListaTipos'


const AgregarTipo = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [tipos, setTipos] = useState([]);
    const [inputTipo, setInputTipo] = useState('')

    const handleInput = (e) => {
        setInputTipo(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (inputTipo.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado un Tipo de Equipamiento'
            })

        } else {
            setTipos(
                [
                    ...tipos,
                    {
                        id: uuidv4(),
                        texto: inputTipo.toUpperCase(),
                    }
                ]
            );

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Tipo de Equipamiento Ingresado Correctamente'
            })
        }
        }

        return (
            <div className='containerFamily'>
                <h2 className='titleForm'>Tipo de Equipamiento</h2>
                <div>
                    <form action='' className='formFamily' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='tipo' className='formFamily__label'>Agregar Tipo</label>
                            <input
                                type='text'
                                className='formFamily__input'
                                placeholder='Ingrese Tipo Equipamiento Medico'
                                value={inputTipo}
                                onChange={handleInput}

                            />
                        </div>
                        <button as='button' type='submit' className='formFamily__btn'>
                            <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn' />
                        </button>
                    </form>
                </div>
                <ListaTipos tipos={tipos} setTipos={setTipos} />
                <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
            </div >
        )
    }


    export default AgregarTipo;