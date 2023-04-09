import React from 'react'
import Familia from './Familia'

const ListaFamilias = ({familias}) => {
    return (
        <ul className='lista-tareas'>
            {familias.length > 0 ? familias.map((familia) => {
                return <Familia key={familia.id} familia={familia} />
            })
            : <div className='lista-tareas__mensaje'>No hay tareas agregadas</div>
        }
        </ul>
    )
}


export default ListaFamilias;