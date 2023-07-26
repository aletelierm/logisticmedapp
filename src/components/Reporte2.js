/* eslint-disable react-hooks/exhaustive-deps */
import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';

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

    console.log(estado);
    useEffect(()=>{
        getStatus();
    },[])

    const formatearFecha =(fecha)=>{
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }


    return (
       <ContenedorReporte>
            <ContenedorFormulario>
                <Titulo>Estados de los Equipos</Titulo>
            </ContenedorFormulario>
            <ListarProveedor>
                <ContentElemen>                    
                    <Titulo>Listado de Dispositivos Médicos</Titulo>                    
                </ContentElemen>
                              
                
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Id Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Inicio Status</Table.HeaderCell>                            
                            <Table.HeaderCell>Fecha Proxima</Table.HeaderCell>                            
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>      
                      {
                            estado.map((item) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.id}</Table.Cell>
                                        <Table.Cell>{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.status}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.fechaadd)}</Table.Cell>
                                        <Table.Cell>-------------</Table.Cell>                                
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

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`
const ContentElemen = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 5px 10px;
`

const Titulo = styled.h2`
    color:  #83d394;
 background: none;
`
const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
    `
