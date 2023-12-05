/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import ExportarExcel from '../funciones/ExportarExcel';
import * as FaIcons from 'react-icons/fa';
import { Contenedor, ListarProveedor, Titulo, ContentElemenAdd } from '../elementos/General'
import { ContentElemenMov, Input } from '../elementos/CrearEquipos'

//Reporte Status Equipos
const Reporte2 = () => {
    const [estado, setEstado] = useState([]);
    const [buscador, setBuscardor] = useState('');
    //lee usuario de autenticado y obtiene fecha actual   
    const { users } = useContext(UserContext);

    //Leer los datos de Status
    const getStatus = async () => {
        const traerStatus = collection(db, 'status');
        const dato = query(traerStatus, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEstado(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    useEffect(() => {
        getStatus();
    }, [])

    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }

    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setBuscardor(target.value)
    }
    
    function ordenar(a, b) {
        // Primero, comparar por Status
        const statusA = a.status;
        const statusB = b.status;
        if (statusA < statusB) {
            return -1;
        }
        if (statusA > statusB) {
            return 1;
        }
        // Si los Status son iguales, comparar por Entidad
        const nameA = a.entidad;
        const nameB = b.entidad;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // Si las Entidad son iguales, no se cambia el orden
        return 0;
    }
    // Ordenar el arreglo de objetos por múltiples campos
    estado.sort(ordenar);

    const filtro = () => {
        const nuevoFiltro = estado.filter(r => r.rut.includes(buscador))
        return nuevoFiltro;
    }

    //agrega campo fecha formateado para exportar
    const fecha = filtro().map((doc) => ({ ...doc, fecha: formatearFecha(doc.fechamod) }))
    //Exportar a excel los equipos
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['tipo', 'marca', 'modelo', 'status', 'serie', 'rut', 'entidad', 'fecha']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(fecha, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'status.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorReporte >
            <Contenedor>
                <Titulo>Estados de los Equipos</Titulo>
            </Contenedor>
            <ListarProveedor>
                <ContentElemenMov>
                    <Titulo>Listado de Dispositivos Médicos</Titulo>
                </ContentElemenMov>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} title='Buscar Equipos' />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder={'Buscar Rut'}
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Equipos a Excel' />
                </ContentElemenAdd>

                <Table singleLine style={{ fontSize: '13px' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            {/* <Table.HeaderCell>Nombre Equipo</Table.HeaderCell> */}
                            <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                            {/* <Table.HeaderCell>Marca</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell> */}
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Precio</Table.HeaderCell>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            {/* <Table.HeaderCell>Precio</Table.HeaderCell> */}
                            {/* <Table.HeaderCell>Estado</Table.HeaderCell> */}
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            filtro().map((item, index) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        {/* <Table.Cell>{item.tipo + " - " + item.marca + "  - " + item.modelo}</Table.Cell> */}
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.tipo}</Table.Cell>
                                        {/* <Table.Cell>{item.marca}</Table.Cell>
                                        <Table.Cell>{item.modelo}</Table.Cell> */}
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.price}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>
                                        <Table.Cell>{item.status}</Table.Cell>
                                        {/* <Table.Cell>{item.price}</Table.Cell> */}
                                        {/* <Table.Cell>{item.tipoinout}</Table.Cell> */}
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.entidad}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.fechamod)}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </ListarProveedor>
        </ContenedorReporte>
    );
};

export default Reporte2;
const ContenedorReporte = styled.div``