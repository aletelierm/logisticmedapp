/* eslint-disable react-hooks/exhaustive-deps */
import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import ExportarExcel from '../funciones/ExportarExcel';
import * as FaIcons from 'react-icons/fa';
import {Contenedor, ListarProveedor, Titulo} from '../elementos/General'
import {ContentElemenMov} from '../elementos/CrearEquipos'

const Reporte2 = () => {

    const [estado, setEstado] = useState([]);
    //lee usuario de autenticado y obtiene fecha actual
   
    const { users } = useContext(UserContext);

     //Leer los datos de Status
     const getStatus = async () => {
        const traerStatus = collection(db, 'status');
        const dato = query(traerStatus, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEstado(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    
    useEffect(()=>{
        getStatus();
    },[])

    const formatearFecha =(fecha)=>{
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }

     //Exportar a excel los equipos
     const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['tipo', 'status', 'serie','rut', 'entidad', 'fechamod']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(estado, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'data.xlsx';
        downloadLink.click();
    }


    return (
       <ContenedorReporte>
            <Contenedor>
                <Titulo>Estados de los Equipos</Titulo>
            </Contenedor>
            <ListarProveedor>
                <ContentElemenMov>                    
                    <Titulo>Listado de Dispositivos Médicos</Titulo>   
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px', marginTop: '7px' }} title='Exportar Status a Excel' />                 
                </ContentElemenMov>
                              
                
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>                            
                            <Table.HeaderCell>Nombre Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Status</Table.HeaderCell>                            
                                                    
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>      
                      {
                            estado.map((item) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{item.id2}</Table.Cell>                                        
                                        <Table.Cell>{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.status}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
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