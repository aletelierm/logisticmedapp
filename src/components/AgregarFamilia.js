import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgregarFamiliaDb from '../firebase/AgregarFamiliaDb';
import Alertas from './Alertas';
// import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const AgregarFamilia = () => {

    // const navigate = useNavigate();
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familia, setFamilia] = useState('');
    const [leer, setLeer] = useState([])

    const handleChange = (e) => {
        setFamilia(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (familia === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Familia'
            })
            // alert('campo no puede estar vacio')
        } else {

            AgregarFamiliaDb({
                familia: familia,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Familia Ingresada Correctamente'
                    })
                    // alert('datos grabados correctamente')
                    setFamilia('');
                })
        }
    }

    // const volver = () => {
    //     navigate('/home/actualiza')
    // }

    const getData = async () => {
        const data = await getDocs(collection(db, "familias"));
        setLeer(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getData();
    }, [setFamilia, familia])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h2>Familia de Equipos</h2>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Agregar Familia</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Familia Equipamiento Médico'
                            name='familia'
                            value={familia}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <Boton>Agregar</Boton>
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <h2>Listado de Familias</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {leer.map((item, index) => {
                            return (
                                <Table.Row>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{item.familia}</Table.Cell>
                                    <Table.Cell><Boton /* onClick={volver} */>Modif</Boton></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>

                </Table>
            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const ContentElemen = styled.div`
    text-align: center;
    padding: 7px;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const Formulario = styled.form`
    display: flex;
    padding: 20px;
    text-align: center;
    align-items: center;
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    
`

const Label = styled.label`
        padding: 10px;
        font-size: 20px;
`

const Boton = styled.button`
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-top: 5px;
`

export default AgregarFamilia;