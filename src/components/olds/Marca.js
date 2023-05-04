import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Familia = ({ marca, editarMarca, borrarMarca }) => {

    const [editandoMarca, setEditandoMarca] = useState(false);

    const [nuevoMarca, setNuevoMarca] = useState(marca.texto)

    const handleSubmit = (e) => {
        e.preventDefault();
        editarMarca(marca.id, nuevoMarca)
        setEditandoMarca(false)
    }

    return (
        <li className='lista-tareas__tarea'>
            <FontAwesomeIcon 
                icon={faList}
                className='lista-tareas__icono lista-tareas__icono-check'
            />
            <div className='Lista-tareas__texto'>
                {editandoMarca ?
                    <form action='' className='formulario-editar-tarea' onSubmit={handleSubmit}>
                        <input
                            type='texto'
                            className='formulario-editar-tarea__input'
                            value={nuevoMarca}
                            onChange={(e) => setNuevoMarca(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='formulario-editar-tarea__btn'
                        >
                            Actualizar
                        </button>
                    </form>
                    : marca.texto
                }
            </div>
            <div className='lista-tareas__contenedor-botones'>
                <FontAwesomeIcon
                    icon={faEdit}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => setEditandoMarca(!editandoMarca)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => borrarMarca(marca.id)}
                />
            </div>
        </li>
    )
}

export default Familia;