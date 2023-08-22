/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import SalidasDB from '../firebase/SalidasDB';
import CabeceraOutDB from '../firebase/CabeceraOutDB';
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoOut } from './TipDoc';
import * as FaIcons from 'react-icons/fa';
import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Boton, BotonGuardar } from '../elementos/General';
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label } from '../elementos/CrearEquipos';


const Salidas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [proveedor, setProveedor] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [numDoc, setNumDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoOut, setNomTipoOut] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [correo, setCorreo] = useState('');
    const [patente, setPatente] = useState('');
    const [equipo, setEquipo] = useState([]);
    const [cabecera, setCabecera] = useState([]);
    const [status, setStatus] = useState([]);
    const [numSerie, setNumSerie] = useState('');
    const [flag, setFlag] = useState(false);
    const [dataSalida, setDataSalida] = useState([]);
    const [confirmar, setConfirmar] = useState(false);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnGuardar, setBtnGuardar] = useState(false);
    const inOut = useRef('');
    /* const [empresa, setEmpresa] = useState([]); */

    //Lectura de proveedores filtrados por empresa
    const getProveedor = async () => {
        const traerProveedor = collection(db, 'proveedores');
        const dato = query(traerProveedor, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setProveedor(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    //Lectura de clientes filtrados por empresa
    const getCliente = async () => {
        const traerCliente = collection(db, 'clientes');
        const dato = query(traerCliente, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCliente(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    //Lectura de equipos filtrado por empresas
    const getEquipo = async () => {
        const traerEq = collection(db, 'equipos');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEquipo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    // Lectura cabecera de documentos
    const getCabecera = async () => {
        const traerCabecera = collection(db, 'cabecerasout');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    //Lectura movimientos de Salida
    const getSalida = async () => {
        const traerSalida = collection(db, 'salidas');
        const dato = query(traerSalida, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setDataSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    //Almacena movimientos de entrada del documento
    const documento = dataSalida.filter(de => de.numdoc === numDoc && de.tipdoc === nomTipDoc && de.rut === rut);
    //Leer  Empresa
    /* const getEmpresa = async () => {       
        const traerEmp = await getDoc(doc(db,'empresas', users.emp_id));     
        setEmpresa(traerEmp.data());
    } */
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
    const detectarCli = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoOut === 'CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                }
            } else {
                const existeProv = proveedor.filter(prov => prov.rut === rut);
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                }
            }
        }
    }

    // Validar N°serie
    const detectar = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            // Consulta si exite serie en el arreglo            
            const existe = equipo.filter(eq => eq.serie === numSerie || eq.id === numSerie);
            const existeIn = documento.filter(doc => doc.serie === numSerie);
            const existeIn2 = documento.filter(doc => doc.eq_id === numSerie);
            if (existe.length === 0) {
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
                const existeStatus = status.filter(st => st.id === existe[0].id && st.status === 'BODEGA').length === 1;
                if (!existeStatus) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo no se encuentra en Bodega'
                    })
                }
            }
        }
    }
    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };
    // Guardar Cabecera de Documento en Coleccion CabeceraInDB
    const addCabeceraIn = (ev) => {
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
        const existe = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
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
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'favor ingresar un correo valido'
            })
            return;
        } else if (patente === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese Patente del Vehiculo'
            })
            return;
        } else if (existe.length > 0) {
            if (existe[0].confirmado) {
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
            if (nomTipoOut === 'CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
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
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            tipMov: 2,
                            confirmado: false,
                            entregado: false
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
                const existeProv = proveedor.filter(prov => prov.rut === rut);
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
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            tipMov: 2,
                            confirmado: false,
                            entregado: false
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Ingreso realizado exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(false)
                        setBtnAgregar(false)
                        setBtnGuardar(true);
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
    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Validar N° Serie en equipo
        const existe = equipo.filter(eq => eq.serie === numSerie || eq.id === numSerie);
        // Validar en N° Serie en Salidas
        const existeIn = documento.filter(doc => doc.serie === numSerie);
        const existeIn2 = documento.filter(doc => doc.eq_id === numSerie);
        // Validar Id de Cabecera en Salidas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        if (numSerie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese o Scaneé N° Serie'
            })
            return;
        } else if (existe.length === 0) {
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
            const existeStatus = status.filter(st => st.id === existe[0].id && st.status === 'BODEGA').length === 1;
            if (!existeStatus) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo no se encuentra en Bodega'
                })
            } else {
                const fechaInOut = new Date(date);
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
                        emp_id: users.emp_id,
                        tipDoc: nomTipDoc,
                        numDoc: numDoc,
                        date: fechaInOut,
                        tipoInOut: nomTipoOut,
                        rut: rut,
                        entidad: entidad,
                        eq_id: existe[0].id,
                        familia: existe[0].familia,
                        tipo: existe[0].tipo,
                        marca: existe[0].marca,
                        modelo: existe[0].modelo,
                        serie: existe[0].serie,
                        rfid: existe[0].rfid,
                        cab_id: existeCab[0].id,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 2,
                        status: nomTipoOut
                    });
                    setNumSerie('')
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Item guardado correctamente'
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
    }
    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);
        const batch = writeBatch(db);
        documento.forEach((docs) => {
            const docRef = doc(db, 'status', docs.eq_id);
            batch.update(docRef, { status: inOut.current, rut: rut, entidad: entidad });
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
        setConfirmar(false)
        setBtnConfirmar(true);
        setBtnAgregar(true);
        setBtnGuardar(false)
    };

    useEffect(() => {
        getProveedor();
        getCliente();
        getEquipo();
        getSalida();
        /* getEmpresa(); */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getStatus();
        getSalida();
        getCabecera();
        if (documento.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Salida de Equipos</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action='' onSubmit={handleSubmit}>
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
                            style={{ margin: '17px 0' }}
                            onClick={addCabeceraIn}
                            checked={confirmar}
                            onChange={handleCheckboxChange}
                            disabled={btnGuardar}
                        >Guardar</BotonGuardar>
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
                            {documento.map((item, index) => {
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
                        {cabecera.map((item) => {
                            if (item.confirmado === false) {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell >{item.id2}</Table.Cell>
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
                                            fechaDate(item.date)
                                            setCorreo(item.correo);
                                            setPatente(item.patente);
                                            setBtnGuardar(true);
                                            setBtnAgregar(false)
                                            setConfirmar(true);
                                            setFlag(!flag)
                                        }}><FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} /></Table.Cell>
                                    </Table.Row>
                                )
                            }
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