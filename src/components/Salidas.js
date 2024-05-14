/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import SalidasDB from '../firebase/SalidasDB';
import CabeceraOutDB from '../firebase/CabeceraOutDB';
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDocOut, TipoOut } from './TipDoc';
import * as FaIcons from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Boton, BotonGuardar, ConfirmaModal, ConfirmaBtn, Boton2, Overlay } from '../elementos/General';
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label, TextArea } from '../elementos/CrearEquipos';
import EnviarCorreo from '../funciones/EnviarCorreo';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
/* import subirArchivos from '.././funciones/subirArchivos'; */

const Salidas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    // Calcular la fecha mínima (3 días hacia atrás)
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaAdd.getDate() - 1);

    // Calcular la fecha máxima (3 días hacia adelante)
    const fechaMaxima = new Date();
    fechaMaxima.setDate(fechaAdd.getDate() + 1);

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showConfirmationAnular, setShowConfirmationAnular] = useState(false);
    const [itemDelete, setItemdelete] = useState(false);
    const [itemAnular, setItemAnular] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [alertaSalida, setAlertasalida] = useState([]);
    const [cabecera, setCabecera] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [cabecera1, setCabecera1] = useState([]);
    const [dataSalida, setDataSalida] = useState([]);
    const [status, setStatus] = useState([]);
    const [usuario, setUsuarios] = useState([]);
    const [transport, setTransport] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoOut, setNomTipoOut] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [correo, setCorreo] = useState('');
    const [patente, setPatente] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const [mostrarSubir, setMostrarSubir] = useState(true);
   /*  const [archivo, setArchivo] = useState(null); */
    const inOut = useRef('');
    const almacenar = useRef([]);
    const salidaid = useRef([]);
    const nomRut = useRef('Rut');
    const cabid = useRef('');

    //Lectura de usuario para alertas de salida
    const getAlertasSalidas = async () => {
        const traerAlertas = collection(db, 'usuariosalertas');
        const dato = query(traerAlertas, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato);
        setAlertasalida(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('tipmov', '==', 2));
        const guardaCab = await getDocs(cab);
        setCabecera(guardaCab.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        const cab1 = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('tipmov', '==', 0));
        const guardaCab1 = await getDocs(cab1);
        setCabecera1(guardaCab1.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    const merge = [...cabecera, ...cabecera1].sort((a, b) => a.numdoc - b.numdoc)

    //Funcion ordena x fecha
    const OrdenaFecha = (a, b) => {
        return a.fechaadd.seconds - b.fechaadd.seconds;
    }
    // Filtar por docuemto de Salida
    const consultarOut = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        const documento = documen.sort(OrdenaFecha);
        setDataSalida(documento)
    }
    // Filtar usuario transportista
    const transportista = async () => {
        const trans = query(collection(db, 'usuarios'), where('emp_id', '==', users.emp_id), where('rol', '==', 'TRANSPORTE'));
        const transporte = await getDocs(trans);
        const transportista = (transporte.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setTransport(transportista);
    }
    //Lectura de status
    const getStatus = async () => {
        const traerEntrada = collection(db, 'status');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    //Lee datos de los usuarios
    const getUsuarios = async () => {
        const dataUsuarios = collection(db, "usuarios");
        const dato = query(dataUsuarios, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setUsuarios(data.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }
    //Leer  Empresa
    const getEmpresa = async () => {
        const traerEmp = await getDoc(doc(db, 'empresas', users.emp_id));
        setEmpresa(traerEmp.data());
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }
    // Transformar fecha de moment a date
    const fechaDate = (fecha) => {
        // Convierte a milisegundos
        const nuevaFecha = fecha.seconds * 1000
        // Crea un objeto Date a partir del timestamp en milisegundos
        const fechas = new Date(nuevaFecha);
        // Formatea la fecha en el formato 'YYYY-MM-DDTHH:mm'
        const formatoDatetimeLocal = fechas.toISOString().slice(0, 16);
        setDate(formatoDatetimeLocal)
    }
    // Cambiar Label de Rut
    if (nomTipoOut === 'PACIENTE' || nomTipoOut === 'RETIRO PACIENTE') {
        nomRut.current = 'Rut Paciente';
    } else if (nomTipoOut === 'SERVICIO TECNICO' || nomTipoOut === 'RETIRO SERVICIO TECNICO') {
        nomRut.current = 'Rut Servicio Tecnico';
    } else {
        nomRut.current = 'Rut Proveedor';
    }
    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoOut === 'PACIENTE' || nomTipoOut === 'RETIRO PACIENTE') {
                // Filtrar rut de Pacientes
                const traerClie = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const rutCli = await getDocs(traerClie)
                const existeCli = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del Paciente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                    setBtnGuardar(false);
                }
            } else {
                // Filtrar rut de Proveedores
                const traerProv = query(collection(db, 'proveedores'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const rutProv = await getDocs(traerProv)
                const existeProv = (rutProv.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                    setBtnGuardar(false);
                }
            }
        }
    }
    // Validar N°serie
    const detectar = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            // Exite N° serie en equipos   
            const traerEq = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie));
            const serieEq = await getDocs(traerEq);
            const existe = (serieEq.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Exite ID en equipos
            const traerId = await getDoc(doc(db, 'equipos', numSerie));
            if (existe.length === 1) {
                almacenar.current = existe;
            } else if (traerId.exists()) {
                const existeId = traerId.data();
                const arreglo = [existeId];
                const existe2 = arreglo.map((doc) => ({ ...doc, id: numSerie }));
                almacenar.current = existe2;
            } else {
                console.log('almacenar', almacenar.current);
            }
            // Exite N° serie en Entradas 
            const existeIn = dataSalida.filter(doc => doc.serie === numSerie);
            const existeIn2 = dataSalida.filter(doc => doc.eq_id === numSerie);
            // Validar en N° Serie en todos los documento de Salidas confirmado
            const traerSC = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('confirmado', '==', false));
            const confirmadoS = await getDocs(traerSC);
            const existeconfirmado = (confirmadoS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Validar en Eq_id en todos los documento de Salidas confirmado
            const traerID = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('confirmado', '==', false));
            const confirmadoID = await getDocs(traerID);
            const existeID = (confirmadoID.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            // Validar que equipo pertenezca a proveedor y que este en arriendo
            const traer = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('rut', '==', rut), where('tipoinout', '==', 'ARRIENDO'));
            const valida = await getDocs(traer);
            const existeeqprov = (valida.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

            if (almacenar.current.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe un Equipo con este N° Serie o Id'
                })
            } else if (existeIn.length > 0 || existeIn2.length > 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra en este documento'
                })
            } else if (existeconfirmado.length > 0 || existeID.length > 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra Ingresado en un documento por confirmar'
                })
            } else {
                const existeStatusCli = status.filter(st => st.id === almacenar.current[0].id && st.status === 'PACIENTE').length === 1;
                const existeStatusST = status.filter(st => st.id === almacenar.current[0].id && st.status === 'SERVICIO TECNICO').length === 1;
                const existeStatusBod = status.filter(st => st.id === almacenar.current[0].id && st.status === 'BODEGA').length === 1;
                if (nomTipoOut === 'RETIRO PACIENTE') {
                    if (!existeStatusCli) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Equipo no se encuentra en Paciente'
                        })
                    }
                } else if (nomTipoOut === 'RETIRO SERVICIO TECNICO') {
                    if (!existeStatusST) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Equipo no se encuentra en Servicio Tecnico'
                        })
                    }
                } else if (nomTipoOut === 'DEVOLUCION A PROVEEDOR' && existeeqprov.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no pertenece a este Proveedor o no ha sido arrendado'
                    })
                } else {
                    if (!existeStatusBod) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Equipo no se encuentra en Bodega'
                        })
                    }
                }
            }
        }
    }
    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };
    // Guardar Cabecera de Documento en Coleccion CabeceraInDB
    const addCabeceraIn = async (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Validar Rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);
        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        // Filtar por docuemto de Cabecera Tipmov = 2
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut), where('tipmov', '==', 2));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));
        // Filtar por docuemto de Cabecera Tipmov = 0
        const cab1 = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut), where('tipmov', '==', 0));
        const cabecera1 = await getDocs(cab1);
        const existeCab1 = (cabecera1.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));
        // Validar si existe correo de transprtista
        const existeCorreo = usuario.filter(corr => corr.correo === correo);

        if (numDoc === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese N° Documento'
            })
            return;
        } else if (nomTipDoc.length === 0 || nomTipDoc === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione Tipo Documento'
            })
            return;
        } else if (date === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Fecha'
            })
            return;
        } else if (nomTipoOut.length === 0 || nomTipoOut === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de Salida'
            })
            return;
            // Validacion Rut
        } else if (rut === '') {
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
        } else if (correo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese un correo'
            })
            return;
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'favor ingresar un correo valido'
            })
            return;
        } else if (existeCorreo.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe usuario con ese correo'
            })
            return;
        } else if (patente === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese Patente del Vehiculo'
            })
            return;
        } else if (existeCab.length > 0) {
            if (existeCab[0].confirmado) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento y se encuentra confirmado'
                })
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento. Falta confirmar'
                })
            }
        } else if (existeCab1.length > 0) {
            if (existeCab1[0].confirmado) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento y se encuentra confirmado'
                })
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento. Falta confirmar'
                })
            }
        } else {
            setMostrarSubir(!mostrarSubir);
            // Validar Rut Paciente
            const traerClie = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(traerClie)
            const existeCli = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Validar Rut Proveedor
            const traerProv = query(collection(db, 'proveedores'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutProv = await getDocs(traerProv)
            const existeProv = (rutProv.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

            const fechaInOut = new Date(date);
            if (nomTipoOut === 'PACIENTE') {
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del Paciente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                    try {
                        CabeceraOutDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            descripcion: descripcion,
                            tipMov: 2,
                            url: '',
                            confirmado: false,
                            entregado: false,
                            retirado: true,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Cabecera Documento guadada exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(true);
                        setBtnAgregar(false);
                        setBtnGuardar(true);
                        setBtnNuevo(false);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else if (nomTipoOut === 'RETIRO PACIENTE') {
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del Paciente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                    try {
                        CabeceraOutDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            descripcion: descripcion,
                            tipMov: 0,
                            url: '',
                            confirmado: false,
                            entregado: true,
                            retirado: false,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Cabecera Documento guadada exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(true);
                        setBtnAgregar(false);
                        setBtnGuardar(true);
                        setBtnNuevo(false);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else if (nomTipoOut === 'RETIRO SERVICIO TECNICO') {
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                    try {
                        CabeceraOutDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            descripcion: descripcion,
                            tipMov: 0,
                            url: '',
                            confirmado: false,
                            entregado: true,
                            retirado: false,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Cabecera Documento guadada exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(true);
                        setBtnAgregar(false);
                        setBtnGuardar(true);
                        setBtnNuevo(false);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else {
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                    try {
                        CabeceraOutDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            descripcion: descripcion,
                            tipMov: 2,
                            url: '',
                            confirmado: false,
                            entregado: false,
                            retirado: true,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Cabecera Documento guadada exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(true)
                        setBtnAgregar(false)
                        setBtnGuardar(true);
                        setBtnNuevo(false);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            }
        }
    }
    //Valida y guarda los detalles del documento
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Exite N° serie en equipos   
        const traerEq = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie));
        const serieEq = await getDocs(traerEq);
        const existe = (serieEq.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Validar ID en equipo
        const traerId = await getDoc(doc(db, 'equipos', numSerie));
        if (existe.length === 1) {
            almacenar.current = existe;
        } else if (traerId.exists()) {
            const existeId = traerId.data();
            const arreglo = [existeId];
            const existe2 = arreglo.map((doc) => ({ ...doc, id: numSerie }));
            almacenar.current = existe2;
        } else {
            console.log('almacenar', almacenar.current);
        }
        // Exite N° serie en Salidas 
        const existeIn = dataSalida.filter(doc => doc.serie === numSerie);
        const existeIn2 = dataSalida.filter(doc => doc.eq_id === numSerie);
        // Validar en N° Serie en todos los documento de Salidas confirmado
        const traerSC = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('confirmado', '==', false));
        const confirmadoS = await getDocs(traerSC);
        const existeconfirmado = (confirmadoS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Validar en Eq_id en todos los documento de Salidas confirmado
        const traerID = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('confirmado', '==', false));
        const confirmadoID = await getDocs(traerID);
        const existeID = (confirmadoID.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        // Validar Id de Cabecera en Salidas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        const existeCab1 = cabecera1.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        // Validar que equipo pertenezca a proveedor y que este en arriendo
        const traer = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('rut', '==', rut), where('tipoinout', '==', 'ARRIENDO'));
        const valida = await getDocs(traer);
        const existeeqprov = (valida.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        if (numSerie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese o Scaneé N° Serie'
            })
            return;
        } else if (almacenar.current.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe un Equipo con este N° Serie o Id'
            })
        } else if (existeIn.length > 0 || existeIn2.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra en este documento'
            })
        } else if (existeconfirmado.length > 0 || existeID.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra Ingresado en un documento por confirmar'
            })
        } else {
            const existeStatusBod = status.filter(st => st.id === almacenar.current[0].id && st.status === 'BODEGA').length === 1;
            const existeStatusCli = status.filter(st => st.id === almacenar.current[0].id && st.status === 'PACIENTE' && st.r_destino === rut).length === 1;
            const existeStatusST = status.filter(st => st.id === almacenar.current[0].id && st.status === 'SERVICIO TECNICO' && st.r_destino === rut).length === 1;
            if (nomTipoOut === 'RETIRO PACIENTE') {
                if (!existeStatusCli) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en este Paciente'
                    })
                } else {
                    inOut.current = 'PROCESO RETIRO PACIENTE';
                    cabid.current = existeCab1[0].id
                    setBtnConfirmar(false);
                    try {
                        SalidasDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: existeCab1[0].date,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            cab_id: existeCab1[0].id,
                            eq_id: almacenar.current[0].id,
                            familia: almacenar.current[0].familia,
                            tipo: almacenar.current[0].tipo,
                            marca: almacenar.current[0].marca,
                            modelo: almacenar.current[0].modelo,
                            serie: almacenar.current[0].serie,
                            rfid: almacenar.current[0].rfid,
                            tipMov: 0,
                            observacion: '',
                            historial: 0, // = transito
                            confirmado: false,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('');
                        almacenar.current = [];
                        salidaid.current = [];
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
                        setBtnNuevo(false);
                        // return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else if (nomTipoOut === 'RETIRO SERVICIO TECNICO') {
                if (!existeStatusST) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Servicio Tecnico'
                    })
                } else {
                    inOut.current = 'PROCESO RETIRO S.T.';
                    cabid.current = existeCab1[0].id
                    setBtnConfirmar(false);
                    try {
                        SalidasDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: existeCab1[0].date,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            cab_id: existeCab1[0].id,
                            eq_id: almacenar.current[0].id,
                            familia: almacenar.current[0].familia,
                            tipo: almacenar.current[0].tipo,
                            marca: almacenar.current[0].marca,
                            modelo: almacenar.current[0].modelo,
                            serie: almacenar.current[0].serie,
                            rfid: almacenar.current[0].rfid,
                            tipMov: 0,
                            observacion: '',
                            historial: 0,
                            confirmado: false,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('');
                        almacenar.current = [];
                        salidaid.current = [];
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
                        setBtnNuevo(false);
                        // return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else {
                if (nomTipoOut === 'DEVOLUCION A PROVEEDOR' && existeeqprov.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no pertenece a este Proveedor o no ha sido arrendado'
                    })
                } else if (!existeStatusBod) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Bodega'
                    })
                } else {
                    if (nomTipoOut === 'PACIENTE') {
                        inOut.current = 'TRANSITO PACIENTE'
                    } else if (nomTipoOut === 'S. TECNICO CORRECTIVO') {
                        inOut.current = 'TRANSITO S.T.'
                    } else if (nomTipoOut === 'S. TECNICO PREVENTIVO') {
                        inOut.current = 'TRANSITO S.T.'
                    } else if (nomTipoOut === 'DEVOLUCION A PROVEEDOR') {
                        inOut.current = 'TRANSITO A PROVEEDOR'
                    } 
                    cabid.current = existeCab[0].id
                    setBtnConfirmar(false);
                    try {
                        SalidasDB({
                            numDoc: numDoc,
                            tipDoc: nomTipDoc,
                            date: existeCab[0].date,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            cab_id: existeCab[0].id,
                            eq_id: almacenar.current[0].id,
                            familia: almacenar.current[0].familia,
                            tipo: almacenar.current[0].tipo,
                            marca: almacenar.current[0].marca,
                            modelo: almacenar.current[0].modelo,
                            serie: almacenar.current[0].serie,
                            rfid: almacenar.current[0].rfid,
                            tipMov: 2,
                            observacion: '',
                            historial: 0,
                            confirmado: false,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('');
                        almacenar.current = [];
                        salidaid.current = [];
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
                        setBtnNuevo(false);
                        // return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            }
        }
        setNumSerie('');
        almacenar.current = [];
        salidaid.current = [];
    }
    
    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        cabid.current = dataSalida[0].cab_id

        if (dataSalida.length === 0) {
            Swal.fire('No hay Datos pr confirmar en este documento');
        } else {
            // const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
            const batch = writeBatch(db);
            dataSalida.forEach((docs) => {
                const docRef = doc(db, 'status', docs.eq_id);
                console.log(inOut.current)
                batch.update(docRef, {
                    status: inOut.current,
                    r_origen: empresa.rut,
                    n_origen: empresa.empresa,
                    r_destino: docs.rut,
                    n_destino: docs.entidad,
                    fechamod: docs.fechamod
                });
            });
            dataSalida.forEach((docs) => {
                const docRef = doc(db, 'salidas', docs.id);
                batch.update(docRef, {
                    confirmado: true,
                    fechamod: new Date()
                });
            });
            try {
                await batch.commit();
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Documentos actualizados correctamente.'
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al actualizar documentos:', error
                })
            }
            try {
                await updateDoc(doc(db, 'cabecerasout', cabid.current), {
                    confirmado: true,
                    tipmov: 0,
                    usermod: user.email,
                    fechamod: fechaMod
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al actualizar Cabecera:', error
                })
                console.log(error)
            }
            setNomTipDoc('');
            setNumDoc('');
            setDate('');
            setNomTipoOut('');
            setRut('');
            setEntidad('');
            setCorreo('');
            setPatente('');
            setNumSerie('');
            setConfirmar(false);
            setBtnGuardar(false);
            setBtnAgregar(true);
            setBtnConfirmar(true);
            setBtnNuevo(true);
            setFlag(!flag);
            if (nomTipoOut === 'PACIENTE' || nomTipoOut === 'SERVICIO TECNICO') {
                try {
                    /* const mensaje = documento.map((item, index) => `${index + 1}.-Equipo: ${item.tipo} ${item.marca} ${item.modelo} N.Serie: ${item.serie}`).join('\n'); */
                    const mensaje = cuerpoCorreo(dataSalida);
                    alertaSalida.forEach((destino) => {
                        EnviarCorreo(destino.correo, 'Alerta Salida de Bodega', mensaje)
                    })
                } catch (error) {
                    console.log('error', error)
                }
            }
            setFlag(!flag);
        }
    };
    const handleDelete = (itemId) => {
        setItemdelete(itemId);
        setShowConfirmation(true);
    }
    const cancelDelete = () => {
        setShowConfirmation(false);
    }
    const borrarItem = async () => {
        if (itemDelete) {
            try {
                await deleteDoc(doc(db, "salidas", itemDelete));
                setFlag(!flag);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Item eliminado exitosamente.'
                });
            } catch (error) {
                console.log('Error al eliminar items');
            }
        }
        setShowConfirmation(false);
    }

    const handleAnular = (itemId) => {
        setItemAnular(itemId);
        setShowConfirmationAnular(true);
    }
    const cancelAnular = () => {
        setShowConfirmationAnular(false);
    }
    const anular = async () => {
        const traerIn = collection(db, 'salidas');
        const datoIn = query(traerIn, where('cab_id', '==', itemAnular));
        const dataIn = await getDocs(datoIn)
        const detalle = (dataIn.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        try {
            await updateDoc(doc(db, 'cabecerasout', itemAnular), {
                tipmov: 3,
                fechamod: fechaMod
            });
        } catch (error) {
            Swal.fire('Error al Anular Documento');
        }

        if (detalle.length > 0) {
            const batch = writeBatch(db);
            detalle.forEach((docs) => {
                const docRef = doc(db, 'salidas', docs.id);
                batch.delete(docRef);
            });
            try {
                await batch.commit();
                console.log('Borro item')
            } catch (error) {
                console.log(error)
            }
        }
        cambiarEstadoAlerta(true);
        cambiarAlerta({
            tipo: 'exito',
            mensaje: 'Documento Anulado.'
        });
        setNumDoc('');
        setNomTipDoc('');
        setDate('');
        setNomTipoOut('');
        setRut('');
        setEntidad('');
        setConfirmar(false);
        setBtnGuardar(true);
        setBtnAgregar(true);
        setBtnConfirmar(false);
        setBtnNuevo(true);
        setFlag(!flag);
        setShowConfirmationAnular(false);
    }

    //Funcion para subir archivos al storega
    /* const subida = async (e) => {
        e.preventDefault();
        if (archivo !== null) {
            try {
                const result = await subirArchivos(archivo);
                console.log(result)
                window.open(result, '_blank');
            } catch (error) {
                console.log(error)
            }
        } else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha seleccionado ningun archivo'
            })
        }

    } */

    const cuerpoCorreo = (data) => {
        return ReactDOMServer.renderToString(
            <div style={{ backgroundColor: '#EEF2EF' }}>
                <h2>Salida de Bodega</h2>
                <div style={{ backgroundColor: '#EEF2EF' }}>
                    <p>Tipo de Salida :{data[0].tipoinout}</p>
                    <p>Numero Documento :{data[0].numdoc} </p>
                    <p>Tipo de Documento:{data[0].tipdoc} </p>
                    <p>Nombre :{data[0].entidad} </p>
                    <p>Rut :{data[0].rut} </p>
                </div>
                <br />
                <h3>Listado de equipos</h3>
                <p>Los siguientes equipos se encuentran en transito</p>
                <ul style={{ listStyle: 'none' }}>
                    {data.map((item, index) => (
                        <li key={index}>
                            <h5>{index + 1 + ".-" + item.tipo + " " + item.marca + " " + item.modelo + "    S/N : " + item.serie}</h5>
                        </li>
                    ))}
                </ul>
                <br />
                <h4>En espera de ser confirmados por el destinatario</h4>
            </div>
        )
    }

    // Agregar una nueva cabecera
    const nuevo = () => {
        setNumDoc('');
        setNomTipDoc('');
        setDate('');
        setNomTipoOut('');
        setRut('');
        setEntidad('');
        setNumSerie('');
        setCorreo('');
        setPatente('');
        setConfirmar(false);
        setBtnGuardar(true);
        setBtnAgregar(true);
        setBtnConfirmar(true);
        setBtnNuevo(true);
    }

    useEffect(() => {
        consultarCab();
        getEmpresa();
        transportista();
        getUsuarios();
        getAlertasSalidas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getStatus();
        consultarCab();
        consultarOut();
        transportista();
        // if (dataSalida.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Salida de Equipos</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>N° de Documento</Label>
                            <Input
                                disabled={confirmar}
                                type='number'
                                name='NumDoc'
                                placeholder='Ingrese N° Documento'
                                value={numDoc}
                                onChange={ev => {
                                    if (/^[1-9]\d*$/.test(ev.target.value)) {
                                        setNumDoc(ev.target.value)
                                    } else {
                                        cambiarEstadoAlerta(true);
                                        cambiarAlerta({
                                            tipo: 'error',
                                            mensaje: 'Por favor ingrese un numero positivo'
                                        })
                                        setNumDoc('')
                                    }
                                }}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Documento</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipDoc}
                                onChange={ev => setNomTipDoc(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipDocOut.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha Salida</Label>
                            <Input
                                disabled={confirmar}
                                type='datetime-local'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                                min={fechaMinima.toISOString().slice(0, 16)}
                                max={fechaMaxima.toISOString().slice(0, 16)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Tipo Salida</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipoOut}
                                onChange={ev => { setNomTipoOut(ev.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {TipoOut.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >{nomRut.current}</Label>
                            <Input
                                disabled={confirmar}
                                type='numero'
                                placeholder='Ingrese Rut sin puntos'
                                name='rut'
                                value={rut}
                                onChange={ev => setRut(ev.target.value)}
                                onKeyDown={detectarCli}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Correo Transportista</Label>
                            <Select
                                disabled={confirmar}
                                value={correo}
                                onChange={ev => setCorreo(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {transport.map((d) => {
                                    return (<option key={d.id}>{d.correo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Patente Vehiculo</Label>
                            <Input
                                disabled={confirmar}
                                type='texto'
                                placeholder='Ingrese Vehiculo'
                                name='patente'
                                value={patente}
                                onChange={ev => setPatente(ev.target.value)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <Label style={{ marginRight: '10px' }} >Descripcion</Label>
                        <TextArea
                            style={{ width: '80%', height: '60px' }}
                            type='text'
                            name='descripcion'
                            placeholder='Ingrese descripcion o detalles adicionales a la guía'
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </ContentElemenMov>
                    <BotonGuardar
                        style={{ margin: '35px 10px' }}
                        onClick={addCabeceraIn}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnGuardar}
                    >Guardar</BotonGuardar>
                    <BotonGuardar
                        style={{ margin: '35px 0' }}
                        onClick={nuevo}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnNuevo}
                    >Nuevo</BotonGuardar>
                   {/*  {mostrarSubir &&
                        (
                            <>
                                <div>
                                    <Input type="file" onChange={e => setArchivo(e.target.files[0])} />
                                    <BotonGuardar onClick={subida}>
                                        Subir
                                    </BotonGuardar>
                                </div>

                            </>
                        )
                    } */}
                </Formulario>
            </Contenedor>
            <Contenedor>
                <Formulario>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input
                                style={{ width: '500px' }}
                                type='text'
                                name='serie'
                                placeholder='Escanee o ingrese Equipo'
                                value={numSerie}
                                onChange={e => setNumSerie(e.target.value)}
                                onKeyDown={detectar}
                            />
                        </ContentElemenSelect>
                        <Boton disabled={btnAgregar} onClick={handleSubmit}>
                            <IoMdAdd
                                style={{ fontSize: '36px', color: '#328AC4', padding: '5px', marginRight: '15px', marginTop: '14px', cursor: "pointer" }}
                            />
                        </Boton>
                    </ContentElemenMov>
                </Formulario>
                <ListarEquipos>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Nombre de equipo</Table.HeaderCell>
                                <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign: 'center' }}>Eliminar</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {dataSalida.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <MdDeleteForever
                                                style={{ fontSize: '22px', color: '#69080A', }}
                                                onClick={() => handleDelete(item.id)}
                                                title='Eliminar Item'
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </ListarEquipos>
                <BotonGuardar onClick={actualizarDocs} disabled={btnConfirmar}>Confirmar</BotonGuardar>
            </Contenedor>
            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <Table singleLine style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Salida</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Confirmar</Table.HeaderCell>
                            <Table.HeaderCell>Anular</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {merge.map((item, index) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setNumDoc(item.numdoc);
                                        setNomTipDoc(item.tipdoc);
                                        setNomTipoOut(item.tipoinout);
                                        setRut(item.rut);
                                        setEntidad(item.entidad);
                                        fechaDate(item.date);
                                        setCorreo(item.correo);
                                        setPatente(item.patente);
                                        setBtnGuardar(true);
                                        setBtnAgregar(false);
                                        setConfirmar(true);
                                        setBtnNuevo(false);
                                        setBtnConfirmar(false);
                                        setFlag(!flag)
                                    }}><FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
                                    <Table.Cell>
                                        <FcCancel
                                            style={{ fontSize: '20px' }}
                                            onClick={() => handleAnular(item.id)}
                                            title='Anular Documento'
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
            {
                showConfirmation && (
                    <Overlay>
                        <ConfirmaModal>
                            <h2>¿Estás seguro de que deseas eliminar este elemento?</h2>
                            <ConfirmaBtn >
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={borrarItem}>Aceptar</Boton2>
                                <Boton2 onClick={cancelDelete}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
            {
                showConfirmationAnular && (
                    <Overlay>
                        <ConfirmaModal>
                            <h2>¿Estás seguro de que deseas anular este Documento?</h2>
                            <ConfirmaBtn >
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={anular}>Aceptar</Boton2>
                                <Boton2 onClick={cancelAnular}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
        </ContenedorProveedor>
    );
};
export default Salidas;