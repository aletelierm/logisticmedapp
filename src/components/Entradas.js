/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import EntradasDB from '../firebase/EntradasDB'
import CabeceraInDB from '../firebase/CabeceraInDB'
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoIn } from './TipDoc'
import * as FaIcons from 'react-icons/fa';
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Boton, BotonGuardar } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label } from '../elementos/CrearEquipos';
import Swal from 'sweetalert2';

const Entradas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [dataEntrada, setDataEntrada] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [status, setStatus] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoIn, setNomTipoIn] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [price, setPrice] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const almacenar = useRef([]);

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
        setDataEntrada(documento)
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
            const existeIn = dataEntrada.filter(doc => doc.serie === numSerie);
            const existeIn2 = dataEntrada.filter(doc => doc.eq_id === numSerie);

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
            } else {
                const existeStatus = status.filter(st => st.id === almacenar.current[0].id && st.status !== 'PREPARACION').length === 1;
                if (existeStatus) {
                    const estado = status.filter(st => st.id === almacenar.current[0].id && st.status !== 'PREPARACION')
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: `Este Equipo ya existe y su Estado es: ${estado[0].status} `
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
            console.log('almacenar', almacenar.current);
        }
        // Validar en N° Serie en Entradas        
        const existeIn = dataEntrada.filter(doc => doc.serie === numSerie);
        const existeIn2 = dataEntrada.filter(doc => doc.eq_id === numSerie);
        // Filtar por docuemto de Cabecera
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
            const existeStatus = status.filter(st => st.id === almacenar.current[0].id && st.status !== 'PREPARACION').length === 1;
            if (existeStatus > 0) {
                const estado = status.filter(st => st.id === almacenar.current[0].id && st.status !== 'PREPARACION')
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: `Este Equipo ya existe y su Estado es en : ${estado[0].status} `
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
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        emp_id: users.emp_id,
                    });
                    setPrice('')
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

    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        console.log(dataEntrada)
        if (dataEntrada.length === 0) {
            Swal.fire('No hay Datos pr confirmar en este documento');
        } else {
            // Filtar por docuemto de Cabecera
            const cab = query(collection(db, 'cabeceras'), where('emp_id', '==', users.emp_id), where('numdoc', '==', numDoc), where('tipdoc', '==', nomTipDoc), where('rut', '==', rut));
            const cabecera = await getDocs(cab);
            const existeCab = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

            const batch = writeBatch(db);
            dataEntrada.forEach((docs) => {
                const docRef = doc(db, 'status', docs.eq_id);
                batch.update(docRef, { status: 'BODEGA', rut: empresa.rut, entidad: empresa.empresa });
            });
            try {
                await batch.commit();
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Documentos actualizados correctamente.'
                });
                await updateDoc(doc(db, 'cabeceras', existeCab[0].id), {
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
        }
    };

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
        setBtnConfirmar(true);
        setBtnNuevo(true);
    }

    useEffect(() => {
        getStatus();
        getEmpresa();
        consultarCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        consultarIn();
        consultarCab();
        console.log(dataEntrada)
        // if (dataEntrada.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

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
                </Formulario>
            </Contenedor>
            <Contenedor>
                <Formulario>
                    <ContentElemenMov >
                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Precio</Label>
                            <Input
                                type='number'
                                name='precio'
                                placeholder='Ingrese Valor'
                                value={price}
                                onChange={e => setPrice(e.target.value)}
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
                                        // if (dataEntrada.length > 0) setBtnConfirmar(false);
                                        // console.log(dataEntrada)
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

export default Entradas;