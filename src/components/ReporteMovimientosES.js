/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query} from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import * as MdIcons from 'react-icons/md';
import moment from 'moment';
import Modal from './Modal';
import { Contenido } from '../elementos/CrearEquipos'
import { ListarProveedor, Titulo, Boton2 } from '../elementos/General';

const ReporteMovimientos = () => {
    const { users } = useContext(UserContext);
    const [cabecera, setCabecera] = useState([]);
    const [cabeceraOut, setCabeceraOut] = useState([]);
    const [estadoModal, setEstadoModal] = useState(false);
    const [mostrarSt, setMostrarSt] = useState([]);

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

    const merge = [...cabecera, ...cabeceraOut].sort((a, b) => a.date - b.date)

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    const leerMovEntrada =async (id)=>{
        const traerIn = collection(db, 'entradas');
        const datoIn = query(traerIn, where('cab_id','==',id));
        const dataIn = await getDocs(datoIn)
        setMostrarSt(dataIn.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
    }

    const leerMovSalida = async (id)=>{
        const traerOut = collection(db, 'salidas');
        const datoOut = query(traerOut, where('cab_id','==',id));
        const dataOut = await getDocs(datoOut)
        setMostrarSt(dataOut.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
    }

    useEffect(() => {
        getCabecera();
        getCabeceraOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <ListarProveedor>
                <Titulo>Listado de Movimientos</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Documento</Table.HeaderCell>
                            <Table.HeaderCell>Número</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo E/S</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Ver</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {merge.map((item, index) => {                       
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell >{index+1}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>                                       
                                        <Table.Cell>{item.tipmov !== 3 ? "CONFIRMADO" : "ANULADO" }</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
                                        <Table.Cell
                                            style={{ textAlign: 'center' }}
                                            title='Ver Movimientos'
                                            onClick={() => {
                                                if(item.tipmov ===1){
                                                    leerMovEntrada(item.id);
                                                }else{
                                                    leerMovSalida(item.id);
                                                }
                                                //leerStatus(item.id)
                                                setEstadoModal(!estadoModal)
                                            }
                                            }><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                        })}
                    </Table.Body>
                </Table>
                <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>  
                {mostrarSt.length >0 ?
                <Contenido>
                    <Table singleLine>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Nombre de equipo</Table.HeaderCell>
                                <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                <Table.HeaderCell>Precio</Table.HeaderCell>                                
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {mostrarSt.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>${item.price}.-</Table.Cell>  
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>                    
                    <Boton2 onClick={() => setEstadoModal(!estadoModal)}>Aceptar</Boton2>
                </Contenido> 
                :
                <h2>Documento Anulado</h2>   }
            </Modal>
            </ListarProveedor>            
        </div>
    );
};

export default ReporteMovimientos ;