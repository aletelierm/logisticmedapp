import React from 'react'
import Tipos from './Tipos'

const ListaTipos = ({tipos, setTipos}) => {

    const editarTipo = (id, nuevoTexto) => {
        setTipos(tipos.map((tipo) => {
            if(tipo.id === id) {
                return {...tipo, texto: nuevoTexto}
            }
            return tipo;
        }))
    }

    const borrarTipo = (id) => {
        setTipos(tipos.filter((tipo) => {
            if(tipo.id !== id) {
                return tipo;
            }
            return '';
        }))
    }

    return (
        <ul className='lista-tareas'>
            {tipos.length > 0 ? tipos.map((tipo) => {
                return <Tipos 
                    key={tipo.id} 
                    tipo={tipo} 
                    editarTipo={editarTipo}
                    borrarTipo={borrarTipo}
                />
            })
            : <div className='lista-tareas__mensaje'>No hay Tipos agregados</div>
        }
        </ul>
    )
}


export default ListaTipos;