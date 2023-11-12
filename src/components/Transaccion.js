/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, limit,orderBy } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ListarProveedor, Titulo } from '../elementos/General';
import moment from 'moment';

const Transaccion = () => {
    const { users } = useContext(UserContext);
    const [cabecera, setCabecera] = useState([]);
    const [cabeceraOut, setCabeceraOut] = useState([]);

    // Leer datos de cabecera Entradas
    const getCabecera = async () => {
        const traerCabecera = collection(db, 'cabeceras');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
// Leer datos de cabecera Salidas
    const getCabeceraOut = async ()=>{
        const traerCabeceraOut = collection(db, 'cabecerasout');
        const dato = query(traerCabeceraOut, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabeceraOut(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    useEffect(() => {
        getCabecera();
        getCabeceraOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

   const OrdenaPorNumDoc = (a, b) => {
        return  b.date - a.date ;
    }
    

    const ordenado = cabecera.sort(OrdenaPorNumDoc);
    const ordenadoOut = cabeceraOut.sort(OrdenaPorNumDoc);

    return (
        <div>
            <ListarProveedor>
                <Titulo>Listado Ultimas Entradas</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ordenado.map((item, index) => {
                            if (item.confirmado === true) {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell >{index}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <ListarProveedor>
                <Titulo>Listado Ultimas Salidas</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Salida</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ordenadoOut.map((item, index) => {
                            if (item.confirmado === true) {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell >{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
        </div>
    );
};

export default Transaccion;