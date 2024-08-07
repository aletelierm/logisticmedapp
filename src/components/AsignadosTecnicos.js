import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc } from 'firebase/firestore';
import { ListarProveedor, Titulo, BotonGuardar, Contenedor } from '../elementos/General';
import { Contenido, Input } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
/* import { Link } from 'react-router-dom'; */
import { Table, TableBody } from 'semantic-ui-react'
import moment from 'moment';
import Modal from './Modal';
import * as MdIcons from 'react-icons/md';
// import { FaRegFilePdf } from "react-icons/fa";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import EnviarCorreo from '../funciones/EnviarCorreo';
import ReactDOMServer from 'react-dom/server';
// import TablaInfo from './TablaInfo';

const AsignadosTecnicos = () => {
    //fecha hoy
    const fechaHoy = new Date();
    const user = auth.currentUser;
    const { users } = useContext(UserContext);

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [asignar, setAsignar] = useState([]);
    const [estadoModal, setEstadoModal] = useState(false);
    const [mostrarDet, setMostrarDet] = useState(false);
    const [testIngreso, setTestIngreso] = useState([]);
    const [alertaOrdenIngreso, setAlertaOrdenIngreso] = useState([]);  
    const [flag, setFlag] = useState(false);

    //Lectura de usuario para alertas de ST-Asignados
    const getAlertasOrdenIngreso = async () => {
        const traerAlertas = collection(db, 'usuariosalertas');
        const dato = query(traerAlertas, where('emp_id', '==', users.emp_id), where('tecnico', '==', true));
        const data = await getDocs(dato);
        setAlertaOrdenIngreso(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    // Leer datos de cabecera Entradas
    const getIngresostcab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id), where('estado', '==', 'ASIGNADO'), where('tecnico', '==', users.correo));
        const data = await getDocs(dato)
        setAsignar(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    const mantoprev = asignar.filter(mp => mp.servicio === 'MANTENCION PREVENTIVA');
    const asignarOrdmp = mantoprev.sort((a, b) => a.folio - b.folio);
    const presu = asignar.filter(p => p.servicio === 'PRESUPUESTO');
    const asignarOrdp = presu.sort((a, b) => a.folio - b.folio);
    const evaluacion = asignar.filter(e => e.servicio === 'EVALUACION Y DIAGNOSTICO');
    const asignarOrde = evaluacion.sort((a, b) => a.folio - b.folio);
    
     
    // // Detalle de Ingreso de equipo => Funcional
    // const consultarPresupuestoCab = async () => {
    //     const pre = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id), where('confirmado', '==', true));
    //     const presu = await getDocs(pre);
    //     const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //     setPresupuestoCab(existePresupuesto);
    //     id_cab_pre.current = existePresupuesto[0].id;
    // }

    // Leer datos de cabecera Entradas
    const leerIngresoCab = async (id) => {
        const docum = asignar.filter(leer => leer.id === id);
        setMostrarDet(docum);
    }
    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        return formatear;
    }
    const leerTestIngreso = async (id) => {
        const traer = collection(db, 'testingreso');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setTestIngreso(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    testIngreso.sort((a, b) => a.fechamod - b.fechamod)
    // Cerrar Asignación
    const cerrar = async (id, folio) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        try {
            await updateDoc(doc(db, 'ingresostcab', id), {
                estado: 'CERRADO',
                usermod: user.email,
                fecha_out: fechaHoy
            });
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Cierre realizado correctamente'
            })
            setFlag(!flag);
            //Envia correo al administrador cuando usuario cierra una orden de ingreso
            try {
                const msj = asignar.filter(fol => fol.folio === folio);
                const mensaje = cuerpoCorreo(msj)
                alertaOrdenIngreso.forEach((destino) => {
                    EnviarCorreo(destino.correo, 'Orden de ingreso Cerrada',mensaje)
                })
            } catch (error) {
                console.log('error', error)
            }
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al cerrar mantenimiento:', error
            })
        }
    }

    useEffect(() => {
        getIngresostcab();
        getAlertasOrdenIngreso();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        getIngresostcab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    const cuerpoCorreo = (data) => {
        return ReactDOMServer.renderToString(
            <div style={{ backgroundColor: '#EEF2EF', textAlign: 'center', padding: '40px' }}>
                <div style={{ backgroundColor: '#3A9A9D', fontSize: '20px' }}>
                    <h2 style={{ color: '#ffffff' }}>El Usuario {users.nombre} {users.apellido} ha cerrado la orden N° {data[0].folio}</h2>
                </div>
                <br />
                <div style={{backgroundColor: '#EAF1FB'}}>
                    {/* Informacion Cliente */}
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>
                        <table style={{ borderCollapse: 'collapse', border: '4px solid #C8C8C8', letterSpacing: '1px', fontSize: '0.8rem', display: 'inline' }}>
                            <caption style={{ padding: '10px', fontSize: '22px' }}>Informacion Cliente</caption>
                            <thead>
                                <tr>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Rut</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Nombre</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Fecha</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Telefono</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Direccion</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Correo</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '90%' }}>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.rut}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.entidad}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{formatearFecha(item.date)}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.telefono}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.direccion}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.correo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    {/* Informacion Equipo */}
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>
                        <table style={{ borderCollapse: 'collapse', border: '4px solid #C8C8C8', letterSpacing: '1px', fontSize: '0.8rem', display: 'inline' }}>
                            <caption style={{ padding: '10px', fontSize: '22px' }}>Informacion Equipo</caption>
                            <thead>
                                <tr>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Familia</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Tipo Equipamiento</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Marca</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Modelo</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Serie</th>
                                    <th style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#EBEBEB' }}>Servicio</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '90%' }}>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.familia}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.tipo}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.marca}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.modelo}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5' }}>{item.serie}</td>
                                        <td style={{ border: '4px solid #BEBEBE', padding: '10px 20px', backgroundColor: '#F5F5F5', color: 'red' }}>{item.servicio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />
                    {/* Observaciones */}
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>
                        <p>Observaciones : {data[0].observaciones}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Contenedor>
                <Titulo>Asignados a {users.nombre + ' ' + users.apellido}</Titulo>
            </Contenedor>
            {/* Lista de Mantenciones Preventivas */}
            <ListarProveedor>
                <Titulo>Mantención Preventiva</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha de Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrdmp.map((item, index) => {
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
                                        style={{ cursor: 'pointer' }}
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerIngresoCab(item.id);
                                            leerTestIngreso(item.id)
                                            setEstadoModal(!estadoModal)
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '26px', color: '#328AC4', cursor: 'pointer' }} /></Table.Cell>
                                    <Table.Cell style={{ textAlign: 'center' }} title='Cerrar' >
                                        <HiClipboardDocumentCheck style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} onClick={() => cerrar(item.id, item.folio)} />
                                    </Table.Cell>
                                    {/* <Table.Cell style={{ textAlign: 'center' }} onClick={() => ejecutar()} title="Ejecutar Mantención">
                                        <Link disabled to={`/ejecutarmantencionst/${item.id}`}>
                                            <MdIcons.MdPlayCircle style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} />
                                        </Link>
                                    </Table.Cell> */}
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>

            {/* Lista de Presupuestos */}
            <ListarProveedor>
                <Titulo>Presupuestos</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha de Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                            {/* <Table.HeaderCell>Generar</Table.HeaderCell> */}
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
                            {/* <Table.HeaderCell>PDF</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrdp.map((item, index) => {
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
                                        style={{ cursor: 'pointer' }}
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerIngresoCab(item.id);
                                            leerTestIngreso(item.id)
                                            setEstadoModal(!estadoModal)
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '26px', color: '#328AC4', cursor: 'pointer' }} /></Table.Cell>
                                    {/* <Table.Cell style={{ textAlign: 'center' }} title='Generar Presupuesto'>
                                        <Link disabled to={`/presupuesto/${item.id}/1`}>
                                            <HiClipboardDocumentCheck style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} />
                                        </Link>
                                    </Table.Cell> */}
                                    {/* <Table.Cell style={{ textAlign: 'center' }} title='Ejecutar Presupuesto'></Table.Cell> */}
                                    <Table.Cell style={{ textAlign: 'center' }} title='Cerrar' >
                                        <HiClipboardDocumentCheck style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} onClick={() => cerrar(item.id, item.folio)} />
                                    </Table.Cell>
                                    {/* <Table.Cell style={{ textAlign: 'center' }} title='Descargar Presupuesto'>
                                        <Link disabled to={`/presupuesto/${item.id}/2`} >
                                            <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Ver Orden de Ingreso' />
                                        </Link>
                                    </Table.Cell> */}
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>

            {/* Lista de Evaluaciones y Diagnsticos */}
            <ListarProveedor>
                <Titulo>Evaluacion y Diagnostico</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha de Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrde.map((item, index) => {
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
                                        style={{ cursor: 'pointer' }}
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerIngresoCab(item.id);
                                            leerTestIngreso(item.id)
                                            setEstadoModal(!estadoModal)
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '26px', color: '#328AC4', cursor: 'pointer' }} /></Table.Cell>
                                    <Table.Cell style={{ textAlign: 'center' }} title='Cerrar' >
                                        <HiClipboardDocumentCheck style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} onClick={() => cerrar(item.id, item.folio)} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>

            <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
                {mostrarDet.length > 0 &&
                    <Contenido style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Table singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>N°Orden</Table.HeaderCell>
                                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Telefono</Table.HeaderCell>
                                    <Table.HeaderCell>Dirección</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body >
                                {mostrarDet.map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.folio}</Table.Cell>
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
                            {mostrarDet.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell style={{ fontSize: '13px' }}>Observaciones : {item.observaciones}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
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
                                                checked={item.valorsi} ></Input></Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}><Input type='checkbox'
                                                checked={item.valorno}></Input></Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <BotonGuardar onClick={() => setEstadoModal(!estadoModal)}>Aceptar</BotonGuardar>
                    </Contenido>
                }
            </Modal>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div>
    );
};

export default AsignadosTecnicos;