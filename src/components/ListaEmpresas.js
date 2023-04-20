import React from 'react'
import Empresa from './Empresa'


const ListaEmpresas = ({ empresas, setEmpresas }) => {

    const editarEmpresa = (id, nuevoTexto) => {
        setEmpresas(empresas.map((empresa) => {
            if (empresa.id === id) {
                return { ...empresa, texto: nuevoTexto }
            }
            return empresa;
        }))
    }

    const borrarEmpresa = (id) => {
        setEmpresas(empresas.filter((empresa) => {
            if (empresa.id !== id) {
                return empresa;
            }
            return '';
        }))
    }

    return (
        <ul className='lista-tareas'>
            <tr className='lista-tareas__tarea encabezado'>
                <th>N°</th>
                <th>Empresas</th>
                <th>Acción</th>
            </tr>
            
            {empresas.length > 0 ? empresas.map((empresa) => {
                return <Empresa
                    key={empresa.id}
                    empresa={empresa}
                    editarEmpresa={editarEmpresa}
                    borrarEmpresa={borrarEmpresa}
                />
            })
                : <div className='lista-tareas__mensaje'>~ No hay Empresas agregadas ~</div>
            }
        </ul>
    )
}


export default ListaEmpresas;