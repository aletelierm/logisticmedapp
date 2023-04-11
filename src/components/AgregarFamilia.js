import React, { useState } from 'react';
import '../styles/agregarFamilia.css';
import Alertas from './Alertas';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '../styles/agregarFamilia.css'
import ListaFamilias from './ListaFamilias';     
          
            
const AgregarFamilia = () => {

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familias, setFamilias] = useState([
        // Ejemplos
        {
            id: 1,
            texto: 'Ventilador'
        },
        {
            id: 2,
            texto: 'Mascarilla'
        }
    ]);

    const [inputFamilia, setInputFamilia] = useState('')

    const handleInput = (e) => {
        setInputFamilia(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        cambiarEstadoAlerta(false);
        cambiarAlerta({});
<<<<<<< HEAD
       
=======
<<<<<<< HEAD
       
        /* console.log(inputFamilia); */
        
        if(inputFamilia.length !== 0)
        {
            setFamilias(
                [
                    ...familias,
                    {
                        id: uuidv4(),
                        texto: inputFamilia,
                    }
                ]
            );
    
            cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Familia Ingresada Correctamente'
                })       
            setInputFamilia('');
        }else{
            cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Familia Incorrecta'
                })       
            setInputFamilia('');
        }
        
=======
        e.target.value="";
>>>>>>> 3708f2ac6044ba338fc5f0ef8c04372f89d5184c

        setFamilias(
            [
                ...familias,
                {
                    id: uuidv4(),
                    texto: inputFamilia,
                }
            ]
        );

        cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Familia Ingresada Correctamente'
            })       

>>>>>>> master
        
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
            
<<<<<<< HEAD
            <ListaFamilias familias={familias} setFamilias={setFamilias} />
            <Alertas tipo={alerta.tipo}
                     mensaje={alerta.mensaje}
                     estadoAlerta={estadoAlerta}
                     cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
=======
        <ListaFamilias familias={familias} setFamilias={setFamilias} />
        <Alertas tipo={alerta.tipo}
                     mensaje={alerta.mensaje}
                     estadoAlerta={estadoAlerta}
                     cambiarEstadoAlerta={cambiarEstadoAlerta}
         />
>>>>>>> master
        </div >
        
    )
}


export default AgregarFamilia;