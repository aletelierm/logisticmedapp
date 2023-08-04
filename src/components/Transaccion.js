/* eslint-disable array-callback-return */
import React,{useEffect, useState} from 'react';
import { Table } from 'semantic-ui-react'
import styled from 'styled-components';
import {  db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {ListarProveedor, Titulo} from '../elementos/General'

const Transaccion = () =>{
    const { users } = useContext(UserContext);
    const [cabecera, setCabecera] = useState([]);
     // Leer datos de cabecera
     const getCabecera = async () => {
        const traerCabecera = collection(db, 'cabeceras');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    useEffect(()=>{
        getCabecera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const OrdenaPorNumDoc = (a,b)=>{
        return a.numdoc - b.numdoc;
    }
    const ordenado = cabecera.sort(OrdenaPorNumDoc);   

    return (
        <div>          
            <ListarProveedor>
                <Titulo>Listado Entradas</Titulo>
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
                            if (item.confirmado === true){
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell >{index+1}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.tipoin}</Table.Cell>
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

// const ListarProveedor = styled.div`
//     margin-top: 20px;
//     padding: 20px;
//     border: 2px solid #d1d1d1;
//     border-radius: 20px;
//     box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
// `
// const Titulo = styled.h2`
//     color:  #83d394;
// `