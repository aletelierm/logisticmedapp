/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
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


const Reporte3 = () => {

    const { users } = useContext(UserContext);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('');
    const [merges, setMerges] = useState([]);
    const merge = useRef([]);
    const ent = useRef([]);
    const sal = useRef([]);
   
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
            }else {
                //Buscar si rut existe en pacientes
                const datoRut = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const encuentraRut = await getDocs(datoRut);
                
                if(encuentraRut.docs.length !== 0){
                    //leer entradas por id
                 const datoE = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                 const dataE = await getDocs(datoE);
                 ent.current = dataE.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }))
                //leer salidas por id
                const datoS = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const dataS = await getDocs(datoS);
                sal.current = dataS.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }));  
                merge.current = [...ent.current, ...sal.current].sort((a, b) => a.date - b.date);
                const movimientos = merge.current.filter(mov => mov.tipmov !==0)                
                setMerges(movimientos);
                 console.log(merges)
                }else{
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
   
    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Historial por Paciente</Titulo>
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
                    merge.current.length > 0 ?
                        <Titulo style={{ fontSize: '17px' }}>Paciente :{" "+merge.current[0].entidad+" ------ Rut: "+merge.current[0].rut}</Titulo>
                        :
                        <Titulo>Equipo:</Titulo>
                }

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>N.Doc</Table.HeaderCell>
                            <Table.HeaderCell>T.Doc</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Salida</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Mov.</Table.HeaderCell>                            
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {/* {console.log('merge jsx:', merge.current)} */}
                        {
                            merges.map((item, index) => {
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.tipo+" "+item.marca}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.tipmov === 1 ? '0' : '1'}</Table.Cell>
                                        <Table.Cell>{item.tipmov === 1 ? "1" : "0"}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>                                       
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>

                </Table>
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
export default Reporte3;

