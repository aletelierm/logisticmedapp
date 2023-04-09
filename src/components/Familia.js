import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Familia = ({ familia }) => {

    const [editandoFamilia, setsetEditandoFamilia] = useState(false);

    const [nuevaFamilia, setNuevaFamilia] = useState(familia.texto)

    const handleSubmit = (e) => {
        e.preventDefault();
        setsetEditandoFamilia(false)
    }

    return (
        <li className='lista-tareas__tarea'>
            <FontAwesomeIcon
                icon={faCheckSquare}
                className='lista-tareas__icono lista-tareas__icono-check'
            />
            <div className='Lista-tareas__texto'>
                {editandoFamilia ?
                    <form action='' className='formulario-editar-tarea' onSubmit={handleSubmit}>
                        <input
                            type='texto'
                            className='formulario-editar-tarea__input'
                            value={nuevaFamilia}
                            onChange={(e) => setNuevaFamilia(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='formulario-editar-tarea__btn'
                        >
                            Actualizar
                        </button>
                    </form>
                    : familia.texto
                }
            </div>
            <div className='lista-tareas__contenedor-botones'>
                <FontAwesomeIcon
                    icon={faEdit}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => setsetEditandoFamilia(!editandoFamilia)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                />
            </div>
        </li>
    )
}

export default Familia;