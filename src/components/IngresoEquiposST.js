import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import Alertas from './Alertas';
import AgregarClientesDb from '../firebase/AgregarClientesDb';
import IngresoStCabDB from '../firebase/IngresoStCabDB';
import UpdateIngresoStCabDB from '../firebase/UpdateIngresoStCabDB';
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
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { Servicio } from './TipDoc';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar, ConfirmaModal, Overlay, ConfirmaBtn, Boton2, Boton } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ContentElemen, Formulario, Input, Label, TextArea, Select } from '../elementos/CrearEquipos';
import correlativos from '../funciones/correlativosMultiEmpresa';
import BuscadorInput from './BuscadorInput';

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
    const [clientes, setClientes] = useState([]);
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
    const [btnGuardarCab, setBtnGuardarCab] = useState(true);
    const [btnValidarDet, setBtnValidarDet] = useState(true);
    const [btnGuardarDet, setBtnGuardarDet] = useState(true);
    const [btnValidarTest, setBtnValidarTest] = useState(true);
    const [btnGuardarTest, setBtnGuardarTest] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const [mostrarCli, setMostrarCli] = useState(false);
    const [isOpenCli, setIsOpenCli] = useState(true);
    const [mostrarEq, setMostrarEq] = useState(false);
    const [isOpenEq, setIsOpenEq] = useState(true);
    const [btnGuardarTestColor, setBtnGuardarTestColor] = useState('#43A854');
    const [serie, setSerie] = useState('');
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [nomMarca, setNomMarca] = useState('');
    const [nomModelo, setNomModelo] = useState('');
    const [servicio, setServicio] = useState('');
    const [obs, setObs] = useState('');
    const [flag, setFlag] = useState('');
    const [cont1, setCont1] = useState('#FF0000');
    const [cont2, setCont2] = useState(null);
    const [cont3, setCont3] = useState(null);
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
    //Traer clientes
    const consultarClientes = async () => {
        const sqlCte = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id));
        const Ctes = await getDocs(sqlCte);
        const existeCtes = (Ctes.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
        setClientes(existeCtes);
    }
    // // Filtar por docuemto de Cabecera
    // const consultarDet = async (item) => {
    //     const det = query(collection(db, 'ingresostdet'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', item.id));
    //     const guardaDet = await getDocs(det);
    //     const existeDet = (guardaDet.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    //     if (existeDet.length > 0) {
    //         setNomFamilia(existeDet[0].familia);
    //         setNomTipo(existeDet[0].tipo);
    //         setNomMarca(existeDet[0].marca);
    //         setNomModelo(existeDet[0].modelo);
    //         setSerie(existeDet[0].serie);
    //         setServicio(existeDet[0].servicio);
    //         setObs(existeDet[0].observaciones);
    //         consultarprot(existeDet[0].familia);
    //         setCont1('#D1D1D1');
    //         setCont2('#D1D1D1');
    //         setCont3('#FF0000');
    //         setConfirmarDet(true);
    //         setBtnGuardarDet(true);
    //         setMostrarTest(true);
    //     } else {
    //         setCont1('#D1D1D1');
    //         setCont2('#FF0000');
    //         setNomFamilia('');
    //         setNomTipo('');
    //         setNomMarca('');
    //         setNomModelo('');
    //         setSerie('');
    //         setServicio('');
    //         setObs('');
    //         setConfirmarDet(false);
    //         setMostrarTest(false);
    //     }
    // }
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
    //Seleccionar valores del cliente traidos del componente buscadorInput
    const handleSelectItem = (item) => {                
         const isObject= item!==null && typeof item==='object';//Valida si dato es un objeto o un valor normal
         if(isObject){
                setRut(item.rut);
                setEntidad(item.nombre);
                setTelefono(item.telefono);
                setDireccion(item.direccion);
                setCorreo(item.correo);            
                setBtnGuardarCab(false);
            }else{
                 //Patron para validar rut
                const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
                const temp = item.split('-');
                let digito = temp[1];
                if (digito === 'k' || digito === 'K') digito = -1;
                const validaR = validarRut(item);
                if(item===''){
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Favor ingresa un rut'
                    })
                    return;
                }else if (!expresionRegularRut.test(item)) {
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

            }else{
                //Asigna valor de rut validado pero que no existe en DB y activa mostrar model cliente nuevo.
                setRut(item)
                setOpenModalCli(true)
            }     
      };
    }
    //Limpia formulario Clientes
    const limpiaFormCte =()=>{
        setRut('');
        setEntidad('');
        setTelefono('');
        setDireccion('');
        setCorreo('');
        setBtnGuardarCab(true) 
    }

    // Filtar por docuemto de protoolo no confirmado => Funcional
    const consultarprot = async (fam) => {
        const prot = query(collection(db, 'protocolostest'), where('emp_id', '==', users.emp_id), where('familia', '==', fam)/*, where('confirmado','==',true)*/);
        const guardaprot = await getDocs(prot);
        const existeprot = (guardaprot.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, /*id2: index + 1,*/ valorsi: false, valorno: false })))
        setProtocolo(existeprot.sort((a, b) => a.fechamod - b.fechamod))
    }
    // protocolo.sort((a, b) => a.fechamod - b.fechamod)

    //esta parte ya no sirve---
    // Validar rut
  /*   const detectarCli = async (e) => {
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
                setBtnGuardarCab(false);
            }
        }
    } */
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
    // valida un Cliente nuevo en formulario modal
    const validarCli = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Patron para Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        //Patron para validar rut
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
            setBtnGuardarCab(false);
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
                    familia: '',
                    tipo: '',
                    marca: '',
                    modelo: '',
                    serie: '',
                    servicio: '',
                    observaciones: '',
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id
                })
                setBtnGuardarCab(true);
                setBtnValidarDet(false);
                setBtnGuardarDet(false);
                setBtnNuevo(false);
                setConfirmar(true);
                setMostrarInfoEq(true);
                setMostrarCli(true);
                setIsOpenCli(false);
                setMostrarEq(false);
                setIsOpenEq(true)
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Datos registrados exitosamente'
                })
                setFlag(!flag);
                setCont1('#d1d1d1');
                setCont2('#FF0000');
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
        const prot = query(collection(db, 'protocolostestcab'), where('emp_id', '==', users.emp_id), where('familia', '==', nomFamilia), where('confirmado', '==', true));
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
            setCont2('#D1D1D1');
            setCont3('#FF0000');
            setShowConfirmationDet(true);
            setBtnGuardarDet(false);
        }
    }

    // guardar los campos de ingreso detalle
    const ingresoDet = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        setBtnGuardarTestColor('#8F8B85');
        if (!btnGuardarDet) {
            setBtnGuardarDet(true);
            // Filtar por docuemto de Cabecera de Ingreso para guardar el id de cabecera y Date
            const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('folio', '==', folio), where('rut', '==', rut));
            const cabecera = await getDocs(cab);
            const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            console.log(existeCab)

            try {
                UpdateIngresoStCabDB({
                    id: existeCab[0].id,
                    familia: nomFamilia,
                    tipo: nomTipo,
                    marca: nomMarca,
                    modelo: nomModelo,
                    serie: serie,
                    servicio: servicio,
                    observaciones: '',
                    fechaMod: fechaMod
                })
                consultarprot(nomFamilia);
                setBtnValidarDet(true);
                setBtnGuardarDet(true);
                setBtnValidarTest(false);
                setBtnGuardarTest(false);
                setConfirmarDet(true);
                setShowConfirmationDet(false);
                setMostrarTest(true);
                setMostrarEq(true);
                setIsOpenEq(false);
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
        setTimeout(() => {
            setBtnGuardarDet(false);
            setBtnGuardarTestColor('#43A854');
        }, 2000);
    }
    // Cancelar Ingreso detalle
    const cancelDeleteDet = () => {
        setShowConfirmationDet(false);
        setBtnGuardarDet(false)
    }

    // // Agregar numero a protocolo para validación
    // const agregarNumero = () => {
    //     const nuevoarreglo = protocolo.map((p, index) => ({
    //         ...p,
    //         id2: index + 1
    //     }));
    //     setProtocolo(nuevoarreglo);
    // }
    // console.log(protocolo)

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
                return ' ' + i.item;
                // return (
                //     <li>{i.item}</li>
                // )
            })} deben estar seleccionados.`);
            // } else if (obs === '') {
            //     cambiarEstadoAlerta(true);
            //     cambiarAlerta({
            //         tipo: 'error',
            //         mensaje: 'Campo Observaciones no puede estar vacio'
            //     })
            //     return;
        } else {
            setShowConfirmationTest(true);
            setBtnGuardarTestColor('#43A854');
            if (obs === '') {
                setObs('Sin Observaciones')
            }
        }
    }
    // Boton Guardar => Funcional
    const guardarTest = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        setBtnGuardarTestColor('#8F8B85');
        if (!btnGuardarTest) {
            setBtnGuardarTest(true)

            // Filtar por docuemto de Cabecera de Ingreso para guardar el id de cabecera y Date
            const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('folio', '==', folio), where('rut', '==', rut));
            const cabecera = await getDocs(cab);
            const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            id.current = existeCab[0].id;

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
                    fechaadd: new Date(),
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
                await updateDoc(doc(db, 'ingresostcab', existeCab[0].id), {
                    confirmado: true,
                    observaciones: obs,
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
            setBtnGuardarCab(true);
            setBtnNuevo(true);
            setConfirmar(false);
            setConfirmarDet(false);
            setShowConfirmationTest(false);
            setMostrarInfoEq(false);
            setMostrarTest(false);
            setMostrarCli(false);
            setIsOpenCli(true);
            setCont1('#FF0000');
            setCont2('#D1D1D1');
            setCont3('#D1D1D1');
            setFlag(!flag)
        }
        setTimeout(() => {
            setBtnGuardarTest(false);
            setBtnGuardarTestColor('#43A854');
        }, 2000);
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
        setBtnGuardarCab(true);
        setBtnGuardarDet(true);
        setBtnGuardarTest(true);
        setBtnNuevo(true);
        setMostrarInfoEq(false);
        setMostrarTest(false);
        setFlag(!flag);
        setBtnGuardarTestColor('#43A854')
        setCont1('#FF0000');
        setCont2('#D1D1D1');
        setCont3('#D1D1D1');
    }

    useEffect(() => {
        getFamilia();
        getTipo();
        getMarca();
        getModelo();
        consultarCab();
        consultarIn();
        consultarClientes();
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
            <Contenedor bordercolor={cont1}>
                <Titulo style={{ width: '95%', display: 'inline-block' }}>Información Cliente</Titulo>
                {/* Boton de mostrat o no mostrar Datos de cliente */}
                {mostrarCli ?
                    <Boton onClick={() => {
                        setMostrarCli(false)
                        setIsOpenCli(true)
                        setFlag(!flag)
                    }}
                        style={{ width: '5%', fontSize: '28px', padding: '0', margin: '0', color: '#328AC4' }}
                        title='Mostrar Datos de Cliente'
                    >
                        <IoIosArrowDown />
                    </Boton>
                    :
                    <Boton onClick={() => {
                        setMostrarCli(true)
                        setIsOpenCli(false)
                    }}
                        style={{ width: '5%', fontSize: '28px', padding: '0', margin: '0', color: '#328AC4' }}
                        title='No Mostrar Datos de Cliente'
                    >
                        <IoIosArrowUp />
                    </Boton>
                }
                <hr style={{ margin: '10px 0px' }} />
                {/* Minimizar Datos del Cliente */}
                {isOpenCli &&
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
                                <Label>Cliente</Label>
                                <BuscadorInput items={clientes} onSelectItem={handleSelectItem} limpiaFormCte={limpiaFormCte}/>
                               {/*  {selectedItem && (
                                    <ItemModal
                                    isOpen={isModalOpen}
                                    onRequestClose={closeModal}
                                     //item={selectedItem}
                                    />
                                    )} */}
                                {/* <Input
                                    disabled={confirmar}
                                    type='numero'
                                    placeholder='Ingrese Rut sin puntos'
                                    name='rut'
                                    value={rut}
                                    onChange={ev => setRut(ev.target.value)}
                                    onKeyDown={detectarCli}
                                /> */}
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
                        <BotonGuardar disabled={btnGuardarCab} style={{ backgroundColor: btnGuardarCab && '#8F8B85', cursor: btnGuardarCab && 'default' }} onClick={ingresoCab}>Siguente</BotonGuardar>
                        {/* Pendiente Boton Nuevo */}
                        <BotonGuardar disabled={btnNuevo} style={{ backgroundColor: btnNuevo && '#8F8B85', cursor: btnNuevo && 'default' }} onClick={nuevo}>Nuevo</BotonGuardar>
                    </Formulario>
                }
            </Contenedor>

            {/* Informacion del Equipo */}
            {
                mostrarInfoEq && (
                    <Contenedor bordercolor={cont2} >
                        <Titulo style={{ width: '95%', display: 'inline-block' }}>Información Equipo</Titulo>
                        {/* Boton de mostrat o no mostrar Datos de cliente */}
                        {mostrarEq ?
                            <Boton onClick={() => {
                                setMostrarEq(false)
                                setIsOpenEq(true)
                                setFlag(!flag)
                            }}
                                style={{ width: '5%', fontSize: '28px', padding: '0', margin: '0', color: '#328AC4' }}
                                title='Mostrar Datos de Cliente'
                            >
                                <IoIosArrowDown />
                            </Boton>
                            :
                            <Boton onClick={() => {
                                setMostrarEq(true)
                                setIsOpenEq(false)
                            }}
                                style={{ width: '5%', fontSize: '28px', padding: '0', margin: '0', color: '#328AC4' }}
                                title='No Mostrar Datos de Cliente'
                            >
                                <IoIosArrowUp />
                            </Boton>
                        }
                        <hr style={{ margin: '10px 0px' }} />
                        {isOpenEq &&
                            <Formulario action=''>
                                <ContentElemenMov>
                                    <ContentElemenSelect>
                                        <Label>Familia</Label>
                                        <Select disabled={confirmarDet} value={nomFamilia} onChange={e => { setNomFamilia(e.target.value) }}>
                                            <option>Selecciona Opción:</option>
                                            {familia.map((d, index) => {
                                                return (<option key={index}>{d.familia}</option>)
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
                                <BotonGuardar disabled={btnValidarDet} style={{ backgroundColor: btnValidarDet && '#8F8B85', cursor: btnValidarDet && 'default' }} onClick={validarDet}>Siguente</BotonGuardar>
                            </Formulario>
                        }
                    </Contenedor>
                )
            }

            {/* Test de Ingreso */}
            {
                mostrarTest && (
                    <Contenedor bordercolor={cont3}>
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
                        <BotonGuardar disabled={btnValidarTest} onClick={validarTest}>Guardar y Confirmar</BotonGuardar>
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
                            <Table.HeaderCell>N°Orden</Table.HeaderCell>
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
                                    <Table.Cell style={{ cursor: 'pointer' }} onClick={() => {
                                        // consultarDet(item);
                                        setFolio(item.folio);
                                        setRut(item.rut);
                                        fechaDate(item.date)
                                        setEntidad(item.entidad);
                                        setTelefono(item.telefono);
                                        setDireccion(item.direccion);
                                        setCorreo(item.correo);
                                        setMostrarCli(true);
                                        setIsOpenCli(false);
                                        setMostrarInfoEq(true);
                                        if (item.familia === '') {
                                            setCont1('#D1D1D1');
                                            setCont2('#FF0000');
                                            setNomFamilia('');
                                            setNomTipo('');
                                            setNomMarca('');
                                            setNomModelo('');
                                            setSerie('');
                                            setServicio('');
                                            setObs('');
                                            consultarprot('');
                                            setBtnValidarDet(false)
                                            setConfirmarDet(false);
                                            setBtnGuardarDet(false);
                                            setMostrarTest(false);
                                            console.log(mostrarEq);
                                            console.log(isOpenEq);
                                            setMostrarEq(false);
                                            setIsOpenEq(true);
                                        } else {
                                            setNomFamilia(item.familia);
                                            setNomTipo(item.tipo);
                                            setNomMarca(item.marca);
                                            setNomModelo(item.modelo);
                                            setSerie(item.serie);
                                            setServicio(item.servicio);
                                            setObs(item.observaciones);
                                            consultarprot(item.familia);
                                            setCont1('#D1D1D1');
                                            setCont2('#D1D1D1');
                                            setCont3('#FF0000');
                                            setConfirmarDet(true);
                                            setBtnValidarDet(true)
                                            setBtnGuardarDet(true);
                                            setMostrarTest(true);
                                            setBtnValidarTest(false);
                                            setBtnGuardarTest(false);
                                            setMostrarEq(true);
                                            setIsOpenEq(false);
                                        }
                                        setConfirmar(true);
                                        setBtnGuardarCab(true);
                                        
                                        setBtnNuevo(false);
                                        setFlag(!flag)
                                        setBtnGuardarTestColor('#43A854')
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
                            <Table.HeaderCell>N.Orden</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N°Serie</Table.HeaderCell>
                            <Table.HeaderCell>Servicio</Table.HeaderCell>
                            <Table.HeaderCell>Ver PDF</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ingresado.map((item, index) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipo}</Table.Cell>
                                    <Table.Cell>{item.modelo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{item.servicio}</Table.Cell>
                                    <Table.Cell >
                                        <Link disabled to={`/ingresopdf/${item.id}`}>
                                            <FaRegFilePdf style={{ fontSize: '24px', color: 'red' }} title='Ver Orden de Ingreso' />
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
                                <Boton2 style={{ backgroundColor: '#43A854', }} onClick={guardarCli}>Guardar</Boton2>
                                <Boton2 style={{ backgroundColor: '#E34747' }} onClick={cancelDeleteCab}>Cancelar</Boton2>
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
                                <Boton2 activo={btnGuardarDet} color={btnGuardarTestColor} onClick={ingresoDet}>Guardar</Boton2>
                                <Boton2 color={'#E34747'} onClick={cancelDeleteDet}>Cancelar</Boton2>
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
                                <Boton2 activo={btnGuardarTest} color={btnGuardarTestColor} onClick={guardarTest}>Guardar</Boton2>
                                <Boton2 color={'#E34747'} onClick={cancelDeleteTest}>Cancelar</Boton2>
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