import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'


const AgregarFamilia = () => {

    const navigate = useNavigate();
    const user = auth.currentUser;
    console.log(user)
    const volver = () => {
        navigate('/home/actualiza')
    }

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                    <h2>Familia de Equipos</h2>
            </ContenedorFormulario>
            
            <ContenedorFormulario>
                <Formulario action=''>
                    <ContentElemen>
                        <Label>Agregar Familia</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Familia Equipamiento Médico'
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
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>DISPOSITIVOS DE INFUSION</Table.Cell>
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