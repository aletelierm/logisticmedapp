import React, { useState, useEffect, useRef } from 'react';
import Alerta from './Alertas'
import { Table } from 'semantic-ui-react'
import { db, auth } from '../firebase/firebaseConfig';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContentElemenSelect, Select, Formulario, Input, Label, Contenido } from '../elementos/CrearEquipos'
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, Boton, BotonGuardar, Boton2 } from '../elementos/General';


const Programas = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [nombre, setNombre] = useState('');
    const [flag, setFlag] = useState(false);

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [flag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Programas</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action='' >
                    <ContentElemenAdd>
                        <ContentElemenSelect>
                            <Label >Nombre</Label>
                            <Input
                                type='text'
                                placeholder='Ingrese Nombre Protocolo'
                                name='protocolo'
                            // value={nombre}
                            // onChange={e => setNombre(e.target.value)}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Días</Label>
                            <Input
                                type='text'
                                placeholder='Ingrese N° de Días'
                                name='dias'
                            // value={nombre}
                            // onChange={e => setNombre(e.target.value)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenAdd>
                    <BotonGuardar>Crear</BotonGuardar>
                </Formulario>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Programas</Titulo>
                </ContentElemenAdd>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Nompre</Table.HeaderCell>
                            <Table.HeaderCell>Días</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {/* {
                            filtro().map((item) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.familia}</Table.Cell>
                                        <Table.Cell>{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.marca}</Table.Cell>
                                        <Table.Cell>{item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.rfid}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }} >
                                            <MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        } */}

                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>Anual</Table.Cell>
                            <Table.Cell>365</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>Semestral</Table.Cell>
                            <Table.Cell>183</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>3</Table.Cell>
                            <Table.Cell>Trimestral</Table.Cell>
                            <Table.Cell>90</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </ListarProveedor>

            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

export default Programas;