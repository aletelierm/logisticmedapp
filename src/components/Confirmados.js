/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import Alertas from './Alertas';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, doc, writeBatch, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import * as FaIcons from 'react-icons/fa';
import { FaSyncAlt } from "react-icons/fa";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar, Boton } from '../elementos/General'
import { Input } from '../elementos/CrearEquipos'
import moment from 'moment';

const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [flag, setFlag] = useState(false);
    const [cab_id, setCab_id] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenR, setIsOpenR] = useState(false);
    const [isOpent, setIsOpent] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const [isChecked2, setIsChecked2] = useState([]);
    const [traspasoE, setTraspasoE] = useState([]);
    const [traspasoS, setTraspasoS] = useState([]);
    // const [todo, setTodo] = useState([]);
    /* const [alertaSalida, setAlertasalida] = useState([]); */
    const cabeceraId = useRef('');
    const inOut = useRef('');

    /*   //Lectura de usuario para alertas de salida
    const getAlertasSalidas = async () => {
        const traerAlertas = collection(db, 'usuariosalertas');
        const dato = query(traerAlertas, where('emp_id', '==', users.emp_id,'confirma','==',true));
        const data = await getDocs(dato);
        setAlertasalida(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
     } */
    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', true), where('correo', '==', users.correo));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
        setCabecera(existeCab);
    }
    const porEntregar = cabecera.filter(cab => cab.entregado === false && cab.tipdoc !== 'TRASPASO')
    const porRetirar = cabecera.filter(cab => cab.retirado === false)
    const traspaso = cabecera.filter(cab => cab.entregado === false && cab.tipdoc === 'TRASPASO')

    // Filtar por docuemto de Entrada campo entregado
    const consultarOutEntrega = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 2));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false })));
        setIsChecked(documento)
    }
    // Filtar por docuemto de Entrada campo retirado
    const consultarOutRetiro = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 0));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false })));
        setIsChecked2(documento)
    }
    // Filtar por docuemto de Entrada campo retirado
    const consultarTraspasos = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 4));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setTraspasoE(documento)
        const doc1 = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 5));
        const docu1 = await getDocs(doc1);
        const documento1 = (docu1.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setTraspasoS(documento1)
    }
    const merge = [...traspasoE, ...traspasoS].sort((a, b) => a.numdoc - b.numdoc)
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
    // Modifica Checked Entregado
    const handleCheckboxChange = (itemId) => {
        setIsChecked((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };
    // Guardar campo observaciones Entregado
    const handleChange = (e, item) => {
        const nuevoIsChecked = isChecked.map((i) => {
            if (i.id === item.id) {
                return { ...i, observacion: e.target.value };
            }
            return i;
        })
        setIsChecked(nuevoIsChecked)
    };

    // Modifica Checked Retirado
    const handleCheckboxChange2 = (itemId) => {
        setIsChecked2((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };
    // Guardar campo observaciones Retirado
    const handleChange2 = (e, item) => {
        const nuevoIsChecked2 = isChecked2.map((i) => {
            if (i.id === item.id) {
                return { ...i, observacion: e.target.value };
            }
            return i;
        })
        setIsChecked2(nuevoIsChecked2)
    };

    // Funcion guardar Cabeceras
    const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, tipMov, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id, falsos }) => {
        try {
            const cabecera = await addDoc(collection(db, 'cabeceras'), {
                numdoc: numDoc,
                tipdoc: tipDoc,
                date: date,
                tipoinout: tipoInOut,
                rut: rut,
                entidad: entidad,
                tipmov: tipMov,
                confirmado: confirmado,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                emp_id: emp_id,
            })
            cabeceraId.current = cabecera.id;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }

        if (falsos === false) {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const entradasRef = collection(db, 'entradas');
            console.log('cabecera id foreach', cabeceraId.current)
            // Itera a través de los nuevos documentos y agrégalos al lote
            falsoCheck.forEach((docs) => {
                const nuevoDocRef = doc(entradasRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    numdoc: docs.numdoc,
                    tipdoc: docs.tipdoc,
                    date: fechaAdd,
                    tipoinout: inOut.current,
                    rut: docs.rut,
                    entidad: docs.entidad,
                    price: 0,
                    cab_id: cabeceraId.current,
                    eq_id: docs.eq_id,
                    familia: docs.familia,
                    tipo: docs.tipo,
                    marca: docs.marca,
                    modelo: docs.modelo,
                    serie: docs.serie,
                    rfid: docs.rfid,
                    tipmov: 1,
                    observacion: docs.observacion,
                    historial: 0,
                    confirmado: false,
                    useradd: user.email,
                    usermod: user.email,
                    fechaadd: fechaAdd,
                    fechamod: fechaMod,
                    emp_id: users.emp_id,
                }
                );
            });
            // Ejecuta el lote
            batch.commit()
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Docuemento creado correctamente.'
                    });
                })
                .catch((error) => {
                    Swal.fire('Se ha producido un error al crear docuemento de entrada devoluion');
                });

        } else {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const entradasRef = collection(db, 'entradas');
            // Itera a través de los nuevos documentos y agrégalos al lote
            verdaderosRetiro.forEach((docs) => {
                const nuevoDocRef = doc(entradasRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    numdoc: docs.numdoc,
                    tipdoc: docs.tipdoc,
                    date: fechaAdd,
                    tipoinout: docs.tipoinout,
                    rut: docs.rut,
                    entidad: docs.entidad,
                    price: 0,
                    cab_id: cabeceraId.current,
                    eq_id: docs.eq_id,
                    familia: docs.familia,
                    tipo: docs.tipo,
                    marca: docs.marca,
                    modelo: docs.modelo,
                    serie: docs.serie,
                    rfid: docs.rfid,
                    tipmov: 1,
                    observacion: docs.observacion,
                    confirmado: false,
                    useradd: user.email,
                    usermod: user.email,
                    fechaadd: fechaAdd,
                    fechamod: fechaMod,
                    emp_id: users.emp_id,
                }
                );
            });
            // Ejecuta el lote
            batch.commit()
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Docuemento creado correctamente.'
                    });
                })
                .catch((error) => {
                    Swal.fire('Se ha producido un error al crear docuemento de entrada retirado');
                });
        }
    }

    // Filtros para guardar datos y/o validaciones Entregado
    const verdaderos = isChecked.filter(check => check.checked === true);
    const falsoCheck = isChecked.filter(check => check.checked === false && check.observacion !== '');
    const falsos = isChecked.filter(check => check.observacion === '' && check.checked === false);
    const confirmaEntrega = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (falsos.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese una Observacion'
            })
            return;
        } else {
            if (verdaderos.length > 0) {
                if (verdaderos[0].tipoinout === 'PACIENTE') {
                    const batch = writeBatch(db);
                    verdaderos.forEach((docs) => {
                        const docRef = doc(db, 'status', docs.eq_id);
                        batch.update(docRef, {
                            status: docs.tipoinout,
                            r_destino: docs.rut,
                            n_destino: docs.entidad,
                            r_permanente: docs.rut,
                            n_permanente: docs.entidad,
                            fecha_permanente: fechaAdd,
                            // r_permanente: docs.tipoinout === 'PACIENTE' ? docs.rut : '',
                            // n_permanente: docs.tipoinout === 'PACIENTE' ? docs.entidad : '',
                            // fecha_permanente: docs.tipoinout === 'PACIENTE' ? fechaAdd : '',
                            fechamod: fechaMod
                        });
                    });
                    verdaderos.forEach((docs) => {
                        const docRef = doc(db, 'salidas', docs.id);
                        batch.update(docRef, { historial: 1 }); // Indica que se recepciono el equipo en paciente
                    });
                    try {
                        await batch.commit();
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Documentos Entregados Correctamente.'
                        });
                    } catch (error) {
                        Swal.fire('Se ha producido un error al actualizar Status de equipos recibidos');
                    }
                } else {
                    const batch = writeBatch(db);
                    verdaderos.forEach((docs) => {
                        const docRef = doc(db, 'status', docs.eq_id);
                        batch.update(docRef, {
                            status: 'SERVICIO TECNICO',
                            r_destino: docs.rut,
                            n_destino: docs.entidad,
                            fechamod: fechaMod
                        });
                    });
                    verdaderos.forEach((docs) => {
                        const docRef = doc(db, 'salidas', docs.id);
                        batch.update(docRef, { historial: 1 }); // Indica que se recepciono el equipo en paciente
                    });
                    try {
                        await batch.commit();
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Documentos Entregados Correctamente.'
                        });
                    } catch (error) {
                        Swal.fire('Se ha producido un error al actualizar Status de equipos recibidos');
                    }
                }
            }

            if (falsoCheck.length > 0) {
                if (falsoCheck[0].tipoinout === 'PACIENTE') {
                    inOut.current = 'DEVOLUCION PACIENTE'
                } else if (falsoCheck[0].tipoinout === 'S. TECNICO CORRECTIVO' || falsoCheck[0].tipoinout === 'S. TECNICO CORRECTIVO') {
                    inOut.current = 'DEVOLUCION SERVICIO TECNICO'
                } else {
                    inOut.current = 'DEVOLUCION DEL PROVEEDOR'
                }
                // crea cabecera
                try {
                    CabeceraInDB({
                        emp_id: users.emp_id,
                        tipDoc: falsoCheck[0].tipdoc,
                        numDoc: falsoCheck[0].numdoc,
                        date: fechaAdd,
                        tipoInOut: inOut.current,
                        rut: falsoCheck[0].rut,
                        entidad: falsoCheck[0].entidad,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 1,
                        confirmado: false,
                        falsos: false // devolucion
                    })
                } catch (error) {
                    Swal.fire('Se ha producido un error al guardar Cabecera de Entrda');
                }

                // Actualiza Status de equipos
                const batchf = writeBatch(db);
                falsoCheck.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batchf.update(docRef, {
                        status: 'TRANSITO BODEGA',
                        r_origen: docs.rut,
                        n_origen: docs.entidad,
                        r_destino: empresa.rut,
                        n_destino: empresa.empresa,
                        fechamod: fechaMod
                    });
                });
                falsoCheck.forEach((docs) => {
                    const docRef = doc(db, 'salidas', docs.id);
                    batchf.update(docRef, { historial: 1 }); // Indica que no se recepciono el equipo en paciente
                });
                try {
                    await batchf.commit();
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al actualizar Status de equipos en devolucion');
                }
            }

            // ACTUALIZAR CABECERA DE CONFIRMADOS
            try {
                await updateDoc(doc(db, 'cabecerasout', cab_id), {
                    entregado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                })
                setFlag(!flag)
                setIsOpen(!isOpen)
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar la cabecera');
            }
        }
        // Alerta para enviar correo
    }

    // Filtros para guardar datos y/o validaciones Retiro
    const verdaderosRetiro = isChecked2.filter(check => check.checked === true);
    const falsoCheckRetiro = isChecked2.filter(check => check.checked === false && check.observacion !== '');
    const falsosRetiro = isChecked2.filter(check => check.observacion === '' && check.checked === false);
    const confirmaRetiro = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (falsosRetiro.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese una Observacion'
            })
            return;
        } else {
            if (falsoCheckRetiro.length > 0) {
                if (falsoCheckRetiro[0].tipoinout === 'RETIRO PACIENTE') {
                    inOut.current = 'PACIENTE'
                } else {
                    inOut.current = 'SERVICIO TECNICO'
                }
                const batch = writeBatch(db);
                falsoCheckRetiro.forEach((docs) => {
                    const docRef = doc(db, 'salidas', docs.id);
                    batch.update(docRef, { observacion: docs.observacion, fechamod: fechaMod });
                });
                falsoCheckRetiro.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batch.update(docRef, {
                        status: inOut.current,
                        fechamod: fechaMod
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
                    Swal.fire('Se ha producido un error al actualizar Status');
                    console.log(error)
                }
            }

            // Crear Cabecera
            if (verdaderosRetiro.length > 0) {
                try {
                    CabeceraInDB({
                        emp_id: users.emp_id,
                        tipDoc: verdaderosRetiro[0].tipdoc,
                        numDoc: verdaderosRetiro[0].numdoc,
                        date: fechaAdd,
                        tipoInOut: verdaderosRetiro[0].tipoinout,
                        rut: verdaderosRetiro[0].rut,
                        entidad: verdaderosRetiro[0].entidad,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 1,
                        confirmado: false,
                        falsos: true // retiro
                    })
                } catch (error) {
                    Swal.fire('Se ha producido un error al guardar Cabecera de Entrada');
                }

                // Actualiza Status de equipos
                const batchf = writeBatch(db);
                verdaderosRetiro.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batchf.update(docRef, {
                        status: 'TRANSITO BODEGA',
                        r_origen: docs.rut,
                        n_origen: docs.entidad,
                        r_destino: empresa.rut,
                        n_destino: empresa.empresa,
                        r_permanente: '',
                        n_permanente: '',
                        fecha_permanente: ''
                    });
                });

                try {
                    await batchf.commit();
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al Cambiar Status de equipos retirados');
                }
            }

            // ACTUALIZAR CABECERA DE CONFIRMADOS
            try {
                await updateDoc(doc(db, 'cabecerasout', cab_id), {
                    retirado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                })
                setFlag(!flag)
                setIsOpenR(!isOpenR)
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar la cabecera');
            }
        }
        // Alerta para enviar correo
    }

    // Confirmar Taspasos
    const confirmaTraspasos = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (merge[0].tipmov === 5) {
            // setTodo(traspasoS)
            // inOut.current = 'SERVICIO TECNICO'
            const batch = writeBatch(db);
            traspasoS.forEach((docs) => {
                console.log('inOut', inOut.current)
                const docRef = doc(db, 'status', docs.eq_id);
                batch.update(docRef, {
                    status: 'SERVICIO TECNICO',
                    fechamod: fechaMod
                });
            });
            try {
                await batch.commit();
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Status actualizados correctamente.'
                });
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar Status');
                console.log(error)
            }
        } else {
            // setTodo(traspasoE)
            // inOut.current = 'PACIENTE'
            // console.log('PACIENTE', inOut.current)
            const batch = writeBatch(db);
            traspasoE.forEach((docs) => {
                console.log('inOut', inOut.current)
                const docRef = doc(db, 'status', docs.eq_id);
                batch.update(docRef, {
                    status: 'PACIENTE',
                    fechamod: fechaMod
                });
            });
            try {
                await batch.commit();
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Status actualizados correctamente.'
                });
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar Status');
                console.log(error)
            }
        }

        // ACTUALIZAR CABECERA DE CONFIRMADOS
        try {
            await updateDoc(doc(db, 'cabecerasout', cab_id), {
                entregado: true,
                usermod: user.email,
                fechamod: fechaMod
            })
            setFlag(!flag)
            setIsOpent(!isOpent)
        } catch (error) {
            Swal.fire('Se ha producido un error al actualizar la cabecera');
        }
    }
    // Alerta para enviar correo


    useEffect(() => {
        consultarCab();
        getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        consultarOutEntrega();
        consultarOutRetiro();
        consultarTraspasos();
        consultarCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor style={{}}>
            <Contenedor style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Titulo>Entregados - Retirados</Titulo>
                <Boton onClick={() => setFlag(!flag)}>
                    <FaSyncAlt style={{ fontSize: '20px', color: '#328AC4' }} />
                </Boton>
            </Contenedor>

            <ListarProveedor>
                <Titulo>Listado de Documentos por Entregar</Titulo>
                <StyledTable striped celled unstackable responsive style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {porEntregar.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setCab_id(item.id)
                                        setIsOpen(!isOpen)
                                        setIsOpenR(false)
                                        setFlag(!flag)
                                    }} >
                                        <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        )}
                    </Table.Body>
                </StyledTable>
            </ListarProveedor >
            {isOpen &&
                <Contenedor>
                    <StyledTable striped celled unstackable responsive>
                        <Table.Header style={{ textAlign: 'center' }}>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Entregado</Table.HeaderCell>
                                <Table.HeaderCell>Observación</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {isChecked.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <Input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleCheckboxChange(item.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.checked === true ?
                                                <Input disabled type='text' name='observaciones' />
                                                :
                                                <Input type='text'
                                                    name={item.observacion}
                                                    value={item.observacion}
                                                    onChange={(e) => handleChange(e, item)}
                                                />
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            )
                            }
                        </Table.Body>
                    </StyledTable>
                    <BotonGuardar onClick={confirmaEntrega} >Confirmar Entrega</BotonGuardar>
                </Contenedor>
            }

            <ListarProveedor>
                <Titulo>Listado de Documentos por Retirar</Titulo>
                <StyledTable striped celled unstackable responsive style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {porRetirar.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setCab_id(item.id)
                                        setIsOpen(false)
                                        setIsOpenR(!isOpenR)
                                        setFlag(!flag)
                                    }} >
                                        <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        )}
                    </Table.Body>
                </StyledTable>
            </ListarProveedor >
            {isOpenR &&
                <Contenedor>
                    <StyledTable striped celled unstackable responsive>
                        <Table.Header style={{ textAlign: 'center' }}>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Retirado</Table.HeaderCell>
                                <Table.HeaderCell>Observación</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {isChecked2.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <Input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleCheckboxChange2(item.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.checked === true ?
                                                <Input disabled type='text' name='observaciones' />
                                                :
                                                <Input type='text'
                                                    name={item.observacion}
                                                    value={item.observacion}
                                                    onChange={(e) => handleChange2(e, item)}
                                                />
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            )
                            }
                        </Table.Body>
                    </StyledTable>
                    <BotonGuardar onClick={confirmaRetiro} >Confirmar Retiro</BotonGuardar>
                </Contenedor>
            }


            <ListarProveedor>
                <Titulo>Listado Traspasos</Titulo>
                <StyledTable striped celled unstackable responsive style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {traspaso.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setCab_id(item.id)
                                        setIsOpen(false)
                                        setIsOpent(!isOpent)
                                        setFlag(!flag)
                                    }} >
                                        <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        )}
                    </Table.Body>
                </StyledTable>
            </ListarProveedor >
            {isOpent &&
                <Contenedor>
                    <StyledTable striped celled unstackable responsive>
                        <Table.Header style={{ textAlign: 'center' }}>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {merge.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                            )
                            }
                        </Table.Body>
                    </StyledTable>
                    <BotonGuardar onClick={confirmaTraspasos} >Confirmar Traspaso</BotonGuardar>
                </Contenedor>
            }

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor >
    );
};

const StyledTable = styled(Table)`
  /* Estilos generales de la tabla */

  /* Media query para pantallas con un ancho máximo de 768px (tamaño móvil típico) */
    @media screen and (max-width: 576px) {
        font-size: 16px; /* Cambia el tamaño de fuente para pantallas pequeñas */
        margin: 0 0.75rem;
        margin-left: 10.5rem;

    /* Ajusta el tamaño de las celdas para pantallas pequeñas */
    &&&.celled tbody tr > td {
        padding: 2px 5px; /* Ajusta el relleno (padding) de las celdas */
        font-size: 0.7rem ;
    }
}
`

export default Confirmados;