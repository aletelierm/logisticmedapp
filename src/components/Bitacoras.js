import React, { useState, useEffect } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import { ListarProveedor, Titulo } from '../elementos/General';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
// import { Link } from 'react-router-dom';
import { getDocs, collection, where, query } from 'firebase/firestore';
import moment from 'moment';
// import { PDFViewer } from '@react-pdf/renderer';
// import PDFContent from './PDFContent';
// import Swal from 'sweetalert2';

const Bitacoras = () => {

    //fecha hoy
    const fechaHoy = new Date();
    const { users } = useContext(UserContext);
    const [mantencion, setMantencion] = useState([])

    // Leer datos de cabecera Entradas
    const getBitacoras = async () => {
        const traerCabecera = collection(db, 'bitacoracab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMantencion(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const ejecutar = () => {
    //     Swal.fire('Check list de mantención');
    // }


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
                                    <Table.Cell textAlign="center">
                                        <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Visualizar en PDF' />
                                        {/* <PDFContent data={item} /> */}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
        </div>
    );
};

export default Bitacoras;