import React from 'react'
import Modelo from './Modelo'

const ListaModelos = ({modelos, setModelos}) => {

    const editarModelo = (id, nuevoTexto) => {
        setModelos(modelos.map((modelo) => {
            if(modelo.id === id) {
                return {...modelo, texto: nuevoTexto}
            }
            return modelo;
        }))
    }

    const borrarModelo = (id) => {
        setModelos(modelos.filter((modelo) => {
            if(modelo.id !== id) {
                return modelo;
            }
            return '';
        }))
    }

    return (
        <ul className='lista-tareas'>
            {modelos.length > 0 ? modelos.map((modelo) => {
                return <Modelo 
                    key={modelo.id} 
                    modelo={modelo} 
                    editarModelo={editarModelo}
                    borrarModelo={borrarModelo}
                />
            })
            : <div className='lista-tareas__mensaje'>No hay Modelos agregados</div>
        }
        </ul>
    )
}


export default ListaModelos;