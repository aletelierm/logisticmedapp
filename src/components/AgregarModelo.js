import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgregarModeloDb from '../firebase/AgregarModeloDb';
import Alertas from './Alertas';
// import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const AgregarModelo = () => {

    // const navigate = useNavigate();
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [modelo, setModelo] = useState('');
    const [leer, setLeer] = useState([])

    const handleChange = (e) => {
        setModelo(e.target.value);
    }

    // const q = query(citiesRef, where("state", "==", "CA"));

    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        const modeloRef = (collection(db, 'modelos'));
        if (modelo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Modelo'
            })
            // alert('campo no puede estar vacio')
        } else if (query(modeloRef, where('name', '==', 'modelos.name')) ) {
            
            alert('Este Modelo de Equipamiento ya existe.')
        } else {
            AgregarModeloDb({
                name: modelo,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Modelo Ingresada Correctamente'
                    })
                    // alert('datos grabados correctamente')
                    setModelo('');
                })
        }
    }

    // const volver = () => {
    //     navigate('/home/actualiza')
    // }

    const getData = async () => {
        const data = await getDocs(collection(db, "modelos"));
        setLeer(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getData();
    }, [setModelo, modelo])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h2>Modelos de Equipos</h2>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Agregar Modelo</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Modelo Equipamiento Médico'
                            name='modelo'
                            value={modelo}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <Boton>Agregar</Boton>
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <h2>Listado de Modelos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {leer.map((item, index) => {
                            return (
                                <Table.Row>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{item.modelo}</Table.Cell>
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

export default AgregarModelo;