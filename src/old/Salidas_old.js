import React from 'react';
import styled from 'styled-components';
import { Select } from 'semantic-ui-react'
import { Table } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


const Salidas = () => {

    const equipo = [
        { key: '1', value: '1', text: 'RESPIRADOR ELECTRICO' },
        { key: 'ax', value: 'ax', text: '' }
    ]

    const navigate = useNavigate();
    const user = auth.currentUser;

    const volver = () => {
        navigate('/home/actualiza')
    }

    return (
        <ContenedorProveedor>
            <h1>Salida de Equipos</h1>
            <ContenedorFormulario>
                <Formulario action=''>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Cilente</Label>
                            <Input type='text' />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Destino</Label>
                            <Input type='text' />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Fecha Salida</Label>
                            <Input type='date' />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Status</Label>
                            <Input type='text' />
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Equipo</Label>
                            <Select placeholder='Seleccione Familia' options={equipo} />
                            <Icon><FontAwesomeIcon icon={faPlus} /></Icon>
                        </ContentElemenSelect>
                    </ContentElemen>
                    <Boton>Guardar</Boton>
                </Formulario>
            </ContenedorFormulario>

            <ListarProveedor>
                <h2>Listado Salidas</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Cliente</Table.HeaderCell>
                            <Table.HeaderCell>Destino</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Salida</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>MANUEL BALMACEDA</Table.Cell>
                            <Table.Cell>AV. BEAUCHEFF #938</Table.Cell>
                            <Table.Cell>30-04-2023</Table.Cell>
                            <Table.Cell>BODEGA</Table.Cell>
                            <Table.Cell><Boton onClick={volver}>Modif</Boton></Table.Cell>
                        </Table.Row>
                    </Table.Body>

                </Table>
            </ListarProveedor>

            <ListarProveedor>
                <h2>Listado Salidas de Equipos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                            <Table.HeaderCell>Marca</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>DISPOSITIVOS DE INFUSION</Table.Cell>
                            <Table.Cell>BOMBA ENTERAL</Table.Cell>
                            <Table.Cell>ABBOTT</Table.Cell>
                            <Table.Cell>FREEGO</Table.Cell>
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
    padding: 5px 20px;
`

const ContentElemenSelect = styled.div`
    padding: 20px;
`

const Icon = styled.div`
    display: inline-block;
    margin-left: 20px;
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
`

export default Salidas;