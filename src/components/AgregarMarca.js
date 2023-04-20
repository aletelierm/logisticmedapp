import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Alertas from './Alertas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaMarcas from './ListaMarcas';


const AgregarMarca = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [marcas, setMarcas] = useState([]);
    const [inputMarca, setInputMarca] = useState('')

    const handleInput = (e) => {
        setInputMarca(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (inputMarca.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Marca'
            })

        } else {
            setMarcas(
                [
                    ...marcas,
                    {
                        id: uuidv4(),
                        texto: inputMarca.toUpperCase(),
                    }
                ]
            );
            
            setInputMarca('');

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Marca Ingresada Correctamente'
            })
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Marca de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='marca' className='formFamily__label'>Agregar Marca</label>
                        <input
                            type='text'
                            className='formFamily__input'
                            placeholder='Ingrese Marca Equipamiento Médico'
                            value={inputMarca}
                            onChange={(e) => handleInput(e)}

                        />
                    </div>
                    <button as='button' type='submit' className='formFamily__btn'>
                        <FontAwesomeIcon icon={faPlus} className='formFamily__iconBtn' />
                    </button>
                </form>
            </div>
            <ListaMarcas marcas={marcas} setMarcas={setMarcas} />
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div >
    )
}


export default AgregarMarca;