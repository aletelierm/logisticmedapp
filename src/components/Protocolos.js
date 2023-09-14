import React, { useState } from 'react';
import Alertas from './Alertas';
// import Modal from './Modal';
// import styled from 'styled-components';
import { Table } from 'semantic-ui-react';
// import { FaRegEdit } from "react-icons/fa";
// import { BiAddToQueue } from "react-icons/bi";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, FormularioAdd, ListarProveedor, Titulo, InputAdd, Boton, BotonGuardar } from '../elementos/General';
import { Input } from '../elementos/CrearEquipos';

const Protocolos = () => {
    // const [estadoModal, setEstadoModal] = useState(false);
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [nomProtocolo, setNomProtocolo] = useState('');

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Crear Protocolos</Titulo>
            </Contenedor>

            <Contenedor>
                <FormularioAdd action='' /* onSubmit={handleSubmit} */ >
                    <InputAdd
                        type='text'
                        placeholder='Ingrese Nombre Protocolo'
                        name='nomprotocolo'
                        value={nomProtocolo}
                        onChange={e => setNomProtocolo(e.target.value)}
                    />
                </FormularioAdd>
                <ListarProveedor>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Pasa</Table.HeaderCell>
                                <Table.HeaderCell>No Pasa</Table.HeaderCell>
                                <Table.HeaderCell>N/A</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Sanitización</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell>Inspección visual carcasa, verificar golpes o quemaduras</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell>Inspección visual de cable eléctrico, verificar roturas o conductores expuestos</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ListarProveedor>
                <BotonGuardar style={{ marginTop: '30px' }}>Guardar</BotonGuardar>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Boton ><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton>
                    <Titulo>Listado de Items</Titulo>
                    <Boton ><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton>
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                    // value={buscador}
                    // onChange={onBuscarCambios}
                    />
                </ContentElemenAdd>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>Inspección visual conector de entrada de voltaje AC</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>Inspección visual switch ON/OFF verificar encendido y apagado</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>3</Table.Cell>
                            <Table.Cell>Inspección visual de manómetro verificar estado y funcionamiento</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>4</Table.Cell>
                            <Table.Cell>Verificar estado de mangueras y frasco</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>5</Table.Cell>
                            <Table.Cell>Desarme de equipo y revisión de motor</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>6</Table.Cell>
                            <Table.Cell>Lubricación de partes móviles</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <BotonGuardar>Agregar</BotonGuardar>
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
        </ContenedorProveedor>
    );
};

//         <div>
//             <h1>Protocolos</h1>
//             {/* <Boton onClick={() => setEstadoModal(!estadoModal)}>Modal</Boton>
//             <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
//                 <Contenido>
//                     <h1>Ventana Modal</h1>
//                     <p>reutilizaba</p>
//                     <Boton onClick={() => setEstadoModal(!estadoModal)}>Aceptar</Boton>
//                 </Contenido>
//             </Modal> */}

//         </div>
//     );
// };

export default Protocolos;

// const Boton = styled.button`
// 	display: block;
// 	padding: 10px 30px;
// 	border-radius: 100px;
// 	color: #fff;
// 	border: none;
// 	background: #1766DC;
// 	cursor: pointer;
// 	font-family: 'Roboto', sans-serif;
// 	font-weight: 500;
// 	transition: .3s ease all;

// 	&:hover {
// 		background: #0066FF;
// 	}
// `

// const Contenido = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
// `