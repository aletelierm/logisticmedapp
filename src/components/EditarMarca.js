import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import ActualizarMarcaDb from '../firebase/ActualizarMarcaDb';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { FaRegEdit } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
// import { doc, updateDoc } from "firebase/firestore";


const EditarMarca = ({ id, id2, marca, userAdd, userMod }) => {
    const user = auth.currentUser;
    let fechaMod = new Date();

    const [editando, setEditando] = useState(false)
    const [nuevoCampo, setNuevoCampo] = useState(marca);

    const handleChange = (e) => {
        setNuevoCampo(e.target.value)
    }

    const actualizarCampo = async () => {

        // const actualizar = doc(db, 'familias', id);
        // await updateDoc(actualizar, {
        //     familia: 'azul',
        //     userMod: user.email,
        //     fechaMod: fechaMod
        // })

        const mar = nuevoCampo.toLocaleUpperCase();
        ActualizarMarcaDb({
            id: id,
            marca: mar,
            userMod: user.email,
            fechaMod: fechaMod
        })
        setEditando(false)
        alert('se Actualizo!')
    }


    useEffect(() => {
        
        }, [])


    return (

        < Table.Row>
            <Table.Cell>{id2}</Table.Cell>
            <Table.Cell>
                {editando ?
                    <Formulario >
                        <Input
                            type='text'
                            name='marca'
                            value={nuevoCampo}
                            onChange={handleChange}
                        />
                    </Formulario>
                    : marca
                }
            </Table.Cell>
            <Table.Cell>{userAdd}</Table.Cell>
            <Table.Cell>{userMod}</Table.Cell>
            <Table.Cell style={{ alignItems: 'center' }}>
                <Boton onClick={() => setEditando(!editando)}>
                    <FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                </Boton>
            </Table.Cell>
            <Table.Cell>
                {editando &&
                    <Boton onClick={actualizarCampo}>
                        <GoChecklist style={{ fontSize: '23px', color: 'green', marginTop: '5px' }} />
                    </Boton>}
            </Table.Cell>
        </Table.Row>

    )
}

const Formulario = styled.form`
    display: flex;
    padding: 0px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`

const Input = styled.input`
    padding: 3px 10px;
    width: 90%;
	border: none;
	border-bottom: 2px solid #b8b8b8;
	background: none;
	font-size: 16px;
`

const Boton = styled.button`
    background-color: #ffffff;
    padding: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
`



export default EditarMarca