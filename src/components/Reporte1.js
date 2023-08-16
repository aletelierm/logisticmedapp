/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {ContentElemen, Input} from '../elementos/CrearEquipos'
import {ContenedorProveedor, Contenedor,  Titulo} from '../elementos/General';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import * as FaIcons from 'react-icons/fa';

const Reporte1 = () => {

    
    const { users } = useContext(UserContext);  

    const [entrada, setEntrada] = useState([]);
    const [salida, setSalida] = useState([]);
    const [data, setData] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [serie, setSerie] = useState('');
    const [idEquipo, setIdEquipo] = useState('');
    const merge = useRef([]);

  /*   const getEntradas = async () => {
             const dato = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id','==', 'lNcgEOthiVyrhlVq4343'));
        const data = await getDocs(dato)
        setEntrada(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        data.forEach((doc)=>{
            console.log(doc.id, "=>",doc.data());
        })
    } */

 /*    const getSalidas = async () => {
    
        const dato = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id','==', 'vqpbcQVx2aB3VGBJ5wjk'));
        const data = await getDocs(dato)
        setSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        data.forEach((doc)=>{
            console.log(doc.id, "=>",doc.data());
        })
    } */

    //Mescla arreglo de entrada y salida
    /* const mergeArrar = [...entrada, ...salida].sort((a,b) => a.date.localeCompare(b.date));
    console.log(mergeArrar)
    useEffect(()=>{
        getEntradas();
        getSalidas();
        console.log(entrada);
        setData(mergeArrar);
        console.log('ARREGLO MERGE',data)
    },[]); */

    const handleChange = (e)=>{
        setSerie(e.target.value);
    }

    const detectarEquipo = async  (e)=>{
        if (e.key === 'Enter' || e.key === 'Tab') {
        const dato = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie','==', serie));
        const data = await getDocs(dato);
        if(data.docs.length === 1){
            setIdEquipo(data.docs[0].id)
            console.log('si existe este numero de serie:',data.docs[0].id)

            //leer entradas por id
            const datoE = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id','==', data.docs[0].id));
            const dataE = await getDocs(datoE);
            setEntrada(dataE.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

            //leer salidas por id
            const datoS = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id','==', data.docs[0].id));
            const dataS = await getDocs(datoS)
            setSalida(dataS.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

             merge.current = [...entrada, ...salida].sort((a,b) => a.date.localeCompare(b.date));
           
        }else{
                console.log('no existe ese numero de serie')
            }
        
        }
    }

    return (
       <ContenedorProveedor>
            <Contenedor>
                <Titulo>Historial por Equipo</Titulo>
            </Contenedor>
            <Contenedor>
            <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Digite o escane serie o id equipo'
                        value={serie}
                        onChange={handleChange}
                        onKeyDown={detectarEquipo} 
                    />
                   {/*  <FaIcons.FaFileExcel  style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Clientes a Excel' /> */}
                </ContentElemen>
                </Contenedor>
            <Contenedor>
               <Titulo>Equipo :</Titulo>
            <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>N.Doc</Table.HeaderCell>
                            <Table.HeaderCell>T.Doc</Table.HeaderCell>
                            <Table.HeaderCell>Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Salida</Table.HeaderCell>
                            <Table.HeaderCell>Ubicacion</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            merge.current.map((item, index) => {
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>                                      
                                        <Table.Cell>{item.tipoinout === 'COMPRA' ? '1':'0'}</Table.Cell>
                                        <Table.Cell>{item.tipoinout === 'COMPRA' ? "0":"1"}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>                                        
                                        <Table.Cell>{item.rut}</Table.Cell>                                       
                                        <Table.Cell>{item.entidad}</Table.Cell>                                       
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

