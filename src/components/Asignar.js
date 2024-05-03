import React, { useState, useEffect } from 'react';
import { ListarProveedor, Titulo, BotonGuardar, Overlay,ConfirmaModal} from '../elementos/General';
import {  Contenido, Input ,ContentElemen, Formulario, Select, Label} from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table, TableBody } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import styled from 'styled-components';
import Alertas from './Alertas';
/* import { Link } from 'react-router-dom'; */
import { getDocs, collection, where, query, updateDoc, doc } from 'firebase/firestore';
import moment from 'moment';
/* import Modal from './Modal'; */
/* import * as FaIcons from 'react-icons/fa'; */
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
/* import * as MdIcons from 'react-icons/md'; */
// import Swal from 'sweetalert2';

const Asignar = () => {

    //fecha hoy
    const fechaHoy = new Date();

    const { users } = useContext(UserContext);
    const [asignar, setAsignar] = useState([]);    
    const [asignados, setAsignados] = useState([]);    
    const [mostrarDet, setMostrarDet] = useState([]);
    const [testIngreso, setTestIngreso] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [idCabIngreso, setIdCabIngreso] = useState(null)
    const [openModalCli, setOpenModalCli] = useState(false);
    const [tecnico, setTecnico] = useState('')
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
   

    // Leer datos de cabecera Ingresados
    const getIngresostcab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id),where('estado','==','INGRESADO'));
        const data = await getDocs(dato)
        setAsignar(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // Leer datos de cabecera Asignados
    const getAsignadoscab = async () => {
        const traerCabecera = collection(db, 'ingresostcab');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id),where('estado','==','ASIGNADO'));
        const data = await getDocs(dato)
        setAsignados(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
  
    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
       /*  const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        console.log(fechaHoyF + " es menor que ? " + formatear, fechaHoy < dateObj) */
        return formatear;
    }

    //Lee la orden de ingreso indicada por el ID 
    const leerDetalleIngreso = async (id)=>{
        const traer = collection(db, 'ingresostdet');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setMostrarDet(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const leerTestIngreso = async (id)=>{
        const traer = collection(db, 'testingreso');
        const doc = query(traer, where('id_cab_inst', '==', id));
        const documento = await getDocs(doc)
        setTestIngreso(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const leerUsuarios = async ()=>{
        const traer = collection(db, 'usuarios');
        const doc = query(traer, where('emp_id', '==', users.emp_id));
        const documento = await getDocs(doc)
        setUsuarios(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Ordenar x folio
    const asignarOrd = asignar.sort((a, b) => a.folio - b.folio)
    const asignadosOrd = asignados.sort((a, b) => a.folio - b.folio)

    //Funcion handlesubmit para validar y asignar
    const asignarUsuario = async (e)=>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (tecnico.length === 0 || tecnico==='Selecciona Tecnico:'){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor seleccione un usuario'
            })
            return;
        }else{
            try {
                await updateDoc(doc(db, 'ingresostcab',idCabIngreso), {
                    tecnico: tecnico,
                    estado: 'ASIGNADO'
                });
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Usuario Asignado correctamente'
                })
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al actualizar el usuario tecnico:', error
                })
            }
        }
    }

    useEffect(() => {
        getIngresostcab(); 
        leerUsuarios();
        getAsignadoscab();       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div>
            <ListarProveedor>
                <Titulo>Asignar Ingresos</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>                           
                            <Table.HeaderCell>Ver</Table.HeaderCell>                          
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignarOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>                                    
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.estado}</Table.Cell>                          
                                    <Table.Cell 
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerDetalleIngreso(item.id)
                                            setIdCabIngreso(item.id)
                                            leerTestIngreso(item.id)
                                            setOpenModalCli(!openModalCli)
                                        }}
                                        ><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
                                        <Table.Cell></Table.Cell>                      
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>  
            </ListarProveedor>
            <ListarProveedor>
                <Titulo>Asignados</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>                           
                            <Table.HeaderCell>Tecnico Asignado</Table.HeaderCell>                            
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {asignadosOrd.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>                                    
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.estado}</Table.Cell>                          
                                    <Table.Cell>{item.tecnico}</Table.Cell>                          
                                    {/* <Table.Cell 
                                        title='Ver Documento Ingreso'
                                        onClick={() => {
                                            leerDetalleIngreso(item.id)
                                            leerTestIngreso(item.id)
                                            setOpenModalCli(!openModalCli)
                                            
                                        }}
                                        ><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell> */}
                                        <Table.Cell></Table.Cell>                      
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                {openModalCli && (
                <Overlay>
                    <ConfirmaModal>
                        <Titulo>Asignar Ingreso</Titulo>
                        <BotonCerrar onClick={() => setOpenModalCli(!openModalCli)}><IoIcons.IoMdClose /></BotonCerrar>
                        <Formulario action='' >
                            <ContentElemen>
                            <Contenido /* style={{ maxHeight: '400px', overflowY: 'auto' }} */>
                        <Table singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Tipo</Table.HeaderCell>
                                    <Table.HeaderCell>Marca</Table.HeaderCell>
                                    <Table.HeaderCell>Modelo</Table.HeaderCell>
                                    <Table.HeaderCell>Serie</Table.HeaderCell>
                                    <Table.HeaderCell>Servicio</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>                            
                            <Table.Body >
                                {mostrarDet.map((item, index) => {
                                    return (                                        
                                        <Table.Row key={index}>
                                            <Table.Cell style={{ fontSize: '13px' }}>{item.tipo}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.marca}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.modelo}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.serie}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.servicio}</Table.Cell>                                                                                      
                                        </Table.Row>                                       
                                    )
                                })}
                            </Table.Body>
                        </Table>
                        <Table>
                        {mostrarDet.map((item, index) => {
                                    return (                                        
                                        <Table.Row key={index}>
                                            <Table.Cell style={{ fontSize: '13px' }}>Observaciones : {item.observaciones}</Table.Cell>                                                                                                                               
                                        </Table.Row>                                       
                                    )
                                })}
                        </Table>                      
                        <Table>
                        <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>N</Table.HeaderCell>
                                    <Table.HeaderCell>Item Test</Table.HeaderCell>
                                    <Table.HeaderCell>Si</Table.HeaderCell>
                                    <Table.HeaderCell>No</Table.HeaderCell>                                    
                                </Table.Row>
                            </Table.Header>
                            <TableBody>
                            {testIngreso.map((item, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell style={{ fontSize: '13px' }}>{index + 1}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}>{item.item}</Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}><Input type='checkbox'
                                            checked={item.valorsi} ></Input></Table.Cell>
                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '13px' }}><Input type='checkbox'
                                            checked={item.valorno}></Input></Table.Cell>                                         
                                        </Table.Row>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {/* <BotonGuardar onClick={() => setEstadoModal(!estadoModal)}>Aceptar</BotonGuardar> */}
                                 </Contenido>
                            </ContentElemen>
                            <ContentElemen>                            
                                <Label>Seleccionar Usuario:</Label>
                                <Select value={tecnico} onChange={e => setTecnico(e.target.value)} >
                                    <option>Selecciona Tecnico:</option>
                                    {usuarios.map((objeto, index) => {
                                        return (<option key={index}>{objeto.correo}</option>)
                                    })}
                                </Select>
                            </ContentElemen>
                            <BotonGuardar onClick={asignarUsuario} >Asignar</BotonGuardar>
                        </Formulario>
                        
                    </ConfirmaModal>
                </Overlay>
                )}
            </ListarProveedor> 
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />        
        </div>
    );
};

export default Asignar;

const BotonCerrar = styled.button`
    position: absolute;
    top:20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all.3s ease all;
    border-radius: 5px;
    color: #1766DC;

    &:hover{
        background: #f2f2f2;
    }
`