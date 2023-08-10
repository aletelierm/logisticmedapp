/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {ContentElemenSelect, Select, Formulario, Input, Label, Contenido} from '../elementos/CrearEquipos'
import {ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, Boton, BotonGuardar, Boton2} from '../elementos/General';
import { Table } from 'semantic-ui-react'
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Reporte1 = () => {

    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [entrada, setEntrada] = useState([])
    const [salida, setSalida] = useState([])
    const [data, setData] = useState([])

    const getEntradas = async () => {
        /* const traerEntrada= collection(db, 'entradas'); */
        const dato = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id','==', 'vqpbcQVx2aB3VGBJ5wjk'));
        const data = await getDocs(dato)
        setEntrada(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        data.forEach((doc)=>{
            console.log(doc.id, "=>",doc.data());
        })
    }

    const getSalidas = async () => {
        /* const traerEntrada= collection(db, 'entradas'); */
        const dato = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id','==', 'vqpbcQVx2aB3VGBJ5wjk'));
        const data = await getDocs(dato)
        setSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        data.forEach((doc)=>{
            console.log(doc.id, "=>",doc.data());
        })
    }

    const mergeArrar = [...entrada, ...salida].sort((a,b) => a.date.localeCompare(b.date));
    console.log(mergeArrar)
    useEffect(()=>{
        getEntradas();
        getSalidas();
        console.log(entrada);
        setData(mergeArrar);
        console.log('ARREGLO MERGE',data)
    },[]);

    return (
       <ContenedorProveedor>
            <Contenedor>
                <Titulo>Historial por Equipo</Titulo>
            </Contenedor>
            <Contenedor>
            <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>T.Doc</Table.HeaderCell>
                            <Table.HeaderCell>N.Doc</Table.HeaderCell>
                            <Table.HeaderCell>Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Salia</Table.HeaderCell>
                            <Table.HeaderCell>Ubicacion</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>T.Movimiento</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            data.map((item, index) => {
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.tipoin}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>1</Table.Cell>
                                        <Table.Cell>0</Table.Cell>
                                        <Table.Cell>Bodega</Table.Cell>                                        
                                        <Table.Cell>{item.rut}</Table.Cell>                                        
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>

                </Table>
            </Contenedor>
       </ContenedorProveedor>            
      
    );
};

export default Reporte1;

