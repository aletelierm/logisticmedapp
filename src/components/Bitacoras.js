import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { FaRegFilePdf } from "react-icons/fa";
import { ListarProveedor, Titulo, Subtitulo, Boton2 } from '../elementos/General';
import { Contenido } from '../elementos/CrearEquipos'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import Modal from './Modal';
import moment from 'moment';
// import Swal from 'sweetalert2';

const Bitacoras = () => {

    //fecha hoy
    const fechaHoy = new Date();
    const { users } = useContext(UserContext);

    const [mantencion, setMantencion] = useState([]);
    const [estadoModal, setEstadoModal] = useState(false);
    const [itemsCheck, setItemsCheck] = useState([]);
    const [itemsMedicion, setItemsMedicion] = useState([]);
    const [itemsSeg, setItemsSeg] = useState([]);

    console.log(itemsSeg);

    // Leer datos de cabecera Entradas
    const getBitacoras = async () => {
        const traerCabecera = collection(db, 'bitacoracab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMantencion(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Detalle de Bitacoras por categoria
    const consultarBitacoras = async (id) => {
        const docCheck = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'CHECK'));
        const docuCheck = await getDocs(docCheck);
        const documenCheck = (docuCheck.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsCheck(documenCheck);

        const docLlen = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'MEDICION'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsMedicion(documenLlen);

        const docSel = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'SEGURIDAD'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsSeg(documenSel);
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        console.log(fechaHoyF + " es menor que ? " + formatear, fechaHoy < dateObj)
        return formatear;
    }
    //Ordenar fechas
    const manteOrd = mantencion.sort((a, b) => a.fecha_mantencion - b.fecha_mantencion)

    useEffect(() => {
        getBitacoras();
        consultarBitacoras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <ListarProveedor>
                <Titulo>Bitacoras</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Protocolo</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Mantención</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {manteOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{item.nombre_protocolo}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fecha_mantencion)}</Table.Cell>
                                    <Table.Cell textAlign="center"
                                        // title='Ver Chec List de Mantencion'
                                        // onClick={() => {
                                            // consultarBitacoras(item.id);
                                            // setEstadoModal(!estadoModal)
                                        // }} 
                                        >
                                        {/* <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Visualizar en PDF' title='Ver Chec List de Mantencion' /> */}
                                        <Link disabled to={`/checkmantencion/${item.id}`}>
                                        
                                        <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} /* title='Visualizar en PDF' */ title ='Ver Chec List de Mantencion' />
                                        </Link>
                                        {/* <PDFContent data={item} /> */}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>

                <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
                    {mantencion.length > 0 ?
                        <Contenido>
                            {/* Contenido del cliente */}
                            <Subtitulo>Identificacion del equipo Médicos</Subtitulo>
                            <Table singleLine>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Cliente</Table.HeaderCell>
                                        <Table.HeaderCell>Tipo de equipo</Table.HeaderCell>
                                        <Table.HeaderCell>Marca</Table.HeaderCell>
                                        <Table.HeaderCell>Modelo</Table.HeaderCell>
                                        <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                        <Table.HeaderCell>Fecha de Revision</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {manteOrd.map((item, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{users.empresa}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{item.tipo}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >Marca</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >Modelo</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{item.serie}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{formatearFecha(item.fecha_mantencion)}</Table.Cell>

                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                            {/* Detalle de bitacora Checks */}
                            <Subtitulo>Protocolo de Mantencion</Subtitulo>
                            {itemsCheck.length === 0 ?
                                ''
                                :
                                <>
                                    <Table singleLine>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>N°</Table.HeaderCell>
                                                <Table.HeaderCell>item</Table.HeaderCell>
                                                <Table.HeaderCell>Resultado</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {itemsCheck.map((item, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell>{index + 1}</Table.Cell>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{item.item}</Table.Cell>
                                                        <Table.Cell style={{ textAlign: 'center' }} >{item.valor}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table>
                                    <p>** Pruebas realiadas con Pulmón artificial, IMTMEDICAL EASYLUNG **</p>
                                </>
                            }
                            {/* Detalle de bitacora Tabla de presion */}
                            {itemsMedicion.length === 0 ?
                                ''
                                :
                                <>
                                    <Table singleLine>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Item</Table.HeaderCell>
                                                <Table.HeaderCell>Medicion</Table.HeaderCell>
                                                <Table.HeaderCell>Rango Ref.</Table.HeaderCell>
                                                <Table.HeaderCell>Test</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {itemsMedicion.map((item, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                                        <Table.Cell  >{item.valor}</Table.Cell>
                                                        <Table.Cell>Por definir</Table.Cell>
                                                        <Table.Cell>Por definir</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table>
                                    <p>** Medición efectuada con flujometro digital CITREX H4 IMTMEDICAL **</p>
                                </>
                            }
                            <Boton2 onClick={() => setEstadoModal(!estadoModal)}>Aceptar</Boton2>
                        </Contenido>
                        :
                        ''
                    }
                </Modal>
            </ListarProveedor>
        </div>
    );
};

export default Bitacoras;