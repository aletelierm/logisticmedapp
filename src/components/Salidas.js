/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import SalidasDB from '../firebase/SalidasDB';
import CabeceraOutDB from '../firebase/CabeceraOutDB';
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoOut } from './TipDoc';
import * as FaIcons from 'react-icons/fa';
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Boton, BotonGuardar } from '../elementos/General';
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label } from '../elementos/CrearEquipos';
import EnviarCorreo from '../funciones/EnviarCorreo';
import ReactDOMServer from 'react-dom/server';

const Salidas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [alertaSalida, setAlertasalida] = useState([]);
    const [cabecera, setCabecera] = useState([]);
    const [dataSalida, setDataSalida] = useState([]);
    const [status, setStatus] = useState([]);
    const [usuario, setUsuarios] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoOut, setNomTipoOut] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [correo, setCorreo] = useState('');
    const [patente, setPatente] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const inOut = useRef('');
    const almacenar = useRef([]);

    //Lectura de usuario para alertas de salida
    const getAlertasSalidas = async () => {
        const traerAlertas = collection(db, 'usuariosalertas');
        const dato = query(traerAlertas, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato);
        setAlertasalida(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
        setCabecera(existeCab);
    }
    // Filtar por docuemto de Entrada
    const consultarOut = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setDataSalida(documento)
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
        const dataUsuarios = await getDocs(collection(db, "usuarios"));
        setUsuarios(dataUsuarios.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
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
    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoOut === 'CLIENTE' || nomTipoOut === 'RETIRO CLIENTE') {
                // Filtrar rut de Clientes
                const traerClie = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
                const rutCli = await getDocs(traerClie)
                const existeCli = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
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

            if (almacenar.current === undefined) {
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
            } else {
                const existeStatusCli = status.filter(st => st.id === almacenar.current[0].id && st.status === 'CLIENTE').length === 1;
                const existeStatusST = status.filter(st => st.id === almacenar.current[0].id && st.status === 'SERVICIO TECNICO').length === 1;
                const existeStatusBod = status.filter(st => st.id === almacenar.current[0].id && st.status === 'BODEGA').length === 1;
                if (nomTipoOut === 'RETIRO CLIENTE') {
                    if (!existeStatusCli) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Equipo no se encuentra en Cliente'
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
        // Filtar por docuemto de Cabecera
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
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
        } else {
            const traerClie = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(traerClie)
            const existeCli = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

            const traerProv = query(collection(db, 'proveedores'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutProv = await getDocs(traerProv)
            const existeProv = (rutProv.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

            const fechaInOut = new Date(date);
            if (nomTipoOut === 'CLIENTE') {
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
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
                            tipMov: 2,
                            confirmado: false,
                            entregado: false,
                            retirado: true,
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
            } else if (nomTipoOut === 'RETIRO CLIENTE') {
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
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
                            tipMov: 0,
                            confirmado: false,
                            entregado: true,
                            retirado: false,
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
                            tipMov: 0,
                            confirmado: false,
                            entregado: true,
                            retirado: false,
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
                            tipMov: 2,
                            confirmado: false,
                            entregado: false,
                            retirado: true,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Ingreso realizado exitosamente'
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
        // Exite N° serie en Entradas 
        const existeIn = dataSalida.filter(doc => doc.serie === numSerie);
        const existeIn2 = dataSalida.filter(doc => doc.eq_id === numSerie);
        // Validar Id de Cabecera en Salidas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);

        if (numSerie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese o Scaneé N° Serie'
            })
            return;
        } else if (almacenar.current === undefined) {
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
        } else {
            const existeStatusBod = status.filter(st => st.id === almacenar.current[0].id && st.status === 'BODEGA').length === 1;
            const existeStatusCli = status.filter(st => st.id === almacenar.current[0].id && st.status === 'CLIENTE').length === 1;
            const existeStatusST = status.filter(st => st.id === almacenar.current[0].id && st.status === 'SERVICIO TECNICO').length === 1;
            if (nomTipoOut === 'RETIRO CLIENTE') {
                if (!existeStatusCli) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Cliente'
                    })
                } else {
                    inOut.current = 'PROCESO RETIRO CLIENTE';
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
                            tipMov: 0,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('')
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
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
                if (!existeStatusST) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Servicio Tecnico'
                    })
                } else {
                    inOut.current = 'PROCESO RETIRO S.T.';
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
                            tipMov: 0,
                            observacion: '',
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('')
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
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
                if (!existeStatusBod) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Bodega'
                    })
                } else {
                    if (nomTipoOut === 'CLIENTE') {
                        inOut.current = 'TRANSITO CLIENTE'
                    } else if (nomTipoOut === 'SERVICIO TECNICO') {
                        inOut.current = 'TRANSITO S.T.'
                    } else {
                        inOut.current = nomTipoOut
                    }
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
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            emp_id: users.emp_id,
                        });
                        setNumSerie('')
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Item guardado correctamente'
                        })
                        setFlag(!flag);
                        setBtnConfirmar(false);
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
    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        const batch = writeBatch(db);
        dataSalida.forEach((docs) => {
            const docRef = doc(db, 'status', docs.eq_id);
            batch.update(docRef, { status: inOut.current, rut: rut, entidad: entidad, fechamod: docs.fechaadd });
        });
        try {
            await batch.commit();
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Documentos actualizados correctamente.'
            });
            await updateDoc(doc(db, 'cabecerasout', existeCab[0].id), {
                confirmado: true,
                usermod: user.email,
                fechamod: fechaMod
            });

            setFlag(!flag)
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al actualizar documentos:', error
            })
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
        setBtnGuardar(true);
        setBtnAgregar(true);
        setBtnConfirmar(true);
        setBtnNuevo(true);
        try {
            /* const mensaje = documento.map((item, index) => `${index + 1}.-Equipo: ${item.tipo} ${item.marca} ${item.modelo} N.Serie: ${item.serie}`).join('\n'); */
            const mensaje = cuerpoCorreo(dataSalida);
            alertaSalida.forEach((destino) => {
                EnviarCorreo(destino.correo, 'Alerta Salida de Bodega', mensaje)
            })
        } catch (error) {
            console.log('error', error)
        }
    };

    const cuerpoCorreo = (data) => {

        return ReactDOMServer.renderToString(
            <div>
                <h2>Salida de Bodega</h2>
                <p>Numero Documento :{data[0].numdoc} </p>
                <p>Tipo de Documento:{data[0].tipdoc} </p>
                <p>Nombre :{data[0].entidad} </p>
                <p>Rut :{data[0].rut} </p>
                <br />
                <p>Listado de equipos:</p>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <p>{index + 1 + ".-" + item.tipo + " " + item.marca + " " + item.modelo + "    S/N : " + item.serie}</p>
                        </li>
                    ))}
                </ul>
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
        getUsuarios();
        getAlertasSalidas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getStatus();
        consultarCab();
        consultarOut();
        if (dataSalida.length > 0) setBtnConfirmar(false);
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
                                type='text'
                                name='NumDoc'
                                placeholder='Ingrese N° Documento'
                                value={numDoc}
                                onChange={ev => setNumDoc(ev.target.value)}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Documento</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipDoc}
                                onChange={ev => setNomTipDoc(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipDoc.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha Ingreso</Label>
                            <Input
                                disabled={confirmar}
                                type='datetime-local'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Tipo Salida</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipoOut}
                                onChange={ev => setNomTipoOut(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipoOut.map((d) => {
                                    return (<option key={d.id}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Rut</Label>
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
                            <Input
                                disabled={confirmar}
                                type='texto'
                                placeholder='Ingrese Correo'
                                name='correo'
                                value={correo}
                                onChange={ev => setCorreo(ev.target.value)}
                            />
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
                    </ContentElemenMov>
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
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {dataSalida.map((item, index) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
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
                            <Table.HeaderCell>Tipo Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Conf</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cabecera.map((item, index) => {
                            return (
                                <Table.Row key={item.id2}>
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
                                        setBtnNuevo(true);
                                        setFlag(!flag)
                                    }}><FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
                                </Table.Row>
                            )
                        }
                        )}
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};
export default Salidas;