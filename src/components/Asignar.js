import React, { useState, useEffect } from 'react';
import { ListarProveedor, Titulo, BotonGuardar, Overlay, ConfirmaModal, Subtitulo } from '../elementos/General';
import { Contenido, Input, ContentElemen, Formulario, Select, Label } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table, TableBody } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import styled from 'styled-components';
import Alertas from './Alertas';
import EnviarCorreo from '../funciones/EnviarCorreo';
import { getDocs, collection, where, query, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FaRegFilePdf } from "react-icons/fa";
import moment from 'moment';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
// import TablaInfo from './TablaInfo';
import ReactDOMServer from 'react-dom/server';

const Asignar = () => {
    //fecha hoy
    const fechaHoy = new Date();

    const { users } = useContext(UserContext);
    const [asignar, setAsignar] = useState([]);
    const [asignados, setAsignados] = useState([]);
    const [cerrados, setCerrados] = useState([]);
    const [mostrarDet, setMostrarDet] = useState([]);
    const [testIngreso, setTestIngreso] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [idCabIngreso, setIdCabIngreso] = useState(null)
    const [openModalCli, setOpenModalCli] = useState(false);
    const [tecnico, setTecnico] = useState('')
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [flag, setFlag] = useState(false);
    const [tituloModal, setTituloModal] = useState('');
    const [mostrarSelec, setMostrarSelec] = useState(false);

    // Leer datos de cabecera Ingresados
    const getIngresostcab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id), where('estado', '==', 'INGRESADO'));
        const data = await getDocs(dato)
        setAsignar(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Leer datos de cabecera Asignados
    const getAsignadoscab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id), where('estado', '==', 'ASIGNADO'));
        const data = await getDocs(dato)
        setAsignados(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Leer datos de cabecera Cerrados
    const getCerradoscab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id), where('estado', '==', 'CERRADO'));
        const data = await getDocs(dato)
        setCerrados(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    // Leer datos de cabecera Entradas
    const leerIngresoCab = async (id, indice) => {
        if (indice === 1) {
            const docum = asignar.filter(leer => leer.id === id);
            setMostrarDet(docum);
        } else if (indice === 2) {
            const docum = asignados.filter(leer => leer.id === id);
            setMostrarDet(docum);
        } else {
            const docum = cerrados.filter(leer => leer.id === id);
            setMostrarDet(docum);
        }

    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        /*  const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
         console.log(fechaHoyF + " es menor que ? " + formatear, fechaHoy < dateObj) */
        return formatear;
    }

    const leerTestIngreso = async (id) => {
        const traer = collection(db, 'testingreso');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setTestIngreso(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    testIngreso.sort((a, b) => a.fechamod - b.fechamod)

    const leerUsuarios = async () => {
        const traer = collection(db, 'usuarios');
        const doc = query(traer, where('emp_id', '==', users.emp_id));
        const documento = await getDocs(doc)
        setUsuarios(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Ordenar x folio
    const asignarOrd = asignar.sort((a, b) => a.folio - b.folio)
    const asignadosOrd = asignados.sort((a, b) => a.folio - b.folio)
    const cerradosOrd = cerrados.sort((a, b) => a.folio - b.folio)


    //Funcion handlesubmit para validar y asignar
    const asignarUsuario = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (tecnico.length === 0 || tecnico === 'Selecciona Tecnico:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor seleccione un usuario'
            })
            return;
        } else {
            try {
                await updateDoc(doc(db, 'ingresostcab', idCabIngreso), {
                    tecnico: tecnico,
                    estado: 'ASIGNADO',
                    fechamod: fechaHoy
                });
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Usuario Asignado correctamente'
                })
                //Envío de correo cuando se asigna un tecnico
                try {
                    EnviarCorreo(tecnico, 'Asignación de Orden de Ingreso', `Se le ha asignado la orden de ingreso N. ${mostrarDet[0].folio}`)
                    // const mensaje = cuerpoCorreo(asignar);
                    // EnviarCorreo(tecnico, 'Asignación de Orden de Ingreso', `Se le ha asignado la orden de ingreso N. ${mostrarDet[0].folio}`, mensaje)
                } catch (error) {
                    console.log('error', error)
                }
                setFlag(!flag);
                setOpenModalCli(!openModalCli);
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al actualizar el usuario tecnico:', error
                })
            }

        }
    }

    // const cuerpoCorreo = (asignar) => {
    //     console.log(asignar)
    //     return ReactDOMServer.renderToString(
    //         <div style={{ backgroundColor: '#EEF2EF' }}>
    //             <TablaInfo  ingreso={asignar}/>
    //         </div>
    //     )
    // }

    // const cuerpoCorreo = (data) => {
    //     return ReactDOMServer.renderToString(
    //         <div style={{ backgroundColor: '#EEF2EF' }}>
    //             {/* Informacion Cliente */}
    //             <Subtitulo style={{ fontSize: '18px' }}>Informacion Cliente</Subtitulo>
    //             <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
    //                 <Table.Header>
    //                     <Table.Row>
    //                         <Table.HeaderCell>Folio</Table.HeaderCell>
    //                         <Table.HeaderCell>Rut</Table.HeaderCell>
    //                         <Table.HeaderCell>Nombre</Table.HeaderCell>
    //                         <Table.HeaderCell>Fecha</Table.HeaderCell>
    //                         <Table.HeaderCell>Telefono</Table.HeaderCell>
    //                         <Table.HeaderCell>Dirección</Table.HeaderCell>
    //                         <Table.HeaderCell>Email</Table.HeaderCell>
    //                     </Table.Row>
    //                 </Table.Header>
    //                 <Table.Body>
    //                     {data.map((item, index) => {
    //                         return (
    //                             <Table.Row key={index}>
    //                                 <Table.Cell>{item.folio}</Table.Cell>
    //                                 <Table.Cell>{item.rut}</Table.Cell>
    //                                 <Table.Cell>{item.nombre}</Table.Cell>
    //                                 <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
    //                                 <Table.Cell>{item.telefono}</Table.Cell>
    //                                 <Table.Cell>{item.direccion}</Table.Cell>
    //                                 <Table.Cell>{item.correo}</Table.Cell>
    //                             </Table.Row>
    //                         )
    //                     })}
    //                 </Table.Body>
    //             </Table>

    //             {/* Informacion Equipo */}
    //             <Subtitulo style={{ fontSize: '18px' }}>Informacion Equipo</Subtitulo>
    //             <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
    //                 <Table.Header>
    //                     <Table.Row>
    //                         <Table.HeaderCell>Familia</Table.HeaderCell>
    //                         <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
    //                         <Table.HeaderCell>Marca</Table.HeaderCell>
    //                         <Table.HeaderCell>Modelo</Table.HeaderCell>
    //                         <Table.HeaderCell>Serie</Table.HeaderCell>
    //                         <Table.HeaderCell>Servicio</Table.HeaderCell>
    //                     </Table.Row>
    //                 </Table.Header>
    //                 <Table.Body>
    //                     {data.map((item, index) => {
    //                         return (
    //                             <Table.Row key={index}>
    //                                 <Table.Cell>{item.familia}</Table.Cell>
    //                                 <Table.Cell>{item.tipo}</Table.Cell>
    //                                 <Table.Cell>{item.marca}</Table.Cell>
    //                                 <Table.Cell>{item.modelo}</Table.Cell>
    //                                 <Table.Cell>{item.serie}</Table.Cell>
    //                                 <Table.Cell>{item.servicio}</Table.Cell>
    //                             </Table.Row>
    //                         )
    //                     })}
    //                 </Table.Body>
    //             </Table>
    //             {/* Observaciones */}
    //             <Table>
    //                 {data.map((item, index) => {
    //                     return (
    //                         <Table.Row key={index}>
    //                             <Table.Cell style={{ fontSize: '13px' }}>Observaciones : {item.observaciones}</Table.Cell>
    //                         </Table.Row>
    //                     )
    //                 })}
    //             </Table>
    //         </div>
    //     )
    // }

    useEffect(() => {
        getIngresostcab();
        leerUsuarios();
        getAsignadoscab();
        getCerradoscab();
        getAsignadoscab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        getIngresostcab();
        getAsignadoscab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    console.log(asignadosOrd)
    return (
        <div>
            <ListarProveedor>
                <Titulo>Asignar Ingresos</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N.Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.modelo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell style={{ color: 'red' }}>{item.servicio}</Table.Cell>
                                    <Table.Cell
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            setIdCabIngreso(item.id);
                                            leerIngresoCab(item.id, 1);
                                            leerTestIngreso(item.id)
                                            setOpenModalCli(!openModalCli);
                                            setTituloModal('Asignar Ingreso');
                                            setMostrarSelec(true);
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <ListarProveedor>
                <Titulo>Asignados</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Asignación</Table.HeaderCell>
                            <Table.HeaderCell>Tecnico Asignado</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                            <Table.HeaderCell>Ver PDF</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignadosOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.modelo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{item.servicio}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fechamod)}</Table.Cell>
                                    <Table.Cell>{usuarios.map((user, index) => (
                                        user.correo === item.tecnico && (
                                            <h5 key={index}>{user.nombre} {user.apellido}</h5>
                                        )
                                    )
                                    )}</Table.Cell>
                                    <Table.Cell
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerTestIngreso(item.id)
                                            leerIngresoCab(item.id, 2);
                                            setOpenModalCli(!openModalCli)
                                            setTituloModal('Detalle de Ingreso')
                                            setMostrarSelec(false);
                                        }}
                                    >
                                        <MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                    <Table.Cell >
                                        <Link disabled to={`/ingresopdf/${item.id}`}>
                                            <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Ver Orden de Ingreso' />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>

            <ListarProveedor>
                <Titulo>Cerrados</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Cierre</Table.HeaderCell>
                            <Table.HeaderCell>Tecnico Asignado</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cerradosOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.modelo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fecha_out)}</Table.Cell>
                                    <Table.Cell>{usuarios.map((user) => (
                                        user.correo === item.tecnico && (
                                            <h5>{user.nombre} {user.apellido}</h5>
                                        )
                                    )
                                    )}</Table.Cell>
                                    <Table.Cell
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerTestIngreso(item.id)
                                            leerIngresoCab(item.id, 3);
                                            setOpenModalCli(!openModalCli)
                                            setTituloModal('Detalle de Ingreso')
                                            setMostrarSelec(false);
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            {openModalCli && (
                <Overlay>
                    <ConfirmaModal>
                        <Titulo>{tituloModal}</Titulo>
                        <BotonCerrar onClick={() => setOpenModalCli(!openModalCli)}><IoIcons.IoMdClose /></BotonCerrar>
                        <Formulario action='' style={{ maxHeight: '600px', overflowY: 'auto' }} >
                            <ContentElemen>
                                <Contenido /* style={{ maxHeight: '400px', overflowY: 'auto' }} */>
                                    <Table singleLine>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>N°Orden</Table.HeaderCell>
                                                <Table.HeaderCell>Rut</Table.HeaderCell>
                                                <Table.HeaderCell>Cliente</Table.HeaderCell>
                                                <Table.HeaderCell>Telefono</Table.HeaderCell>
                                                <Table.HeaderCell>Direccion</Table.HeaderCell>
                                                <Table.HeaderCell>Email</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body >
                                            {mostrarDet.map((item, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.folio}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.rut}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.entidad}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.telefono}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.direccion}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.correo}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table>
                                    <Table>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>N</Table.HeaderCell>
                                                <Table.HeaderCell>Item Test</Table.HeaderCell>
                                                <Table.HeaderCell>Si</Table.HeaderCell>
                                                <Table.HeaderCell>No</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <TableBody>
                                            {testIngreso.map((item, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell style={{ fontSize: '13px' }}>{index + 1}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.item}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}><Input type='checkbox'
                                                            checked={item.valorsi} readOnly></Input></Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}><Input type='checkbox'
                                                            checked={item.valorno} readOnly></Input></Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Table>
                                        {mostrarDet.map((item, index) => {
                                            return (
                                                <Table.Row key={index}>
                                                    <Table.Cell style={{ fontSize: '13px' }}>Observaciones : {item.observaciones}</Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Table>
                                    {/* <BotonGuardar onClick={() => setEstadoModal(!estadoModal)}>Aceptar</BotonGuardar> */}
                                </Contenido>
                            </ContentElemen>
                            {
                                mostrarSelec && (
                                    <ContentElemen>
                                        <Label>Seleccionar Usuario:</Label>
                                        <Select value={tecnico} onChange={e => setTecnico(e.target.value)} >
                                            <option>Selecciona Tecnico:</option>
                                            {usuarios.map((objeto, index) => {
                                                return (<option key={index}>{objeto.nombre} {objeto.apellido}</option>)
                                                // return (<option key={index}>{objeto.correo}</option>)
                                            })}
                                        </Select>
                                        <BotonGuardar onClick={asignarUsuario} >Asignar</BotonGuardar>
                                    </ContentElemen>
                                )
                            }
                        </Formulario>
                    </ConfirmaModal>
                </Overlay>
            )}
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div>
    );
};

export default Asignar;

const BotonCerrar = styled.button`
    position: absolute;
    top:20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all.3s ease all;
    border-radius: 5px;
    color: #1766DC;

    &:hover{
        background: #f2f2f2;
    }
`