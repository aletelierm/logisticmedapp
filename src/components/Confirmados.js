/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});


    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Confirmacion de Entrega</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
            <Titulo>Guia a Entregar</Titulo>
                <ContentElemen>
                    <Table singleLine style={{ textAlign: 'center' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N° Documento</Table.HeaderCell>
                                <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                                <Table.HeaderCell>Fecha</Table.HeaderCell>
                                <Table.HeaderCell>Rut</Table.HeaderCell>
                                <Table.HeaderCell>Cliente</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>13</Table.Cell>
                                <Table.Cell>Guia</Table.Cell>
                                <Table.Cell>01-08-2023</Table.Cell>
                                <Table.Cell>17.579.501-4</Table.Cell>
                                <Table.Cell>Catalina Astudillo</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ContentElemen>

                <ContentElemen>
                    <Table singleLine style={{ textAlign: 'center' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                <Table.HeaderCell>Dar Confirmacion</Table.HeaderCell>
                                <Table.HeaderCell>Obserbaiones</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>VENTILADOR MECANICO	PHILIPS	TRILOGY 100</Table.Cell>
                                <Table.Cell>tv11404180e</Table.Cell>
                                <Table.HeaderCell>
                                    <Boton>Confirmado</Boton>
                                </Table.HeaderCell>
                                <Table.Cell>
                                    <Input />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2</Table.Cell>
                                <Table.Cell>VENTILADOR MECANICO	LOWENSTEIN	PRISMA 50</Table.Cell>
                                <Table.Cell>32053792</Table.Cell>
                                <Table.HeaderCell>
                                    <Boton>Confirmado</Boton>
                                </Table.HeaderCell>
                                <Table.Cell>
                                    <Input />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ContentElemen>
            </ContenedorFormulario>

            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <Table singleLine style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Cliente</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        <Table.Row>
                            <Table.Cell >1</Table.Cell>
                            <Table.Cell>13</Table.Cell>
                            <Table.Cell>Guia</Table.Cell>
                            <Table.Cell>01-08-2023</Table.Cell>
                            <Table.Cell>17.579.501-4</Table.Cell>
                            <Table.Cell>Catalina Astudillo</Table.Cell>
                            <Table.Cell>
                                <FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: 'green' }} />
                            </Table.Cell>

                        </Table.Row>
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor >
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
    justify-content: space-evenly;
    padding: 5px 10px;
`
const ContentElemenSelect = styled.div`
    padding: 20px;
`
const Select = styled.select`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 200px;
`
const Titulo = styled.h2`
    color:  #83d394;
`
const Icon = styled.button`
    display: flex;
    // justify-content: space-between;
    margin-left: 20px;
    border: none;
    background: none;
`
const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`
const ListarEquipos = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.40);
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
    color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    &:hover{
        background-color: #83d310;
    }
`

export default Confirmados;