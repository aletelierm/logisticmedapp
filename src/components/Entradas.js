/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import EntradasDB from '../firebase/EntradasDB'
import CabeceraInDB from '../firebase/CabeceraInDB'
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
// import DatePicker from './DatePicker';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch, deleteDoc } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoIn } from './TipDoc'
import * as FaIcons from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Boton, BotonGuardar, ConfirmaModal, ConfirmaBtn, Boton2, Overlay } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label } from '../elementos/CrearEquipos';
import Swal from 'sweetalert2';
// import AgregarCampoB from '../herramientas/AgregarCampoB';
// import AgregarCampo from '../firebase/AgregarCampo';

const Entradas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemDelete, setItemdelete] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [dataEntrada, setDataEntrada] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [status, setStatus] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [date, setDate] = useState('');
    // const [date, setDate] = useState(new Date()); // DatePicker
    const [nomTipoIn, setNomTipoIn] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [price, setPrice] = useState('');
    const [flag, setFlag] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnConfirmar, setBtnConfirmar] = useState(false);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const almacenar = useRef([]);
    const entradaid = useRef([]);

    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'cabeceras'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
        setCabecera(existeCab);
    }
    // Filtar por docuemto de Entrada
    const consultarIn = async () => {
        const doc = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setDataEntrada(documento);
    }
    //Leer  Empresa
    const getEmpresa = async () => {
        const traerEmp = await getDoc(doc(db, 'empresas', users.emp_id));
        setEmpresa(traerEmp.data());
    }
    //Lectura de status
    const getStatus = async () => {
        const traerEntrada = collection(db, 'status');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
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
        setBtnGuardar(true)
        if (e.key === 'Enter' || e.key === 'Tab') {
            const p = query(collection(db, 'proveedores'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutProv = await getDocs(p)
            const final = (rutProv.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if (rutProv.docs.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe rut de proveedor'
                })
            } else {
                setEntidad(final[0].nombre);
                setBtnGuardar(false)
            }
        }
    }
    // Validar N°serie //Falta Revisar
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
            const existeIn = dataEntrada.filter(doc => doc.serie === numSerie);
            const existeIn2 = dataEntrada.filter(doc => doc.eq_id === numSerie);
            // Validar en N° Serie en todos los documento de Entradas
            const traerserie = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('tipoinout', '==', 'COMPRA'));
            const serieIn = await getDocs(traerserie);
            const existeSerie = (serieIn.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Validar en Eq_id en todos los documento de Entradas
            const traerEq_id = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('tipoinout', '==', 'COMPRA'));
            const inEq_id = await getDocs(traerEq_id);
            const existeEq_idIn = (inEq_id.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            // Validar en N° Serie en todos los documento de Entradas confirmado
            const traerSC = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('confirmado', '==', false));
            const confirmadoS = await getDocs(traerSC);
            const existeconfirmado = (confirmadoS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Validar en Eq_id en todos los documento de Entradas confirmado
            const traerID = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('confirmado', '==', false));
            const confirmadoID = await getDocs(traerID);
            const existeID = (confirmadoID.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

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
            } else if (existeSerie.length > 0 || existeEq_idIn.length > 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra Ingresado como Compra'
                })
            } else if (existeconfirmado.length > 0 || existeID.length > 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra Ingresado en un documento por confirmar'
                })
            } else {
                // Validar en entrdas que equipos esten en Arriendo/Comodato
                const existeStatusAoC = status.filter(st => st.id === almacenar.current[0].id && (st.status === 'DEVOLUCION PROVEEDOR' || st.status === 'PREPARACION')).length === 1;
                console.log('existeStatusAoC', existeStatusAoC)
                if (!existeStatusAoC) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo ya se encuentra Arrendado o en Comodato'
                    })
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
        // Filtar por docuemto de Cabecera
        const cab = query(collection(db, 'cabeceras'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

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
        } else if (nomTipoIn.length === 0 || nomTipoIn === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de Entrada'
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
            const fechaInOut = new Date(date);
            try {
                CabeceraInDB({
                    numDoc: numDoc,
                    tipDoc: nomTipDoc,
                    date: fechaInOut,
                    tipoInOut: nomTipoIn,
                    rut: rut,
                    entidad: entidad,
                    tipMov: 1,
                    confirmado: false,
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
    //Valida y guarda los detalles del documento
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Validar N° Serie en equipo
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
            console.log('almacenar', almacenar.current.length);
        }
        // Validar en N° Serie en el documento de Entradas que se esta trabatando     
        const existeIn = dataEntrada.filter(doc => doc.serie === numSerie);
        const existeIn2 = dataEntrada.filter(doc => doc.eq_id === numSerie);
        // Validar en N° Serie en todos los documento de Entradas
        const traerserie = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('tipoinout', '==', 'COMPRA'));
        const serieIn = await getDocs(traerserie);
        const existeSerie = (serieIn.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Validar en N° Serie en todos los documento de Entradas confirmado
        const traerSC = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('confirmado', '==', false));
        const confirmadoS = await getDocs(traerSC);
        const existeconfirmado = (confirmadoS.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Validar en Eq_id en todos los documento de Entradas
        const traerEq_id = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('tipoinout', '==', 'COMPRA'));
        const inEq_id = await getDocs(traerEq_id);
        const existeEq_idIn = (inEq_id.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        // Validar en Eq_id en todos los documento de Entradas confirmado
        const traerID = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', numSerie), where('confirmado', '==', false));
        const confirmadoID = await getDocs(traerID);
        const existeID = (confirmadoID.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        // Filtar por docuemto de Cabecera para guardar el id de cabecera y Date
        const cab = query(collection(db, 'cabeceras'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

        if (price === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese Precio de Equipo'
            })
            return;
        } else if (numSerie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese o Scaneé N° Serie'
            })
            return;
        } else if (almacenar.current.length === 0) {
            console.log('Validacion', almacenar.current.length)
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
        } else if (existeSerie.length > 0 || existeEq_idIn.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra Ingresado como Compra'
            })
        } else if (existeconfirmado.length > 0 || existeID.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra Ingresado en un documento por confirmar'
            })
        } else {
            // Validar en entrdas que equipos esten en Arriendo/Comodato
            const existeStatusAoC = status.filter(st => st.id === almacenar.current[0].id && (st.status === 'DEVOLUCION PROVEEDOR' || st.status === 'PREPARACION')).length === 1;
            console.log('existeStatusAoC', existeStatusAoC)
            if (!existeStatusAoC) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra Arrendado o en Comodato'
                })
            } else {
                try {
                    EntradasDB({
                        numDoc: numDoc,
                        tipDoc: nomTipDoc,
                        date: existeCab[0].date,
                        tipoInOut: nomTipoIn,
                        rut: rut,
                        entidad: entidad,
                        price: price,
                        cab_id: existeCab[0].id,
                        eq_id: almacenar.current[0].id,
                        familia: almacenar.current[0].familia,
                        tipo: almacenar.current[0].tipo,
                        marca: almacenar.current[0].marca,
                        modelo: almacenar.current[0].modelo,
                        serie: almacenar.current[0].serie,
                        rfid: almacenar.current[0].rfid,
                        tipMov: 1,
                        observacion: '',
                        confirmado: false,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        emp_id: users.emp_id,
                    });
                    setPrice('');
                    setNumSerie('');
                    almacenar.current = [];
                    entradaid.current = [];
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
        setPrice('');
        setNumSerie('');
        almacenar.current = [];
        entradaid.current = [];
    }

    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (dataEntrada.length === 0) {
            Swal.fire('No hay Datos por confirmar en este documento');
        } else {
            // Filtar por docuemto de Cabecera
            const cab = query(collection(db, 'cabeceras'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
            const cabecera = await getDocs(cab);
            const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id})));
            // Filtar por docuemto de Entrada
            const entra = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
            const entrada = await getDocs(entra);
            const existein = (entrada.docs.map((doc, index) => ({ ...doc.data(), id: doc.id})));

            // // Filtar por Status Preparacion Pendiente
            // const traerStatusPrep = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('serie', '==', numSerie), where('status', '==', 'PREPARACION'));
            // const status = await getDocs(traerStatusPrep);
            // const existeStatus = (status.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));

            const batch = writeBatch(db);
            dataEntrada.forEach((docs) => {
                const docRef = doc(db, 'status', docs.eq_id);
                batch.update(docRef, {
                    status: 'BODEGA',
                    rut: empresa.rut,
                    entidad: empresa.empresa,
                    price: existein[0].price,
                    tipoinout: existein[0].tipoinout,
                    fechamod: new Date()
                });
            });
            dataEntrada.forEach((docs) => {
                const docRef = doc(db, 'entradas', docs.id);
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
                    mensaje: 'Documento confirmado exitosamente.'
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al actualizar documentos:', error
                })
            }
            try {
                await updateDoc(doc(db, 'cabeceras', existeCab[0].id), {
                    confirmado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al confirmar Cabecera:', error
                })
            }
            setNomTipDoc('');
            setNumDoc('');
            setDate('');
            setNomTipoIn('');
            setRut('');
            setEntidad('');
            setNumSerie('');
            setPrice('');
            setConfirmar(false);
            setBtnConfirmar(true);
            setBtnAgregar(true);
            setBtnGuardar(false)
            setBtnNuevo(true);
            setFlag(!flag);
            setFlag2(!flag2);
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
                await deleteDoc(doc(db, "entradas", itemDelete));
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

    // // Función para eliminar Item por linea
    // const deleteItem = (id) => {
    //     const confirma = window.confirm("Estas seguro ??");
    //     if (confirma){
    //         borrarItem(id);
    //         setFlag(!flag)
    //     }       
    // }

    // Agregar una nueva cabecera
    const nuevo = () => {
        setNumDoc('');
        setNomTipDoc('');
        setDate('');
        setNomTipoIn('');
        setRut('');
        setEntidad('');
        setNumSerie('');
        setPrice('');
        setPrice('');
        setConfirmar(false);
        setBtnGuardar(true);
        setBtnAgregar(true);
        setBtnConfirmar(false);
        setBtnNuevo(true);
    }

    useEffect(() => {
        getStatus();
        getEmpresa();
        consultarCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag2, setFlag2])
    useEffect(() => {
        consultarIn();
        consultarCab();
        // if (dataEntrada.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])


    // const agregarCampo = async () => {
    //     // console.log('se ejecuta')
    //     // const data = await getDocs(collection(db, "status"));
    //     // setLeer(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //     const docu = query(collection(db, 'status'), where('emp_id', '==', users.emp_id));
    //     const docum = await getDocs(docu);
    //     const documento = (docum.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //     const batch = writeBatch(db);
    //     documento.forEach((docs) => {
    //         const docRef = doc(db, 'status', docs.id);
    //         batch.update(docRef, {
    //             status: 'PREPARACION'
    //         });
    //     });
    //     try {
    //         await batch.commit();
    //     } catch (error) {
    //         console.log("Error al guardar", error);
    //     }
    // }

    // Opcion 1
    // Poner miles en el precio
    // Crear un objeto Intl.NumberFormat para español en Chile
    // const formatoNumeroChile = new Intl.NumberFormat('es-CL');
    // Formatear el número utilizando el objeto Intl.NumberFormat para Chile
    // const numeroFormateadoChile = new Intl.NumberFormat('es-CL').format(price);
    // setPrice(numeroFormateadoChile)
    // console.log(numeroFormateadoChile); // Salida: "1.234.567"

    // const numero = 10000000;
    // const numeroComoTexto = numero.toString();
    // const numeroConSeparador = numeroComoTexto.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // console.log(numeroConSeparador); // Output: "1.000.000"

    // const handleInputChange = (event) => {
    //     const numeroIngresado = event.target.value;
    //     const numeroSinSeparadores = parseFloat(numeroIngresado.replace(/\./g, '').replace(/,/g, ''));
    //     const numeroConSeparador = numeroSinSeparadores.toLocaleString('es-CL');
    //     console.log(numeroConSeparador)
    //     setPrice(numeroConSeparador);
    // };

    return (
        <ContenedorProveedor>
            <Contenedor >
                <Titulo>Recepcion de Equipos</Titulo>
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
                                }
                                }
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
                                // type='datetime-local'
                                type='date'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            />
                            {/* <DatePicker date={date} setDate={setDate} /> */}
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Tipo Entrada</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipoIn}
                                onChange={ev => setNomTipoIn(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipoIn.map((d) => {
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

                    <BotonGuardar
                        style={{ margin: '10px 10px' }}
                        onClick={addCabeceraIn}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnGuardar}
                    >
                        Guardar</BotonGuardar>
                    <BotonGuardar
                        style={{ margin: '10px 0' }}
                        onClick={nuevo}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnNuevo}
                    >
                        Nuevo</BotonGuardar>
                    {/* <AgregarCampoB /> */}
                </Formulario>
            </Contenedor>
            <Contenedor>
                <Formulario>
                    <ContentElemenMov >
                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Precio</Label>
                            <Input
                                type='number'
                                min='1'
                                name='precio'
                                placeholder='Ingrese Valor'
                                value={price}
                                onChange={e => {
                                    if (/^[1-9]\d*$/.test(e.target.value)) {
                                        // Crear un objeto Intl.NumberFormat para español en Chile
                                        // const formatoNumeroChile = new Intl.NumberFormat('es-CL');
                                        // Formatear el número utilizando el objeto Intl.NumberFormat para Chile
                                        const numeroFormateadoChile = new Intl.NumberFormat('es-CL').format(e.target.value);
                                        console.log(numeroFormateadoChile); // Salida: "1.234.567"
                                        // setPrice(numeroFormateadoChile)
                                        setPrice(e.target.value)
                                    } else {
                                        cambiarEstadoAlerta(true);
                                        cambiarAlerta({
                                            tipo: 'error',
                                            mensaje: 'Por favor ingrese un numero positivo'
                                        })
                                        setPrice('')
                                    }
                                }}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input
                                style={{ width: '300px' }}
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
                                <Table.HeaderCell>Precio</Table.HeaderCell>
                                <Table.HeaderCell style={{ textAlign: 'center' }}>Eliminar</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {dataEntrada.map((item, index) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>${item.price}.-</Table.Cell>
                                        {
                                            item.tipoinout === 'COMPRA' || item.tipoinout === 'ARRIENDO' || item.tipoinout === 'COMODATO' ?
                                                <Table.Cell style={{ textAlign: 'center' }}>
                                                    <MdDeleteForever
                                                        style={{ fontSize: '22px', color: '#69080A', }}
                                                        onClick={() => handleDelete(item.id)}
                                                        title='Eliminar Item'
                                                    />
                                                </Table.Cell>
                                                :
                                                ''
                                        }
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
                            <Table.HeaderCell>Confirmar</Table.HeaderCell>
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
                                        fechaDate(item.date)
                                        setNomTipoIn(item.tipoinout);
                                        setRut(item.rut);
                                        setEntidad(item.entidad);
                                        setBtnGuardar(true);
                                        setBtnAgregar(false)
                                        setConfirmar(true);
                                        setBtnNuevo(false)
                                        setBtnConfirmar(false)
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
            {
                showConfirmation && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¿Estás seguro de que deseas eliminar este elemento?</h2>
                            <ConfirmaBtn className="confirmation-buttons">
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={borrarItem}>Aceptar</Boton2>
                                <Boton2 onClick={cancelDelete}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
        </ContenedorProveedor>
    );
};

export default Entradas;