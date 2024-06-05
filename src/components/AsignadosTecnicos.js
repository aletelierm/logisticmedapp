import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import { ListarProveedor, Titulo, BotonGuardar } from '../elementos/General';
import { Contenido, Input } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { Table, TableBody } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import Modal from './Modal';
import * as MdIcons from 'react-icons/md';
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import EnviarCorreo from '../funciones/EnviarCorreo';

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
        const dato = query(traerAlertas, where('emp_id', '==', users.emp_id),where('tecnico','==',true));
        const data = await getDocs(dato);
        setAlertaOrdenIngreso(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    console.log(alertaOrdenIngreso);
    // Leer datos de cabecera Entradas
    const getIngresostcab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id), where('estado', '==', 'ASIGNADO'), where('tecnico', '==', users.correo));
        const data = await getDocs(dato)
        setAsignar(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    //Lee la orden de ingreso indicada por el ID 
    const leerDetalleIngreso = async (id) => {
        const traer = collection(db, 'ingresostdet');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setMostrarDet(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const leerTestIngreso = async (id) => {
        const traer = collection(db, 'testingreso');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setTestIngreso(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    testIngreso.sort((a, b) => a.fechamod - b.fechamod)

    //Ordenar fechas
    const asignarOrd = asignar.sort((a, b) => a.folio - b.folio);

    // Cerrar Asignación
    const cerrar = async (id, folio) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        leerDetalleIngreso(id)
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
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error a cerrar mantenimiento:', error
            })
        }       
        //Envia correo al administrador cuando usuario cierra una orden de ingreso
        try {
            alertaOrdenIngreso.forEach((destino) => {
                EnviarCorreo(destino.correo, 'Orden de ingreso Cerrada', `El Usuario ${users.correo} ha cerrado la orden N.${folio}.`)
            })
        } catch (error) {
            console.log('error', error)
        }
    }
    // console.log(cerrar)

    useEffect(() => {
        getIngresostcab();
        getAlertasOrdenIngreso();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        getIngresostcab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <div>
            <ListarProveedor>
                <Titulo>Asignados a {users.nombre + ' ' + users.apellido}</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                            <Table.HeaderCell /*style={{ textAlign: 'center' }}*/ >Ejecutar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.estado}</Table.Cell>
                                    <Table.Cell
                                        style={{ cursor: 'pointer' }}
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerDetalleIngreso(item.id)
                                            leerTestIngreso(item.id)
                                            setEstadoModal(!estadoModal)
                                        }}
                                    ><MdIcons.MdFactCheck style={{ fontSize: '26px', color: '#328AC4', cursor: 'pointer' }} /></Table.Cell>
                                    <Table.Cell style={{ textAlign: 'center' }} title='Cerrar' >
                                        <Link disabled to={`/ejecutarpresupuesto/${item.id}`}>
                                            <HiClipboardDocumentCheck style={{ fontSize: '26px', color: '#69080A', cursor: 'pointer', textAlign: 'center' }} /*onClick={() => cerrar(item.id)}*/ />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
                    {mostrarDet.length > 0 &&
                        <Contenido style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table singleLine>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Tipo</Table.HeaderCell>
                                        <Table.HeaderCell>Marca</Table.HeaderCell>
                                        <Table.HeaderCell>Modelo</Table.HeaderCell>
                                        <Table.HeaderCell>Serie</Table.HeaderCell>
                                        <Table.HeaderCell>Servicio</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body >
                                    {mostrarDet.map((item, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell style={{ fontSize: '13px' }}>{item.tipo}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.marca}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.modelo}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.serie}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.servicio}</Table.Cell>
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
            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </div>
    );
};

export default AsignadosTecnicos;