import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ListaEmpresas from './ListaEmpresas';
import Alertas from './Alertas';
import '../styles/agregarFamilia.css';


const AgregarEmpresa = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [empresas, setEmpresas] = useState('');

    const [inputEmpresa, setInputEmpresa] = useState('')

    const handleInput = (e) => {
        setInputEmpresa(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (inputEmpresa.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Familia'
            })

        } else {
            setEmpresas(
                [
                    ...empresas,
                    {
                        id: uuidv4(),
                        texto: inputEmpresa.toUpperCase(),
                    }
                ]
            );

            setInputEmpresa('');

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Familia Ingresada Correctamente'
            })
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Empresas</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='familia' className='formFamily__label'>Agregar Empresa</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Empresa'
                            value={inputEmpresa}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn' />
                    </button>
                </form>
            </div>
            <ListaEmpresas empresas={empresas} setEmpresas={setEmpresas} />
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div >
    )
}


export default AgregarEmpresa;