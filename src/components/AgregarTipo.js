import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'


const AgregarTipo = () => {

    const navigate = useNavigate();
    const user = auth.currentUser;

    const volver = () => {
        navigate('/home/actualiza')
    }

    return (
        <ContenedorProveedor>
            <h1>Tipos de Equipos</h1>
            <ContenedorFormulario>
                <Formulario action=''>
                    <ContentElemen>
                        <Label>Agregar Tipo</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Tipo Equipamiento Médico'
                        />
                    </ContentElemen>
                    <Boton>Guardar</Boton>
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <h2>Listado de Tipos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>TRX-800</Table.Cell>
                            <Table.Cell><Boton onClick={volver}>Modif</Boton></Table.Cell>
                        </Table.Row>
                    </Table.Body>

                </Table>
            </ListarProveedor>
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
    padding: 20px;
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
        margin-top: 10px;
`

export default AgregarTipo;