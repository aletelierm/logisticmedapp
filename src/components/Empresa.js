import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const Empresa = ({ empresa, editarEmpresa, borrarEmpresa }) => {

    const [editandoEmpresa, setEditandoEmpresa] = useState(false);

    const [nuevaEmpresa, setNuevaEmpresa] = useState(empresa.texto)

    const handleSubmit = (e) => {
        e.preventDefault();
        editarEmpresa(empresa.id, nuevaEmpresa)
        setEditandoEmpresa(false)
    }

    return (
        <li className='lista-tareas__tarea'>
            <FontAwesomeIcon 
                icon={faList}
                className='lista-tareas__icono lista-tareas__icono-check'
            />
            <div className='Lista-tareas__texto'>
                {editandoEmpresa ?
                    <form action='' className='formulario-editar-tarea' onSubmit={handleSubmit}>
                        <input
                            type='texto'
                            className='formulario-editar-tarea__input'
                            value={nuevaEmpresa}
                            onChange={(e) => setNuevaEmpresa(e.target.value)}
                        />
                        <button
                            type='submit'
                            className='formulario-editar-tarea__btn'
                        >
                            Actualizar
                        </button>
                    </form>
                    : empresa.texto
                }
            </div>
            <div className='lista-tareas__contenedor-botones'>
                <FontAwesomeIcon
                    icon={faEdit}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => setEditandoEmpresa(!editandoEmpresa)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='lista-tareas__icono lista-tareas__icono-accion'
                    onClick={() => borrarEmpresa(empresa.id)}
                />
            </div>
        </li>
    )
}

export default Empresa;