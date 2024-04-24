import React, { useState, useEffect /*useRef*/ } from 'react'
import styled from 'styled-components';
import Alertas from './Alertas';
import AgregarClientesDb from '../firebase/AgregarClientesDb';
// import AgregarFamiliaDb from '../firebase/AgregarFamiliaDb';
import IngresoStCabDB from '../firebase/IngresoStCabDB';
// import IngresoStDetDB from '../firebase/IngresoStDetDB';
import validarRut from '../funciones/validarRut';
// import correlativos from '../funciones/correlativosMultiEmpresa';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query /*, doc getDoc*/ } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { Regiones } from './comunas';
import * as IoIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';
import { Servicio } from './TipDoc';
// import { IoMdAdd } from "react-icons/io";
import moment from 'moment';
import { ContenedorProveedor, Contenedor, ListarProveedor, /*Boton*/ Titulo, BotonGuardar, ConfirmaModal, Overlay } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ContentElemen, Formulario, Input, Label, /*, ListarEquipos, Select,*/ TextArea, Select } from '../elementos/CrearEquipos';

const IngresoEquiposST = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [cabecera, setCabecera] = useState([]);
    const [familia, setFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [marca, setMarca] = useState([]);
    const [modelo, setModelo] = useState([]);
    // const [folio, setFolio] = useState('');
    const [folio, setFolio] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [date, setDate] = useState('');
    const [confirmar, setConfirmar] = useState(false);
    const [openModalCli, setOpenModalCli] = useState(false);
    const [region, setRegion] = useState('Arica y Parinacota');
    const [comuna, setComuna] = useState('');
    const [checked, setChecked] = useState();
    const [nomRsf, setNomRsf] = useState('');
    const [dirRsf, setDirRsf] = useState('');
    const [telRsf, setTelRsf] = useState('');
    // const [openModalEq, setOpenModalEq] = useState(false);
    // const [openModalFam, setOpenModalFam] = useState(false);
    const [serie, setSerie] = useState('');
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [nomMarca, setNomMarca] = useState('');
    const [nomModelo, setNomModelo] = useState('');
    const [servicio, setServicio] = useState('');
    const [flag, setFlag] = useState('');
    // const almacenar = useRef([]);

    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
        setCabecera(existeCab);
    }
    console.log('cabecera', cabecera)
    //Leer los datos de Familia
    const getFamilia = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setFamilia(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Tipos
    const getTipo = async () => {
        const traerTip = collection(db, 'tipos');
        const dato = query(traerTip, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setTipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Marcas
    const getMarca = async () => {
        const traerMar = collection(db, 'marcas');
        const dato = query(traerMar, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMarca(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Modelos
    const getModelo = async () => {
        const traerMod = collection(db, 'modelos');
        const dato = query(traerMod, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setModelo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
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

    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // setBtnGuardar(true)
        if (e.key === 'Enter' || e.key === 'Tab') {
            const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(cli)
            const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if (rutCli.docs.length === 0) {
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
                // setBtnGuardar(false)
            }
        }
    }
    const handleChek = (e) => {
        setChecked(e.target.checked)
    }

    // // Validar N°serie
    // const detectarEq = async (e) => {
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});
    //     if (e.key === 'Enter' || e.key === 'Tab') {
    //         // Exite N° serie en equipos   
    //         const traerEq = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie', '==', serie));
    //         const serieEq = await getDocs(traerEq);
    //         const existe = (serieEq.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //         // Exite ID en equipos
    //         const traerId = await getDoc(doc(db, 'equipos', serie));
    //         if (existe.length === 1) {
    //             almacenar.current = existe;
    //         } else if (traerId.exists()) {
    //             const existeId = traerId.data();
    //             const arreglo = [existeId];
    //             const existe2 = arreglo.map((doc) => ({ ...doc, id: serie }));
    //             almacenar.current = existe2;
    //         } else {
    //             console.log('almacenar', almacenar.current);
    //         }

    //         if (almacenar.current.length === 0) {
    //             cambiarEstadoAlerta(true);
    //             cambiarAlerta({
    //                 tipo: 'error',
    //                 mensaje: 'No existe un Equipo con este N° Serie o Id'
    //             })
    //             setOpenModalEq(!openModalEq)
    //             setNomFamilia('');
    //             setNomTipo('');
    //             setNomMarca('');
    //             setNomModelo('');
    //         } else {
    //             setNomFamilia(almacenar.current[0].familia);
    //             setNomTipo(almacenar.current[0].tipo);
    //             setNomMarca(almacenar.current[0].marca);
    //             setNomModelo(almacenar.current[0].modelo);
    //             // setBtnGuardar(false)
    //         }
    //     }
    // }
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
    const guardarCli = (e) => {
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
                setRut('');
                setNombre('');
                setDireccion('');
                setTelefono('');
                setCorreo('');
                setNomRsf('');
                setDirRsf('');
                setTelRsf('');
                setChecked(false)
                setOpenModalCli(!openModalCli)
                return;
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: error
                })
            }
            setEntidad(nombre);
            setTelefono(telefono);
            setDireccion(direccion);
            setCorreo(correo);
        }
    }
    // // Guardar Equipo nuevo
    // const guardarEq = async (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});
    //     // setFlag(false);

    //     if (nomFamilia === '' || nomFamilia === 'Selecciona Opción:') {
    //         console.log(nomFamilia);
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Favor Seleccionar Familia'
    //         })
    //     } else if (nomTipo === '' || nomTipo === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Favor Seleccionar Tipo Equipamiento'
    //         })
    //     } else if (nomMarca === '' || nomMarca === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Favor Seleccionar Marca'
    //         })
    //     } else if (nomModelo === '' || nomModelo === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Favor Seleccionar Modelo'
    //         })
    //     } else if (serie === '') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Favor Ingresar N° Serie'
    //         })
    //     } else {
    //         // try {
    //         //     //llama a la funcion guardar equipos y status, pasando los props
    //         //     const ser = serie.trim()
    //         //     EquipoDb({
    //         //         familia: nomFamilia,
    //         //         tipo: nomTipo,
    //         //         marca: nomMarca,
    //         //         modelo: nomModelo,
    //         //         serie: ser,
    //         //         rfid: rfid,
    //         //         userAdd: user.email,
    //         //         userMod: user.email,
    //         //         fechaAdd: fechaAdd,
    //         //         fechaMod: fechaMod,
    //         //         emp_id: users.emp_id,
    //         //         rut: users.rut,
    //         //         nomEntidad: users.empresa,
    //         //         status: 'PREPARACION'
    //         //     })
    //         //     cambiarEstadoAlerta(true);
    //         //     cambiarAlerta({
    //         //         tipo: 'exito',
    //         //         mensaje: 'Equipo creado correctamente'
    //         //     })
    //         //     setFlag(!flag);
    //         // } catch (error) {
    //         //     console.log(error);
    //         // }
    //     }
    // }
    // Guardar Familia nuevo
    // const guardarFam = (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});

    //     if (nomFamilia2 === '') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'No ha ingresado una Familia'
    //         })
    //     } else {
    //         const fam = nomFamilia2.toLocaleUpperCase().trim()
    //         AgregarFamiliaDb({
    //             familia: fam,
    //             userAdd: user.email,
    //             userMod: user.email,
    //             fechaAdd: fechaAdd,
    //             fechaMod: fechaMod,
    //             emp_id: users.emp_id
    //         })
    //             .then(() => {
    //                 cambiarEstadoAlerta(true);
    //                 cambiarAlerta({
    //                     tipo: 'exito',
    //                     mensaje: 'Familia Ingresada Correctamente'
    //                 })
    //                 setNomFamilia2('');
    //                 setOpenModalFam(!openModalFam)
    //             })
    //     }
    // }

    // Guardar Datos de Cliente en ingreso en coleccion IngresoStCab
    const ingresoCab = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que existe el rut en DB
        const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
        const rutCli = await getDocs(cli)
        // const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
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

        if (folio === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Folio no puede estar vacio'
            })
            return;
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
            // const nuevoFolio = await correlativos(users.emp_id, 'ingresoSt');
            // setFolio(nuevoFolio);
            // console.log('folio antes de guardar', nuevoFolio)
            const fechaInSt = new Date(date);
            try {
                IngresoStCabDB({
                    folio: folio,
                    rut: rut,
                    entidad: entidad,
                    telefono: telefono,
                    direccion: direccion,
                    correo: correo,
                    date: fechaInSt,
                    confirmado: false,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id
                })
                setFolio('');
                setRut('');
                setEntidad('');
                setDireccion('');
                setTelefono('');
                setCorreo('');
                setDate('')
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

    // // Guardar Datos de equipo en ingreso en coleccion IngresoStdet
    // const ingresoDet = async (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});
    //     // Filtar por docuemto de Cabecera de Ingreso para guardar el id de cabecera y Date
    //     const cab = query(collection(db, 'ingresostcab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false), where('folio', '==', folio), where('rut', '==', rut));
    //     const cabecera = await getDocs(cab);
    //     const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));


    //     if (nomFamilia.length === 0 || nomFamilia === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Seleccione una Familia'
    //         })
    //         return;
    //     } else if (nomTipo.length === 0 || nomTipo === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Seleccione un Tipo de equipamiento'
    //         })
    //         return;
    //     } else if (nomMarca.length === 0 || nomMarca === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Seleccione una Marca'
    //         })
    //         return;
    //     } else if (nomModelo.length === 0 || nomModelo === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Seleccione un Modelo'
    //         })
    //         return;
    //     } else if (serie === '') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Campo Serie no puede estar vacio'
    //         })
    //         return;
    //     } else if (servicio.length === 0 || servicio === 'Selecciona Opción:') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Seleccione un Tipo de Servicio'
    //         })
    //         return;
    //     } else {
    //         const fechaInSt = new Date(date);
    //         try {
    //             IngresoStDetDB({
    //                 id_cab_inst: existeCab[0].id,
    //                 folio: folio,
    //                 rut: rut,
    //                 date: existeCab[0].date,
    //                 id_test: '',
    //                 familia: nomFamilia,
    //                 tipo: nomTipo,
    //                 marca: nomMarca,
    //                 modelo: nomModelo,
    //                 serie: serie,
    //                 userAdd: user.email,
    //                 userMod: user.email,
    //                 fechaAdd: fechaAdd,
    //                 fechaMod: fechaMod,
    //                 emp_id: users.emp_id
    //             })
    //             setNomFamilia('');
    //             setNomTipo('');
    //             setNomMarca('');
    //             setNomModelo('');
    //             setSerie('');
    //             setServicio('')
    //             cambiarEstadoAlerta(true);
    //             cambiarAlerta({
    //                 tipo: 'exito',
    //                 mensaje: 'Datos registrados exitosamente'
    //             })
    //             setFlag(!flag);
    //             return;
    //         } catch (error) {
    //             cambiarEstadoAlerta(true);
    //             cambiarAlerta({
    //                 tipo: 'error',
    //                 mensaje: error
    //             })
    //         }
    //     }
    // }

    useEffect(() => {
        getFamilia();
        getTipo();
        getMarca();
        getModelo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        consultarCab();
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
                                disabled={confirmar}
                                type='numero'
                                placeholder='Ingrese Folio'
                                name='folio'
                                value={folio}
                                onChange={ev => setFolio(ev.target.value)}
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
                            // min={fechaMinima.toISOString().slice(0, 16)}
                            // max={fechaMaxima.toISOString().slice(0, 16)}
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
                    <BotonGuardar onClick={ingresoCab}>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Informacion del Equipo */}
            <Contenedor>
                <Titulo>Información Equipo</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Familia</Label>
                            <Select value={nomFamilia} onChange={e => { setNomFamilia(e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {familia.map((d) => {
                                    return (<option key={d.id}>{d.familia}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo Equipamiento</Label>
                            <Select value={nomTipo} onChange={e => { setNomTipo(e.target.value); sessionStorage.setItem('tipo', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {tipo.map((d) => {
                                    return (<option key={d.id}>{d.tipo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Marca</Label>
                            <Select value={nomMarca} onChange={e => { setNomMarca(e.target.value); sessionStorage.setItem('marca', e.target.value) }}>
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
                            <Select value={nomModelo} onChange={e => { setNomModelo(e.target.value); sessionStorage.setItem('modelo', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {modelo.map((d) => {
                                    return (<option key={d.id}>{d.modelo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>N° Serie</Label>
                            <Input
                                type='text'
                                placeholder='Ingrese N° Serie'
                                name='serie'
                                value={serie}
                                onChange={e => setSerie(e.target.value)}
                            // onKeyDown={detectarEq}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Servicio</Label>
                            <Select
                                disabled={confirmar}
                                value={servicio}
                                onChange={ev => setServicio(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {Servicio.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar /*onClick={ingresoDet}*/>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Test de Ingreso */}
            <Contenedor>
                <Titulo>Test de Ingreso</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Si</Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Equipo ¿Enciende?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>¿Entrega flujo?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filtro espuma</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Accesorios</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Trajeta memoria</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Fuente de poder o cable</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Manguera</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Bolso</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Cámara de agua</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Climate control</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <ContentElemenMov style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Label>Observaciones</Label>
                    <TextArea
                        style={{ width: '80%', height: '60px' }}
                        type='text'
                        name='descripcion'
                        placeholder='Ingrese observacion o detalles adicionales'
                    // value={descripcion}
                    // onChange={e => setDescripcion(e.target.value)}
                    />
                </ContentElemenMov>
                <BotonGuardar>Guardar</BotonGuardar>
                <BotonGuardar>Nuevo</BotonGuardar>
            </Contenedor>

            {/* Lista de Documetos por confrmar */}
            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <Table singleLine style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>folio</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Confirmar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cabecera.map((item, index) => {
                            return (
                                <Table.Row key={item.id2}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.folio}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setFolio(item.folio);
                                        setRut(item.rut);
                                        fechaDate(item.date)
                                        setEntidad(item.entidad);
                                        setTelefono(item.telefono);
                                        setDireccion(item.direccion);
                                        setCorreo(item.correo);
                                        setConfirmar(true);
                                        // setBtnConfirmar(false)
                                        setFlag(!flag)
                                    }}><FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
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
            {openModalCli && (
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
                        <BotonGuardar onClick={guardarCli} >Guardar</BotonGuardar>
                    </ConfirmaModal>
                </Overlay>
            )}
            {/* Modal para crear Equipo */}
            {/* {openModalFam && (
                <Overlay>
                    <ConfirmaModal>
                        <Titulo>Crear Familia</Titulo>
                        <BotonCerrar onClick={() => setOpenModalFam(!openModalFam)}><IoIcons.IoMdClose /></BotonCerrar>
                        <Formulario action='' >
                            <ContentElemen>
                                <Label>Familia</Label>
                                <Input style={{ width: '400px' }} 
                                    type='text'
                                    placeholder='Ingrese Familia Equipamiento Médico'
                                    // name='familia'
                                    // value={nomFamilia2}
                                    // onChange={e => setNomFamilia2(e.target.value)}
                                />
                            </ContentElemen>
                        </Formulario>
                        <BotonGuardar onClick={guardarFam} >Guardar</BotonGuardar>
                    </ConfirmaModal>
                </Overlay>
            )} */}
        </ContenedorProveedor>
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