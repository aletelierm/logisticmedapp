import React, { useState, useEffect } from 'react';
import { ListarProveedor, Titulo, ConfirmaModal, ConfirmaBtn, Boton2, Overlay } from '../elementos/General';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
// import { Link } from 'react-router-dom';
import { getDocs, collection, where, query } from 'firebase/firestore';
import moment from 'moment';
import * as MdIcons from 'react-icons/md';
// import Swal from 'sweetalert2';

const ListadoMant = () => {
    //fecha hoy
    const fechaHoy = new Date();

    const { users } = useContext(UserContext);
    const [mantencion, setMantencion] = useState([]);
    // const [status, setStatus] = useState([]);
    const [modal, setModal] = useState(false);
    const [modalST, setModalST] = useState(false);

    // Leer datos de cabecera Entradas
    const getMantenimiento = async () => {
        const traerCabecera = collection(db, 'mantenciones');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMantencion(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    // // Leer datos de cabecera Entradas
    // const getStatus = async () => {
    //     const traer = collection(db, 'status');
    //     const dato = query(traer, where('emp_id', '==', users.emp_id));
    //     const data = await getDocs(dato)
    //     setStatus(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    // }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        console.log(fechaHoyF + " es menor que ? " + formatear, fechaHoy < dateObj)
        return formatear;
    }
    //Ordenar fechas
    const manteOrd = mantencion.sort((a, b) => a.fecha_termino - b.fecha_termino)

    useEffect(() => {
        getMantenimiento();
        // getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div>
            <ListarProveedor>
                <Titulo>Listado de Mantenciones</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Protocolo</Table.HeaderCell>
                            <Table.HeaderCell>Plan días</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Inicio</Table.HeaderCell>
                            <Table.HeaderCell>F.Prox.Mantenión</Table.HeaderCell>
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {manteOrd.map((item, index) => {
                            // const statusST = status.filter(st => st.serie === item.serie && st.status === 'SERVICIO TECNICO').length === 1;
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{item.nombre_protocolo}</Table.Cell>
                                    <Table.Cell>{item.dias}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fecha_inicio)}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fecha_termino)}</Table.Cell>
                                    {
                                        item.fecha_termino.toDate().setHours(0, 0, 0, 0) <= fechaHoy.setHours(0, 0, 0, 0) ?
                                            // statusST === true ?
                                            //     <Table.Cell style={{ textAlign: 'center' }} /* onClick={() => ejecutar()} */ title="Ejecutar Mantención">
                                            //         <Link disabled to={`/ejecutarmantencion/${item.id}`}>
                                            //             <MdIcons.MdPlayCircle style={{ fontSize: '20px', color: item.fecha_termino.toDate().setHours(0, 0, 0, 0) <= fechaHoy.setHours(0, 0, 0, 0) ? 'red' : 'green', cursor: 'pointer' }} />
                                            //         </Link>
                                            //     </Table.Cell>
                                            //     :
                                            //     <Table.Cell style={{ textAlign: 'center' }} title="Ejecutar Mantención">
                                            //         <MdIcons.MdPlayCircle
                                            //             style={{ fontSize: '20px', color: item.fecha_termino.toDate().setHours(0, 0, 0, 0) <= fechaHoy.setHours(0, 0, 0, 0) ? 'red' : 'green', cursor: 'pointer' }}
                                            //             onClick={() => setModalST(true)}
                                            //         />
                                            //     </Table.Cell>
                                            <Table.Cell style={{ textAlign: 'center' }} /* onClick={() => ejecutar()} */ title="Ejecutar Mantención">
                                                <MdIcons.MdPlayCircle style={{ fontSize: '20px', color: item.fecha_termino.toDate().setHours(0, 0, 0, 0) <= fechaHoy.setHours(0, 0, 0, 0) ? 'red' : 'green', cursor: 'pointer' }} />
                                            </Table.Cell>
                                            :
                                            <Table.Cell style={{ textAlign: 'center' }} title="Ejecutar Mantención">
                                                <MdIcons.MdPlayCircle
                                                    style={{ fontSize: '20px', color: item.fecha_termino.toDate().setHours(0, 0, 0, 0) <= fechaHoy.setHours(0, 0, 0, 0) ? 'red' : 'green', cursor: 'pointer' }}
                                                    onClick={() => setModal(true)}
                                                />
                                            </Table.Cell>
                                    }
                                    </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            {
                modal && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¡Este equipo no esta disponible para Ejecutar Mantención!</h2>
                            <ConfirmaBtn style={{ justifyContent: 'center' }} className="confirmation-buttons">
                                <Boton2 onClick={() => setModal(false)}>Aceptar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
            {
                modalST && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¡Este equipo no se encuentra en Servicio Tecnico!</h2>
                            <ConfirmaBtn style={{ justifyContent: 'center' }} className="confirmation-buttons">
                                <Boton2 onClick={() => setModalST(false)}>Aceptar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
        </div>
    );
};

export default ListadoMant;