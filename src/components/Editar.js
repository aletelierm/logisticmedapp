import React, { useState } from 'react'
import { Table } from 'semantic-ui-react'
import { FaRegEdit } from "react-icons/fa";

const Editar = ({ id, familia, userAdd, userMod }) => {
    const [editando, setEditando] = useState(false)
    const [nuevaFamilia, setNuevaFamilia] = useState(familia);

    const actualizarContacto = (e) => {
        e.preventDefault();
        // editar(item.familia.id, nuevaFamilia)
        setEditando(false)
    }

    return (
        <li style={{ justifyContent: 'space-between' }}>

            {/* {editando ?
                <form action='' onSubmit={actualizarContacto}>
                    <input
                        type='text'
                        name='familia'
                        value={nuevaFamilia}
                        onChange={(e) => setNuevaFamilia(e.target.value)}
                        placeholder='Familia'
                    />
                    <button type='submit'>Actualizar</button>
                </form>
                : */}

            <Table.Row key={id}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>
                    {editando ?
                        <form action='' onSubmit={actualizarContacto}>
                            <input
                                type='text'
                                name='familia'
                                value={nuevaFamilia}
                                onChange={(e) => setNuevaFamilia(e.target.value)}
                                placeholder='Familia'
                            />
                            <button type='submit'>Actualizar</button>
                        </form>
                        : familia
                    }
            </Table.Cell>
            <Table.Cell>{userAdd}</Table.Cell>
            <Table.Cell>{userMod}</Table.Cell>
            <Table.Cell>
                <button onClick={() => setEditando(!editando)}>
                    <FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                </button>
            </Table.Cell>
        </Table.Row>
            
            
        </li >
    )
}

export default Editar