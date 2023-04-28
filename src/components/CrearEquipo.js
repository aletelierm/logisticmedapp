import React from 'react';
import styled from 'styled-components';
import Select from './SelectExample';
import { Table } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';


const Proveedores = () => {

    const familia = [
        { key: '1', value: '1', text: 'DISPOSITIVOS DE INFUSION' },
        { key: 'ax', value: 'ax', text: 'MOTOR DE ASPIRACION' }
    ]

    const tipo = [
        { key: '1', value: '1', text: 'BOMBA ENTERAL' },
        { key: 'ax', value: 'ax', text: 'MOTOR DE ASPIRACION' }
    ]
    const marca = [
        { key: '1', value: '1', text: 'ABBOTT' },
        { key: 'ax', value: 'ax', text: 'SUSED' }
    ]

    const modelo = [
        { key: '1', value: '1', text: 'FREEGO' },
        { key: 'ax', value: 'ax', text: 'TRX-800' }
    ]

    const navigate = useNavigate();
    const user = auth.currentUser;

    const volver = () => {
        navigate('/home/actualiza')
    }

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h2>Crear Dispositivos Médicos</h2>
            </ContenedorFormulario>
            
            <ContenedorFormulario>
                <Formulario action=''>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <label>Familia</label>
                            <Select placeholder='Seleccionar Familia' opciones={familia} />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <label>Tipo</label>
                            <Select placeholder='Seleccionar Familia' opciones={tipo} />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <label>Marca</label>
                            <Select placeholder='Seleccionar Familia' opciones={marca} />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <label>Modelo</label>
                            <Select placeholder='Seleccionar Familia' opciones={modelo} />
                        </ContentElemenSelect>
                    </ContentElemen>
                    <ContentElemen>
                        <Label >N° Serie</Label>
                        <Input type='number' />
                        <Label >RFID</Label>
                        <Input type='number' />
                    </ContentElemen>
                    <Boton>Crear</Boton>
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <h2>Listado de Dispositivos Médicos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>Marca</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N° Serie</Table.HeaderCell>
                            <Table.HeaderCell>RFID</Table.HeaderCell>
                            <Table.HeaderCell>Acción</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                            <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                            <Table.Cell>SUSED</Table.Cell>
                            <Table.Cell>TRX-800</Table.Cell>
                            <Table.Cell>234JN93THC4GHO6</Table.Cell>
                            <Table.Cell>-------</Table.Cell>
                            <Table.Cell><Boton onClick={volver}>Modif</Boton></Table.Cell>
                        </Table.Row>
                    </Table.Body>

                </Table>
            </ListarProveedor>
            {console.log(user.uid)}
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
    
`

const ContentElemen = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`

const ContentElemenSelect = styled.div`
    padding: 20px;
`


const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const Formulario = styled.form``

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
`

const Label = styled.label`
        padding: 5px;
        font-size: 20px;
`

const Boton = styled.button`
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-top: 20px;
`

export default Proveedores;