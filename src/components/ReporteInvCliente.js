/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef} from 'react';
import Alerta from './Alertas';
import { ContentElemen, Input } from '../elementos/CrearEquipos'
import { ContenedorProveedor, Contenedor, Titulo } from '../elementos/General';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import * as FaIcons from 'react-icons/fa';
import moment from 'moment';
import validarRut from '../funciones/validarRut';

const ReporteInvCliente = () => {
    const { users } = useContext(UserContext);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('');
    const [valorizado, setValorizado] = useState('');
   /*  const [inventarioClte, setInventarioClte] = useState([]); */
    
    const fechaHoy = new Date();

    const Inv = useRef([]);
   
    // Contar días
    const contarDias = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj);        
        const ultima = new Date(formatear)
        const tiempo = fechaHoy - ultima;
        const dias = tiempo/(1000 * 60 * 60 * 24)
        // return nuevafecha.format('DD/MM/YYYY HH:mm');
        return dias;
    }

    
  /*   //Leer los datos de Status
    const getStatus = async () => {
        const traerStatus = collection(db, 'status');
        const dato = query(traerStatus, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setInventarioClte(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    } */

    const detectarEquipo = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Patron para valiar rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);

        if (e.key === 'Enter' || e.key === 'Tab') {
            if (rut === '') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Campo Rut no puede estar vacio'
                })
                return;
            } else if (!expresionRegularRut.test(rut)) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Formato incorrecto de rut'
                })
                return;
            } else if (validaR !== parseInt(digito)) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Rut no válido'
                })
                return;
            } else {
                //Buscar si rut existe en pacientes
                const datoRut = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const encuentraRut = await getDocs(datoRut);

                if (encuentraRut.docs.length !== 0) {
                    //leer entradas por id
                    const datoE = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('r_permanente', '==', rut));
                    const InvCliente = await getDocs(datoE);
                    Inv.current = InvCliente.docs.map((doc, index) => ({ ...doc.data(), id: doc.id}))
                    setValorizado( Inv.current.reduce((total, dato)=>total+dato.price,0));
                    console.log('valorizado',valorizado)
                } else {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe un paciente con ese Rut'
                    })
                    return;
                }
            }
        }
    }

    const handleChange = (e) => {
        setRut(e.target.value);
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    console.log(Inv.current)
   
       return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Inventario por Paciente</Titulo>
            </Contenedor>
            <Contenedor>
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar x Rut'
                        value={rut}
                        onChange={handleChange}
                        onKeyDown={detectarEquipo}
                    />
                    {/*  <FaIcons.FaFileExcel  style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Clientes a Excel' /> */}
                </ContentElemen>
            </Contenedor>
            <Contenedor>
                {
                    Inv.current.length > 0 ?
                        <Titulo style={{ fontSize: '17px' }}>Paciente :{" " + Inv.current[0].n_permanente + " ------ Rut: " + Inv.current[0].r_permanente}</Titulo>
                        :
                        <Titulo>Equipo:</Titulo>
                }

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Cantidad</Table.HeaderCell>
                            <Table.HeaderCell>Precio</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Inicio</Table.HeaderCell>                           
                            <Table.HeaderCell>Total Días</Table.HeaderCell>                           
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            Inv.current.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>1</Table.Cell>
                                        <Table.Cell>{item.price.toLocaleString()}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.fecha_permanente)}</Table.Cell>
                                        <Table.Cell>{contarDias(item.fecha_permanente).toFixed(2)}</Table.Cell>                                                                                                                     
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>

                </Table>
            </Contenedor>
            <Contenedor>
                <Titulo>Total Valorizado :  {valorizado.toLocaleString()}</Titulo>
            </Contenedor>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );

}
export default ReporteInvCliente;

