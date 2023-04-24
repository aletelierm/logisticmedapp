import React, { useState } from 'react';
/* import { v4 as uuidv4 } from 'uuid'; */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import ListaFamilias from './ListaFamilias';
import Alertas from './Alertas';
import '../styles/agregarFamilia.css';
import format from 'date-fns/format'
import {es} from 'date-fns/locale';

const AgregarFamilia = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familias, setFamilias] = useState('');
    const [inputFamilia, setInputFamilia] = useState('')

    let fechaActual = format(new Date(),`dd 'de' MMMM 'de' yyyy`, {locale: es});
    console.log(fechaActual)

    const handleInput = (e) => {
        setInputFamilia(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (inputFamilia.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Familia'
            })

        } else {
            // setFamilias(
            //     [
            //         ...familias,
            //         {
            //             id: uuidv4(),
            //             texto: inputFamilia.toUpperCase(),
            //         }
            //     ]
            // );

            const documento = await addDoc(collection(db, "familias"), {
                namefamilia: inputFamilia,
                fecha: '',
                usuario: '',
                empresa: ''
            })
            console.log(documento.id)
            console.log(inputFamilia)

            setInputFamilia('');

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Familia Ingresada Correctamente'
            })
        }
    }

    return (
        <div className='containerFamily'>
            <h2 className='titleForm'>Familias de Equipos</h2>
            <div>
                <form action='' className='formFamily' onSubmit={handleSubmit}>
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
            <ListaFamilias familias={familias} setFamilias={setFamilias} />
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div >
    )
}


export default AgregarFamilia;