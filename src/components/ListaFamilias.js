import React from 'react'
import Familia from './Familia'

const ListaFamilias = ({familias, setFamilias}) => {

    const editarFamilia = (id, nuevoTexto) => {
        setFamilias(familias.map((familia) => {
            if(familia.id === id) {
                return {...familia, texto: nuevoTexto}
            }
            return familia;
        }))
    }

    const borrarFamilia = (id) => {
        setFamilias(familias.filter((familia) => {
            if(familia.id !== id) {
                return familia;
            }
            return;
        }))
    }

    return (
        <ul className='lista-tareas'>
            {familias.length > 0 ? familias.map((familia) => {
                return <Familia 
                    key={familia.id} 
                    familia={familia} 
                    editarFamilia={editarFamilia}
                    borrarFamilia={borrarFamilia}
                />
            })
            : <div className='lista-tareas__mensaje'>No hay Familias agregadas</div>
        }
        </ul>
    )
}


export default ListaFamilias;