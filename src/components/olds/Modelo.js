import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Modelo = ({ modelo, editarModelo, borrarModelo }) => {

    const [editandoModelo, setEditandoModelo] = useState(false);

    const [nuevoModelo, setNuevoModelo] = useState(modelo.texto)

    const handleSubmit = (e) => {
        e.preventDefault();
        editarModelo(modelo.id, nuevoModelo)
        setEditandoModelo(false)
    }

    return (
        <li className='lista-tareas__tarea'>
            <FontAwesomeIcon 
                icon={faList}
                className='lista-tareas__icono lista-tareas__icono-check'
            />
            <div className='Lista-tareas__texto'>
                {editandoModelo ?
                    <form action='' className='formulario-editar-tarea' onSubmit={handleSubmit}>
                        <input
                            type='texto'
                            className='formulario-editar-tarea__input'
                            value={nuevoModelo}
                            onChange={(e) => setNuevoModelo(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='formulario-editar-tarea__btn'
                        >
                            Actualizar
                        </button>
                    </form>
                    : modelo.texto
                }
            </div>
            <div className='lista-tareas__contenedor-botones'>
                <FontAwesomeIcon
                    icon={faEdit}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => setEditandoModelo(!editandoModelo)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => borrarModelo(modelo.id)}
                />
            </div>
        </li>
    )
}

export default Modelo;