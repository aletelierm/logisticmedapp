import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Tipos = ({ tipo, editarTipo, borrarTipo }) => {

    const [editandoTipo, setEditandoTipo] = useState(false);

    const [nuevoTipo, setNuevoTipo] = useState(tipo.texto)

    const handleSubmit = (e) => {
        e.preventDefault();
        editarTipo(tipo.id, nuevoTipo)
        setEditandoTipo(false)
    }

    return (
        <li className='lista-tareas__tarea'>
            <FontAwesomeIcon 
                icon={faList}
                className='lista-tareas__icono lista-tareas__icono-check'
            />
            <div className='Lista-tareas__texto'>
                {editandoTipo ?
                    <form action='' className='formulario-editar-tarea' onSubmit={handleSubmit}>
                        <input
                            type='texto'
                            className='formulario-editar-tarea__input'
                            value={nuevoTipo}
                            onChange={(e) => setNuevoTipo(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='formulario-editar-tarea__btn'
                        >
                            Actualizar
                        </button>
                    </form>
                    : tipo.texto
                }
            </div>
            <div className='lista-tareas__contenedor-botones'>
                <FontAwesomeIcon
                    icon={faEdit}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => setEditandoTipo(!editandoTipo)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => borrarTipo(tipo.id)}
                />
            </div>
        </li>
    )
}

export default Tipos;