/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import SalidasDB from '../firebase/SalidasDB';
import CabeceraOutDB from '../firebase/CabeceraOutDB';
import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDocTraspaso, TipoOut, Traspaso } from './TipDoc';
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
import correlativos from '../funciones/correlativosMultiEmpresa';

const Traspasos = () => {
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
    const [cabecera1, setCabecera1] = useState([]);
    const [dataSalida, setDataSalida] = useState([]);
    const [status, setStatus] = useState([]);
    const [statusPaciente, setStatusPaciente] = useState([]);
    const [statusST, setStatusST] = useState([]);
    const [usuario, setUsuarios] = useState([]);
    const [transport, setTransport] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoOut, setNomTipoOut] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState([]);
    const [correo, setCorreo] = useState('');
    const [patente, setPatente] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(false);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const inOut = useRef('');
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
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('tipmov', '==', 4));
        const guardaCab = await getDocs(cab);
        setCabecera(guardaCab.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        const cab1 = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('tipmov', '==', 5));
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
    // //Lectura de status
    // const getStatus = async () => {
    //     const traerEntrada = collection(db, 'status');
    //     const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
    //     const data = await getDocs(dato)
    //     setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    // }
    //Lectura de status
    const getStatus = async () => {
        const doc = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('status', '==', 'PACIENTE'));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setStatus(documen)
    }
    // Lectura de status por pacientes
    const statusPacientes = async () => {
        const doc = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('r_permanente', '==', rut), where('status', '==', 'PACIENTE'));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setStatusPaciente(documen)
    }
    // Lectura de status por S.T.
    const statusSTecnico = async () => {
        const doc = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('r_permanente', '==', rut), where('status', '==', 'SERVICIO TECNICO'));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setStatusST(documen)
    }

    //Lee datos de los usuarios
    const getUsuarios = async () => {
        const dataUsuarios = collection(db, "usuarios");
        const dato = query(dataUsuarios, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setUsuarios(data.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
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

    const handleChange = (ev) => {
        setRut(ev.target.value);
        const nombre = status.filter(item => item.r_permanente === ev.target.value)
        setEntidad(nombre[0].n_permanente)
        setFlag(!flag)
    }
    
    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };
    // Guardar Cabecera de Documento en Coleccion CabeceraInDB
    const addCabeceraIn = async (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        // Filtar por docuemto de Cabecera Tipmov = 2
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut), where('tipmov', '==', 4));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Filtar por docuemto de Cabecera Tipmov = 0
        const cab1 = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut), where('tipmov', '==', 5));
        const cabecera1 = await getDocs(cab1);
        const existeCab1 = (cabecera1.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
        } else if (rut.length === 0 || rut === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Rut'
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
            // const folio = correlativos(users.emp_id, 'traspasos')
            // console.log(folio)
            const fechaInOut = new Date(date);
            if (nomTipoOut === 'PACIENTE') {
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
                        tipMov: 4,
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
            } else {
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
                        tipMov: 5,
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
        }
    }

    //Valida y guarda los detalles del documento
    const handleSubmit = async (e, item) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Exite N° serie en Salidas 
        const existeIn = dataSalida.filter(doc => doc.serie === item.serie);
        const existeIn2 = dataSalida.filter(doc => doc.eq_id === item.serie);
        // Validar en N° Serie en todos los documento de Salidas confirmado
        const traerSC = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('serie', '==', item.serie), where('confirmado', '==', false));
        const confirmadoS = await getDocs(traerSC);
        const existeconfirmado = (confirmadoS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Validar Id de Cabecera en Salidas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        console.log('existeCab', existeCab)
        const existeCab1 = cabecera1.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        console.log('existeCab1', existeCab1)

        if (existeIn.length > 0 || existeIn2.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra en este documento'
            })
        } else if (existeconfirmado.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra Ingresado en un documento por confirmar'
            })
        } else {
            if (nomTipoOut === 'PACIENTE') {
                inOut.current = 'TRANSITO A PACIENTE';
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
                        eq_id: item.id,
                        familia: item.familia,
                        tipo: item.tipo,
                        marca: item.marca,
                        modelo: item.modelo,
                        serie: item.serie,
                        rfid: '',
                        tipMov: 4,
                        observacion: '',
                        historial: 0, // = transito
                        confirmado: false,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        emp_id: users.emp_id,
                    });
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
            } else {
                inOut.current = 'TRANSITO S.T.';
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
                        eq_id: item.id,
                        familia: item.familia,
                        tipo: item.tipo,
                        marca: item.marca,
                        modelo: item.modelo,
                        serie: item.serie,
                        rfid: '',
                        tipMov: 5,
                        observacion: '',
                        historial: 0,
                        confirmado: false,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        emp_id: users.emp_id,
                    });
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

    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (dataSalida.length === 0) {
            Swal.fire('No hay Datos pr confirmar en este documento');
        } else {
            // const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
            if (nomTipoOut === 'PACIENTE') {
                const batch = writeBatch(db);
                dataSalida.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batch.update(docRef, {
                        status: inOut.current,
                        r_origen: '1234567',
                        n_origen: 'Dormir Bien Spa',
                        r_destino: rut,
                        n_destino: entidad,
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
            } else {
                const batch = writeBatch(db);
                dataSalida.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batch.update(docRef, {
                        status: inOut.current,
                        r_origen: rut,
                        n_origen: entidad,
                        r_destino: '1234567',
                        n_destino: 'Dormir Bien Spa',
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
            }
            setNumDoc('');
            setNomTipDoc('');
            setDate('');
            setNomTipoOut('');
            setRut('');
            setEntidad('');
            setCorreo('');
            setPatente('');
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
        transportista();
        getUsuarios();
        getAlertasSalidas();
        getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        consultarCab();
        consultarOut();
        transportista();
        statusPacientes();
        statusSTecnico();
        // if (dataSalida.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Traspasos</Titulo>
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
                                {TipDocTraspaso.map((d) => {
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
                                {Traspaso.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Rut Paciente</Label>
                            <Select
                                disabled={confirmar}
                                placeholder='Ingrese Rut sin puntos'
                                value={rut}
                                onChange={handleChange}
                            >
                                <option>Selecciona Opción:</option>
                                {status.map((d) => {
                                    return (<option key={d.key}>{d.r_permanente}</option>)
                                })}
                            </Select>

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
                            style={{ width: '80%', maxheight: '60px' }}
                            type='text'
                            name='descripcion'
                            maxLength="100"
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
                </Formulario>
            </Contenedor>
            <Contenedor>
                <Formulario>
                    <ContentElemenMov>
                        {/* <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input
                                style={{ width: '500px' }}
                                type='text'
                                name='serie'
                                placeholder='Escanee o ingrese Equipo'
                                value={numSerie}
                                onChange={e => setNumSerie(e.target.value)}
                                // onKeyDown={detectar}
                            />
                        </ContentElemenSelect>
                        <Boton disabled={btnAgregar} onClick={handleSubmit}>
                            <IoMdAdd
                                style={{ fontSize: '36px', color: '#328AC4', padding: '5px', marginRight: '15px', marginTop: '14px', cursor: "pointer" }}
                            />
                        </Boton> */}

                        <Table singleLine>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>N°</Table.HeaderCell>
                                    <Table.HeaderCell>tipo Equipamiento</Table.HeaderCell>
                                    <Table.HeaderCell>Serie</Table.HeaderCell>
                                    <Table.HeaderCell>Agregar</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {nomTipoOut === 'PACIENTE' ?
                                    (statusST.map((item, index) =>
                                        <Table.Row key={index}>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell> {item.tipo}</Table.Cell>
                                            <Table.Cell> {item.serie}</Table.Cell>
                                            <Table.Cell style={{ textAlign: 'center' }}>
                                                <Boton disabled={btnAgregar} onClick={(e) => handleSubmit(e, item)}>
                                                    <IoMdAdd
                                                        style={{ fontSize: '24px', color: '#328AC4', cursor: "pointer" }}
                                                    />
                                                </Boton>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                    ) : (
                                        statusPaciente.map((item, index) =>
                                            <Table.Row key={index}>
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                <Table.Cell> {item.tipo}</Table.Cell>
                                                <Table.Cell> {item.serie}</Table.Cell>
                                                <Table.Cell style={{ textAlign: 'center' }}>
                                                    <Boton disabled={btnAgregar} onClick={(e) => handleSubmit(e, item)}>
                                                        <IoMdAdd
                                                            style={{ fontSize: '24px', color: '#328AC4', cursor: "pointer" }}
                                                        />
                                                    </Boton>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    )
                                }
                            </Table.Body>
                        </Table>

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
                                    <Table.Row key={item.id2}>
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
export default Traspasos;