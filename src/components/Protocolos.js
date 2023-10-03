/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
// import EntradasDB from '../firebase/EntradasDB'
// import CabeceraInDB from '../firebase/CabeceraInDB'
import Alertas from './Alertas';
// import Modal from './Modal';
// import styled from 'styled-components';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
// import { FaRegEdit } from "react-icons/fa";
// import { BiAddToQueue } from "react-icons/bi";
import { Programa } from './TipDoc'
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, Boton, BotonGuardar } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Select, Formulario, Input, Label } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
// import Swal from 'sweetalert2';

const Protocolos = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    // const [estadoModal, setEstadoModal] = useState(false);
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familia, setFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [nomPrograma, setNomPrograma] = useState('');
    const [nomProtocolo, setNomProtocolo] = useState('');

    //Leer los datos de Familia
    const getFamilia = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setFamilia(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Tipos
    const getTipo = async () => {
        const traerTip = collection(db, 'tipos');
        const dato = query(traerTip, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setTipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    // Ordenar Listado por Familia
    familia.sort((a, b) => {
        const nameA = a.familia;
        const nameB = b.familia;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    // Ordenar Listado por Tipo
    tipo.sort((a, b) => {
        const nameA = a.tipo;
        const nameB = b.tipo;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    useEffect(() => {
        getFamilia();
        getTipo();
        // getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Crear Protocolos</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Familia</Label>
                            <Select
                                // disabled={confirmar}
                                value={nomFamilia}
                                onChange={ev => setNomFamilia(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {familia.map((d) => {
                                    return (<option key={d.id}>{d.familia}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Equipamiento</Label>
                            <Select
                                // disabled={confirmar}
                                value={nomTipo}
                                onChange={ev => setNomTipo(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {tipo.map((d) => {
                                    return (<option key={d.id}>{d.tipo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Programa</Label>
                            <Select
                                // disabled={confirmar}
                                value={nomPrograma}
                                onChange={ev => setNomPrograma(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {Programa.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenMov>

                    <BotonGuardar
                        style={{ margin: '10px 10px' }}
                    // onClick={addCabeceraIn}
                    // checked={confirmar}
                    // onChange={handleCheckboxChange}
                    // disabled={btnGuardar}
                    >
                        Guardar</BotonGuardar>
                    <BotonGuardar
                        style={{ margin: '10px 0' }}
                    // onClick={nuevo}
                    // checked={confirmar}
                    // onChange={handleCheckboxChange}
                    // disabled={btnNuevo}
                    >
                        Nuevo</BotonGuardar>
                </Formulario>
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