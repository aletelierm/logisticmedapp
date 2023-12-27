import React, { useState, useEffect } from 'react';
import { ListarProveedor, Titulo } from '../elementos/General';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query} from 'firebase/firestore';
import moment from 'moment';
import * as MdIcons from 'react-icons/md';
import Swal from 'sweetalert2';

const Mantenimiento = () => {

    const { users } = useContext(UserContext);
    const [mantencion, setMantencion] = useState([])

     // Leer datos de cabecera Entradas
     const getMantenimiento = async () => {
        const traerCabecera = collection(db, 'mantenciones');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMantencion(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

     // Cambiar fecha
     const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        console.log(dateObj)
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');       
        return formatear;
    }

    // Sumar dias
    const sumarDias = (fecha,dias) =>{
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj);
        const nuevafecha = formatear.add(dias,'days');          
        return nuevafecha.format('DD/MM/YYYY HH:mm');
    }

   /*  console.log(sumarDias(1640686800000).format('DD/MM/YYYY HH:mm')) */
    //Ordenar fechas
    const manteOrd = mantencion.sort((a, b) => a.date - b.date)

    useEffect(() => {
        getMantenimiento();
        console.log(mantencion)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ejecutar = ()=>{
        Swal.fire('Check list de mantención');
    }

    return (
        <div>
                <ListarProveedor>
                <Titulo>Mantenciones</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Protocolo</Table.HeaderCell>
                            <Table.HeaderCell>Plan</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Inicio</Table.HeaderCell>
                            <Table.HeaderCell>F.Prox.Mantenión</Table.HeaderCell>
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
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
                                    <Table.Cell>{item.dias}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.fechaAdd)}</Table.Cell>
                                    <Table.Cell>{sumarDias(item.fechaAdd,item.dias)}</Table.Cell>                    
                                    <Table.Cell onClick={()=>ejecutar()} title="Ejecutar Mantención"><MdIcons.MdPlayCircle style={{ fontSize: '20px', color: '#328AC4', cursor:'pointer' }} /></Table.Cell>                                  
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
        </div>
    );
};

export default Mantenimiento;