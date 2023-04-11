import React from 'react'
import Marca from './Marca'

const ListaMarcas = ({marcas, setMarcas}) => {

    const editarMarca = (id, nuevoTexto) => {
        setMarcas(marcas.map((marca) => {
            if(marca.id === id) {
                return {...marca, texto: nuevoTexto}
            }
            return marca;
        }))
    }

    const borrarMarca = (id) => {
        setMarcas(marcas.filter((marca) => {
            if(marca.id !== id) {
                return marca;
            }
            return '';
        }))
    }

    return (
        <ul className='lista-tareas'>

            <tr className='lista-tareas__tarea encabezado'>
                <th>N°</th>
                <th>Marcas</th>
                <th>Acción</th>
            </tr>

            {marcas.length > 0 ? marcas.map((marca) => {
                return <Marca
                    key={marca.id} 
                    marca={marca} 
                    editarMarca={editarMarca}
                    borrarMarca={borrarMarca}
                />
            })
            : <div className='lista-tareas__mensaje'>No hay Marcas agregadas</div>
        }
        </ul>
    )
}


export default ListaMarcas;