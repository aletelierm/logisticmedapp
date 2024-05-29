import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import Alertas from './Alertas';
import AgregarClientesDb from '../firebase/AgregarClientesDb';
import IngresoStCabDB from '../firebase/IngresoStCabDB';
import IngresoStDetDB from '../firebase/IngresoStDetDB';
import validarRut from '../funciones/validarRut';
// import correlativos from '../funciones/correlativosMultiEmpresa';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { Regiones } from './comunas';
import * as IoIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';
import { FaRegFilePdf } from "react-icons/fa";
import { Servicio } from './TipDoc';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar, ConfirmaModal, Overlay, ConfirmaBtn, Boton2 } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ContentElemen, Formulario, Input, Label, TextArea, Select } from '../elementos/CrearEquipos';
import correlativos from '../funciones/correlativosMultiEmpresa';

const IngresoEquiposST = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    // const navigate = useNavigate();
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [cabecera, setCabecera] = useState([]);
    const [ingresado, setIngresado] = useState([]);
    const [protocolo, setProtocolo] = useState([]);
    const [familia, setFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [marca, setMarca] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [folio, setFolio] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [date, setDate] = useState('');
    const [confirmar, setConfirmar] = useState(false);
    const [confirmarDet, setConfirmarDet] = useState(false);
    const [openModalCli, setOpenModalCli] = useState(false);
    const [showConfirmationCab, setShowConfirmationCab] = useState(false);
    const [showConfirmationDet, setShowConfirmationDet] = useState(false);
    const [showConfirmationTest, setShowConfirmationTest] = useState(false);
    const [mostrarInfoEq, setMostrarInfoEq] = useState(false);
    const [mostrarTest, setMostrarTest] = useState(false);
    const [region, setRegion] = useState('Arica y Parinacota');
    const [comuna, setComuna] = useState('');
    const [checked, setChecked] = useState();
    const [nomRsf, setNomRsf] = useState('');
    const [dirRsf, setDirRsf] = useState('');
    const [telRsf, setTelRsf] = useState('');
    const [btnGuardarCab, setBtnGuardarCab] = useState(false);
    const [btnGuardarDet, setBtnGuardarDet] = useState(true);
    const [btnGuardarTest, setBtnGuardarTest] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const [serie, setSerie] = useState('');
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [nomMarca, setNomMarca] = useState('');
    const [nomModelo, setNomModelo] = useState('');
    const [servicio, setServicio] = useState('');
    const [obs, setObs] = useState('');
    const [flag, setFlag] = useState('');
    const checktest = useRef([]);
    const id = useRef('');

    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
        setCabecera(existeCab);
    }
    // Filtar por docuemto de Cabecera
    const consultarIn = async () => {
        const ing = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('estado', '==', 'INGRESADO'));
        const ingreso = await getDocs(ing);
        const existeIn = (ingreso.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
        setIngresado(existeIn.sort((a, b) => a.folio - b.folio));
    }
    // Filtar por docuemto de Cabecera
    const consultarDet = async (item) => {
        const det = query(collection(db, 'ingresostdet'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', item.id));
        const guardaDet = await getDocs(det);
        const existeDet = (guardaDet.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

        if (existeDet.length > 0) {
            setNomFamilia(existeDet[0].familia);
            setNomTipo(existeDet[0].tipo);
            setNomMarca(existeDet[0].marca);
            setNomModelo(existeDet[0].modelo);
            setSerie(existeDet[0].serie);
            setServicio(existeDet[0].servicio);
            setObs(existeDet[0].observaciones);
            consultarprot(existeDet[0].familia);
            setConfirmarDet(true);
            setBtnGuardarDet(true);
            setMostrarTest(true);
        } else {
            setNomFamilia('');
            setNomTipo('');
            setNomMarca('');
            setNomModelo('');
            setSerie('');
            setServicio('');
            setObs('');
            setConfirmarDet(false);
            setMostrarTest(false);
        }
    }
    //Leer los datos de Familia
    const getFamilia = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setFamilia(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    //Leer los datos de Tipos
    const getTipo = async () => {
        const traerTip = collection(db, 'tipos');
        const dato = query(traerTip, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setTipo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    //Leer los datos de Marcas
    const getMarca = async () => {
        const traerMar = collection(db, 'marcas');
        const dato = query(traerMar, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMarca(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    //Leer los datos de Modelos
    const getModelo = async () => {
        const traerMod = collection(db, 'modelos');
        const dato = query(traerMod, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setModelo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    // ordenar Familia, Tipo, Marca y Maodelo alfabeticamente
    familia.sort((a, b) => {
        const nameA = a.familia;
        const nameB = b.familia;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    tipo.sort((a, b) => {
        const nameA = a.tipo;
        const nameB = b.tipo;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    marca.sort((a, b) => {
        const nameA = a.marca;
        const nameB = b.marca;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    modelo.sort((a, b) => {
        const nameA = a.modelo;
        const nameB = b.modelo;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    // Filtar por docuemto de protoolo no confirmado => Funcional
    const consultarprot = async (fam) => {
        const prot = query(collection(db, 'protocolostest'), where('emp_id', '==', users.emp_id), where('familia', '==', fam)/*, where('confirmado','==',true)*/);
        const guardaprot = await getDocs(prot);
        const existeprot = (guardaprot.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valorsi: false, valorno: false })))
        setProtocolo(existeprot)
    }
    protocolo.sort((a, b) => a.fechamod - b.fechamod)

    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(cli)
            const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            //Patron para valiar rut
            const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
            const temp = rut.split('-');
            let digito = temp[1];
            if (digito === 'k' || digito === 'K') digito = -1;
            const validaR = validarRut(rut);

            if (!expresionRegularRut.test(rut)) {
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
            } else if (rutCli.docs.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe rut de Cliente'
                })
                setOpenModalCli(!openModalCli)
                setEntidad('');
                setTelefono('');
                setDireccion('');
                setCorreo('');
            } else {
                setEntidad(final[0].nombre);
                setTelefono(final[0].telefono);
                setDireccion(final[0].direccion);
                setCorreo(final[0].correo);
            }
        }
    }
    const handleChek = (e) => {
        setChecked(e.target.checked)
    }
    const handleButtonClick = (itemId, option) => {
        const updatedProt = protocolo.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    valorsi: option === 'opcion1' ? true : false,
                    valorno: option === 'opcion2' ? true : false
                }
            }
            return item;
        })
        setProtocolo(updatedProt)
    };

    const comunasxRegion = Regiones.find((option) => option.region === region).comunas
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
    // Guardar Cliente nuevo
    const validarCli = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Patron para Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        //Patron para valiar rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);

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
        } else if (nombre === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Nombre no puede estar vacio'
            })
            return;
        } else if (direccion === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Dirección no puede estar vacio'
            })
            return;
        } else if (telefono === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo telefono no puede estar vacio'
            })
            return;
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor ingresar un correo valido'
            })
            return;
        } else if (checked && nomRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo nombre RSF no puede estar vacio'
            })
            return;
        } else if (checked && dirRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Dirección no puede estar vacio'
            })
            return;
        } else if (checked && telRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo telefono no puede estar vacio'
            })
            return;
        } else {
            setShowConfirmationCab(true);
        }
    }
    // Guardar Cliente nuevo
    const guardarCli = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        try {
            const ruts = rut.toLocaleUpperCase().trim();
            const nom = nombre.toLocaleUpperCase().trim();
            const dir = direccion.toLocaleUpperCase().trim();
            const corr = correo.toLocaleLowerCase().trim();
            const nomrsf = nomRsf.toLocaleUpperCase().trim();
            const dirrsf = dirRsf.toLocaleUpperCase().trim();
            const telrsf = telRsf.toLocaleUpperCase().trim();
            AgregarClientesDb({
                emp_id: users.emp_id,
                rut: ruts,
                nombre: nom,
                direccion: dir,
                telefono: telefono,
                region: region,
                comuna: comuna,
                correo: corr,
                nomrsf: nomrsf,
                dirrsf: dirrsf,
                telrsf: telrsf,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Cliente registrado exitosamente'
            })
            setFlag(!flag);
            setRut(ruts);
            setEntidad(nom);
            setTelefono(telefono);
            setDireccion(dir);
            setCorreo(corr);
            setNomRsf('');
            setDirRsf('');
            setTelRsf('');
            setChecked(false)
            setOpenModalCli(!openModalCli)
            setShowConfirmationCab(false);
            return;
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: error
            })
        }
    }
    // Cancelar Ingreso Cabecera
    const cancelDeleteCab = () => {
        setShowConfirmationCab(false);
    }
    // Guardar Datos de Cliente en ingreso en coleccion IngresoStCab
    const ingresoCab = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que existe el rut en DB
        const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
        const rutCli = await getDocs(cli)
        //Patron para valiar rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);
        // Filtar por docuemto de Cabecera
        const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('folio', '==', folio));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));

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
        } else if (rutCli.docs.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe rut de Cliente'
            })
            setOpenModalCli(!openModalCli)
            return;
        } else if (date === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Fecha'
            })
            return;
        } else if (existeCab.length > 0) {
            if (existeCab[0].confirmado) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe un documento con este folio y se encuentra Confirmado'
                })
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe un documento con este folio. Falta confirmar'
                })
            }
        } else {
            const nuevoFolio = await correlativos(users.emp_id, 'ingresosst');
            setFolio(nuevoFolio);
            const fechaInSt = new Date(date);
            try {
                IngresoStCabDB({
                    folio: nuevoFolio,
                    rut: rut,
                    entidad: entidad,
                    telefono: telefono,
                    direccion: direccion,
                    correo: correo,
                    date: fechaInSt,
                    confirmado: false,
                    estado: 'POR CONFIRMAR',
                    tecnico: '',
                    fecha_out: '',
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id
                })
                setBtnGuardarCab(true);
                setBtnGuardarDet(false);
                setBtnNuevo(false);
                setConfirmar(true);
                setMostrarInfoEq(true);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Datos registrados exitosamente'
                })
                setFlag(!flag);
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
    // Validar Datos de equipo y abrir modal de confirmacion
    const validarDet = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que existe protocolo
        const prot = query(collection(db, 'protocolostestcab'), where('emp_id', '==', users.emp_id), where('familia', '==',nomFamilia), where('confirmado','==',true));
        const existeprot = await getDocs(prot);

        if (nomFamilia.length === 0 || nomFamilia === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Familia'
            })
            return;
        } else if (nomTipo.length === 0 || nomTipo === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de equipamiento'
            })
            return;
        } else if (nomMarca.length === 0 || nomMarca === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Marca'
            })
            return;
        } else if (nomModelo.length === 0 || nomModelo === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Modelo'
            })
            return;
        } else if (serie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Serie no puede estar vacio'
            })
            return;
        } else if (servicio.length === 0 || servicio === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de Servicio'
            })
            return;
        } else if (existeprot.docs.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No exite un Test de Ingreso para esta Familia. Favor crear'
            })
            return;
        } else {
            setShowConfirmationDet(true);
            setBtnGuardarDet(true);
        }
    }
    // guardar los campos de ingreso detalle
    const ingresoDet = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera de Ingreso para guardar el id de cabecera y Date
        const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('folio', '==', folio), where('rut', '==', rut));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        try {
            IngresoStDetDB({
                id_cab_inst: existeCab[0].id,
                folio: folio,
                rut: rut,
                date: existeCab[0].date,
                familia: nomFamilia,
                tipo: nomTipo,
                marca: nomMarca,
                modelo: nomModelo,
                serie: serie,
                servicio: servicio,
                observaciones: '',
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod,
                emp_id: users.emp_id
            })
            consultarprot(nomFamilia);
            setBtnGuardarDet(true);
            setBtnGuardarTest(false);
            setConfirmarDet(true);
            setShowConfirmationDet(false);
            setMostrarTest(true);
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Datos registrados exitosamente'
            })
            setFlag(!flag);
            return;
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: error
            })
        }
    }
    // Cancelar Ingreso detalle
    const cancelDeleteDet = () => {
        setShowConfirmationDet(false);
        setBtnGuardarDet(false)
    }

    // Boton Guardar => Funcional
    const validarTest = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        protocolo.forEach((docs, index) => {
            checktest.current = protocolo.filter(ic => ic.valorsi === false && ic.valorno === false)
        });

        if (checktest.current.length > 0) {
            Swal.fire(`Item ${checktest.current.map((i) => {
                return i.id2;
            })} deben estar seleccionados.`);
        } else if (obs === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Observaciones no puede estar vacio'
            })
            return;
        } else {
            setShowConfirmationTest(true);
            setBtnGuardarTest(true);
        }
    }
    // Boton Guardar => Funcional
    const guardarTest = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Filtar por docuemto de Cabecera de Ingreso para guardar el id de cabecera y Date
        const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('folio', '==', folio), where('rut', '==', rut));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        id.current = existeCab[0].id;

        const det = query(collection(db, 'ingresostdet'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', existeCab[0].id));
        const detalle = await getDocs(det);
        const existeDet = (detalle.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        protocolo.forEach((docs, index) => {
            checktest.current = protocolo.filter(ic => ic.valorsi === false && ic.valorno === false)
        });

        // Crea una nueva instancia de lote (batch)
        const batch = writeBatch(db);
        // Obtiene una referencia a una colección específica en Firestore
        const bitacoraTestRef = collection(db, 'testingreso');
        // Itera a través de los nuevos documentos y agrégalos al lote de Checks
        protocolo.forEach((docs) => {
            const nuevoDocRef = doc(bitacoraTestRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
            batch.set(nuevoDocRef, {
                id_cab_inst: existeCab[0].id,
                folio: existeCab[0].folio,
                nombretest: docs.nombre,
                familia: docs.familia,
                item: docs.item,
                item_id: docs.item_id,
                valorsi: docs.valorsi,
                valorno: docs.valorno,
                useradd: user.email,
                usermod: user.email,
                fechaadd: fechaAdd,
                fechamod: docs.fechamod,
                emp_id: users.emp_id,
            });
        });
        batch.commit()
            .then(() => {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Docuemento creado correctamente.'
                });
            })
            .catch((error) => {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al guardar Test de Ingreso:', error
                })
            })

        try {
            await updateDoc(doc(db, 'ingresostdet', existeDet[0].id), {
                observaciones: obs,
                usermod: user.email,
                fechamod: fechaMod
            });
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al actualizar detalle de Ingreso:', error
            })
        }
        try {
            await updateDoc(doc(db, 'ingresostcab', existeCab[0].id), {
                confirmado: true,
                estado: 'INGRESADO',
                usermod: user.email,
                fechamod: fechaMod
            });
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al actualizar cabecera de Ingreso:', error
            })
        }
        setFolio('');
        setRut('');
        setEntidad('');
        setDate('');
        setTelefono('');
        setDireccion('');
        setCorreo('');
        setNomFamilia('');
        setNomTipo('');
        setNomMarca('');
        setNomModelo('');
        setSerie('');
        setServicio('');
        setObs('');
        consultarprot('');
        setBtnGuardarTest(true);
        setShowConfirmationTest(false);
        setMostrarInfoEq(false);
        setMostrarTest(false);
        setFlag(!flag)
    }
    // Cancelar Ingreso detalle
    const cancelDeleteTest = () => {
        setShowConfirmationTest(false);
        setBtnGuardarTest(false)
    }

    // Agregar un Nuevo Ingreso
    const nuevo = () => {
        setFolio('');
        setRut('');
        setEntidad('');
        setDate('');
        setTelefono('');
        setDireccion('');
        setCorreo('');
        setNomFamilia('');
        setNomTipo('');
        setNomMarca('');
        setNomModelo('');
        setSerie('');
        setServicio('');
        setObs('');
        consultarprot('');
        setConfirmar(false);
        setConfirmarDet(false);
        setBtnGuardarCab(false);
        setBtnGuardarDet(true);
        setBtnGuardarTest(true);
        setBtnNuevo(true);
        setMostrarInfoEq(false);
        setMostrarTest(false);
        setFlag(!flag);
    }

    useEffect(() => {
        getFamilia();
        getTipo();
        getMarca();
        getModelo();
        consultarCab();
        consultarIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        consultarCab();
        consultarIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor >
                <Titulo>Orden de Ingreso de Equipos</Titulo>
            </Contenedor>
            {/* Informacion del Cliente */}
            <Contenedor>
                <Titulo>Información Cliente</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Folio</Label>
                            <Input
                                disabled
                                type='numero'
                                placeholder='Folio'
                                name='folio'
                                value={folio}
                            /* onChange={ev => setFolio(ev.target.value)} */
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Rut</Label>
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
                            <Label>Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha de Ingreso</Label>
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
                            <Label>Telefono</Label>
                            <Input value={telefono} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Dirección</Label>
                            <Input value={direccion} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Email</Label>
                            <Input value={correo} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar disabled={btnGuardarCab} style={{backgroundColor: btnGuardarCab  && '#8F8B85', cursor: btnGuardarCab && 'default'}} onClick={ingresoCab}>Siguente</BotonGuardar>
                    {/* Pendiente Boton Nuevo */}
                    <BotonGuardar disabled={btnNuevo} style={{backgroundColor: btnNuevo && '#8F8B85', cursor: btnNuevo && 'default' }} onClick={nuevo}>Nuevo</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Informacion del Equipo */}
            {
                mostrarInfoEq && (
                    <Contenedor >
                        <Titulo>Información Equipo</Titulo>
                        <Formulario action=''>
                            <ContentElemenMov>
                                <ContentElemenSelect>
                                    <Label>Familia</Label>
                                    <Select disabled={confirmarDet} value={nomFamilia} onChange={e => { setNomFamilia(e.target.value) }}>
                                        <option>Selecciona Opción:</option>
                                        {familia.map((d) => {
                                            return (<option key={d.id}>{d.familia}</option>)
                                        })}
                                    </Select>
                                </ContentElemenSelect>
                                <ContentElemenSelect>
                                    <Label>Tipo Equipamiento</Label>
                                    <Select disabled={confirmarDet} value={nomTipo} onChange={e => { setNomTipo(e.target.value) }}>
                                        <option>Selecciona Opción:</option>
                                        {tipo.map((d) => {
                                            return (<option key={d.id}>{d.tipo}</option>)
                                        })}
                                    </Select>
                                </ContentElemenSelect>
                                <ContentElemenSelect>
                                    <Label>Marca</Label>
                                    <Select disabled={confirmarDet} value={nomMarca} onChange={e => { setNomMarca(e.target.value) }}>
                                        <option>Selecciona Opción:</option>
                                        {marca.map((d) => {
                                            return (<option key={d.id}>{d.marca}</option>)
                                        })}
                                    </Select>
                                </ContentElemenSelect>
                            </ContentElemenMov>
                            <ContentElemenMov>
                                <ContentElemenSelect>
                                    <Label>Modelo</Label>
                                    <Select disabled={confirmarDet} value={nomModelo} onChange={e => { setNomModelo(e.target.value) }}>
                                        <option>Selecciona Opción:</option>
                                        {modelo.map((d) => {
                                            return (<option key={d.id}>{d.modelo}</option>)
                                        })}
                                    </Select>
                                </ContentElemenSelect>
                                <ContentElemenSelect>
                                    <Label>N° Serie</Label>
                                    <Input
                                        disabled={confirmarDet}
                                        type='text'
                                        placeholder='Ingrese N° Serie'
                                        name='serie'
                                        value={serie}
                                        onChange={e => { setSerie(e.target.value) }}
                                    />
                                </ContentElemenSelect>
                                <ContentElemenSelect>
                                    <Label>Tipo de Servicio</Label>
                                    <Select
                                        disabled={confirmarDet}
                                        value={servicio}
                                        onChange={e => { setServicio(e.target.value) }}>
                                        <option>Selecciona Opción:</option>
                                        {Servicio.map((d) => {
                                            return (<option key={d.key}>{d.text}</option>)
                                        })}
                                    </Select>
                                </ContentElemenSelect>
                            </ContentElemenMov>
                            {/* Guardar datos ingresados de detalle*/}
                            <BotonGuardar disabled={btnGuardarDet} style={{backgroundColor: btnGuardarDet && '#8F8B85', cursor: btnGuardarDet && 'default' }} onClick={validarDet}>Siguente</BotonGuardar>
                        </Formulario>
                    </Contenedor>
                )
            }

            {/* Test de Ingreso */}
            {
                mostrarTest && (
                    <Contenedor>
                <Titulo>Test de Ingreso</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Si</Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {protocolo.map((item, index) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.item}</Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type='checkbox'
                                            checked={item.valorsi}
                                            onChange={() => handleButtonClick(item.id, 'opcion1')}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            type='checkbox'
                                            checked={item.valorno}
                                            onChange={() => handleButtonClick(item.id, 'opcion2')}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <ContentElemenMov style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Label>Observaciones</Label>
                    <TextArea
                        style={{ width: '80%', height: '60px' }}
                        type='text'
                        name='descripcion'
                        placeholder='Ingrese observacion o detalles adicionales'
                        value={obs}
                        onChange={e => setObs(e.target.value)}
                    />
                </ContentElemenMov>
                <BotonGuardar disabled={btnGuardarTest} onClick={validarTest}>Guardar y Confirmar</BotonGuardar>
            </Contenedor>
                )
            }
            
            {/* Lista de Documetos por confirmar */}
            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <Table singleLine style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Confirmar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cabecera.map((item, index) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.estado}</Table.Cell>
                                    <Table.Cell style={{cursor:'pointer'}}onClick={() => {
                                        consultarDet(item);
                                        setFolio(item.folio);
                                        setRut(item.rut);
                                        fechaDate(item.date)
                                        setEntidad(item.entidad);
                                        setTelefono(item.telefono);
                                        setDireccion(item.direccion);
                                        setCorreo(item.correo);
                                        setConfirmar(true);
                                        setConfirmarDet(true);
                                        setBtnGuardarCab(true);
                                        setBtnGuardarDet(false);
                                        setBtnGuardarTest(false);
                                        setMostrarInfoEq(true);                                        
                                        setBtnNuevo(false);
                                        setFlag(!flag)                                        
                                    }}><FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>

            {/* Lista de Documetos Ingresados */}
            <ListarProveedor>
                <Titulo>Listado de Documentos Ingresados</Titulo>
                <Table singleLine style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Estado</Table.HeaderCell>
                            <Table.HeaderCell>Ver PDF</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ingresado.map((item, index) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.estado}</Table.Cell>
                                    <Table.Cell >
                                        <Link disabled to={`/ingresopdf/${item.id}`}>
                                            <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Ver Chec List de Mantencion' />
                                        </Link>
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
            {/* Modal para crear Cliente */}
            {
                openModalCli && (
                    <Overlay>
                        <ConfirmaModal>
                            <Titulo>Crear Cliente</Titulo>
                            <BotonCerrar onClick={() => setOpenModalCli(!openModalCli)}><IoIcons.IoMdClose /></BotonCerrar>
                            <Formulario action='' >
                                <ContentElemen>
                                    <Label>Rut</Label>
                                    <Input
                                        maxLength='10'
                                        type='text'
                                        name='rut'
                                        placeholder='Ingrese Rut sin puntos'
                                        value={rut}
                                        onChange={ev => setRut(ev.target.value)}
                                    />
                                    <Label>Nombre</Label>
                                    <Input
                                        type='text'
                                        name='nombre'
                                        placeholder='Ingrese Nombre'
                                        value={nombre}
                                        onChange={ev => setNombre(ev.target.value)}
                                    />
                                    <Label >Dirección</Label>
                                    <Input
                                        type='text'
                                        name='direccion'
                                        placeholder='Ingrese Dirección'
                                        value={direccion}
                                        onChange={ev => setDireccion(ev.target.value)}
                                    />
                                </ContentElemen>
                                <ContentElemen>
                                    <Label>Region</Label>
                                    <Select value={region} onChange={e => setRegion(e.target.value)} >
                                        {Regiones.map((r, index) => {
                                            return (
                                                <option key={index} >{r.region}</option>
                                            )
                                        })}
                                    </Select>
                                    <Label>Comuna</Label>
                                    <Select value={comuna} onChange={e => setComuna(e.target.value)} >
                                        {comunasxRegion.map((objeto, index) => {
                                            return (<option key={index}>{objeto.name}</option>)
                                        })}
                                    </Select>
                                </ContentElemen>
                                <ContentElemen>
                                    <Label >Telefono</Label>
                                    <Input
                                        type='number'
                                        name='telefono'
                                        placeholder='Ingrese Telefono'
                                        value={telefono}
                                        onChange={ev => setTelefono(ev.target.value)}
                                    />
                                    <Label>Email</Label>
                                    <Input
                                        type='email'
                                        name='correo'
                                        placeholder='Ingrese Correo'
                                        value={correo}
                                        onChange={ev => setCorreo(ev.target.value)}
                                    />
                                    <Label>Responsable financiero?</Label>
                                    <Input
                                        style={{ width: "3%", color: "#328AC4" }}
                                        type="checkbox"
                                        checked={checked}
                                        onChange={handleChek}
                                    />
                                </ContentElemen>

                                {checked ?
                                    <ContentElemen>
                                        <Label>Nombre</Label>
                                        <Input
                                            name="nombrersf"
                                            type="text"
                                            placeholder='Responsable financiero'
                                            value={nomRsf}
                                            onChange={ev => setNomRsf(ev.target.value)}
                                        />
                                        <Label>Dirección</Label>
                                        <Input
                                            name="direccionrsf"
                                            type="text"
                                            placeholder='Ingres dirección'
                                            value={dirRsf}
                                            onChange={ev => setDirRsf(ev.target.value)}
                                        />
                                        <Label>Telefono</Label>
                                        <Input
                                            name="telefonorsf"
                                            type="number"
                                            placeholder='Ingrese telefono'
                                            value={telRsf}
                                            onChange={ev => setTelRsf(ev.target.value)}
                                        />
                                    </ContentElemen>
                                    : ''
                                }
                            </Formulario>
                            <BotonGuardar onClick={validarCli} >Guardar</BotonGuardar>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
            {/* Modal de confirmacion de informacion de Cliente */}
            {
                showConfirmationCab && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¿Estás seguro de que deseas guardar estos datos de cliente?</h2>
                            <ConfirmaBtn className="confirmation-buttons">
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={guardarCli}>Guardar</Boton2>
                                <Boton2 onClick={cancelDeleteCab}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
            {/* Modal de confirmacion de informacion de equipos */}
            {
                showConfirmationDet && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¿Estás seguro de que deseas guarda estos elementos?</h2>
                            <ConfirmaBtn className="confirmation-buttons">
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={ingresoDet}>Guardar</Boton2>
                                <Boton2 onClick={cancelDeleteDet}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
            {/* Modal de confirmacion de Test de Ingreso */}
            {
                showConfirmationTest && (
                    <Overlay>
                        <ConfirmaModal className="confirmation-modal">
                            <h2>¿Estás seguro de que deseas guarda estos elementos?</h2>
                            <ConfirmaBtn className="confirmation-buttons">
                                <Boton2 style={{ backgroundColor: 'red' }} onClick={guardarTest}>Guardar</Boton2>
                                <Boton2 onClick={cancelDeleteTest}>Cancelar</Boton2>
                            </ConfirmaBtn>
                        </ConfirmaModal>
                    </Overlay>
                )
            }
        </ContenedorProveedor >
    )
}

export default IngresoEquiposST;

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