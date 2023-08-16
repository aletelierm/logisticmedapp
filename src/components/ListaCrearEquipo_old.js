import React from 'react'

const ListaFamilias = ({ familias, setFamilias }) => {

    return (
        <ul className='lista-tareas'>
            <tr className='crearLista-tareas__tarea encabezado'>
                <th>N° Serie</th>
                <th>Familias</th>
                <th>Tipo Equipamiento</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Acción</th>
            </tr>           

            <div className='lista-tareas__mensaje'>No hay Dispositivos Médicos Creados</div>
        </ul>
    )
}

export default ListaFamilias;