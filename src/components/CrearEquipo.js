import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import SelectExample from './SelectExample';
import ListaCrearEquipo from './ListaCrearEquipo'
import '../styles/crearEquipo.css'


const CrearEquipo = () => {

    const arreglo1 = [
        { key: '1', value: '1', text: 'DISPOSITIVOS DE INFUSION' },
        { key: 'ax', value: 'ax', text: 'MOTOR DE ASPIRACION' }
    ]

    const arreglo2 = [
        { key: '1', value: '1', text: 'BOMBA ENTERAL' },
        { key: 'ax', value: 'ax', text: 'MOTOR DE ASPIRACION' }
    ]
    const arreglo3 = [
        { key: '1', value: '1', text: 'ABBOTT' },
        { key: 'ax', value: 'ax', text: 'SUSED' }
    ]

    const arreglo4 = [
        { key: '1', value: '1', text: 'FREEGO' },
        { key: 'ax', value: 'ax', text: 'TRX-800' }
    ]

    const [selectFamilia, setSelectFamilia] = useState(''); 

    const [series, setSeries] = useState([])
    const [inputSerie, setInputSerie] = useState('')

    const handleInput = (e) => {
        setInputSerie(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setSeries(
            [
                ...series,
                {
                    id: uuidv4(),
                    texto: inputSerie,
                }
            ]
        )
        setInputSerie('');
    }

    return (
        <div className='containerEquipment'>
            <h2 className='titleFormEquipment'>Crear Dispositivos Médicos</h2>
            <div>
                <form action='' className='formEquipment formItem' onSubmit={handleSubmit}>

                    <div >
                        <label htmlFor='familia' className='labelEquipment'>Familia</label>
                        <SelectExample placeholder='Seleccionar Familia' opcion={arreglo1} />
                        
                    </div>

                    <div>
                        <label htmlFor='tipo' className='labelEquipment'>Tipo Equipamiento</label>
                        <SelectExample placeholder='Seleccionar Tipo' opcion={arreglo2} />
                    </div>

                    <div>
                        <label htmlFor='marca' className='labelEquipment'>Marca</label>
                        <SelectExample placeholder='Seleccionar Marca' opcion={arreglo3}/>
                    </div>

                    <div>
                        <label htmlFor='modelo' className='labelEquipment'>Modelo</label>
                        <SelectExample placeholder='Seleccionar Modelo' opcion={arreglo4} />
                    </div>

                    <div>
                        <label htmlFor='serie' className='labelEquipment'>N° Serie</label>
                        <input
                            type='text'
                            placeholder='Ingrese Serie'
                            value={inputSerie}
                            onChange={(e) => handleInput(e)}
                            className='inputEquipment'
                        />
                    </div>

                    <button as='button' type='submit' className='botonEquipment'>Guardar</button>
                </form>
            </div>

            <ListaCrearEquipo />

        </div >
    )
}


export default CrearEquipo;