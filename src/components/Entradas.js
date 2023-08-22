/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
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
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label } from '../elementos/CrearEquipos'


const Entradas = () => {
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
    const [nomTipoIn, setNomTipoIn] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [equipo, setEquipo] = useState([]);
    const [cabecera, setCabecera] = useState([]);
    const [status, setStatus] = useState([]);
    const [numSerie, setNumSerie] = useState('');
    const [price, setPrice] = useState('');
    const [flag, setFlag] = useState(false);
    const [dataEntrada, setDataEntrada] = useState([]);
    const [confirmar, setConfirmar] = useState(false);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnGuardar, setBtnGuardar] = useState(false);
    const [empresa, setEmpresa] = useState([]);

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
        const traerCabecera = collection(db, 'cabeceras');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    //Lectura movimientos de entrada
    const getEntrada = async () => {
        const traerEntrada = collection(db, 'entradas');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setDataEntrada(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    //Almacena movimientos de entrada del documento
    const documento = dataEntrada.filter(de => de.numdoc === numDoc && de.tipdoc === nomTipDoc && de.rut === rut);
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
    const detectarCli = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoIn === 'DEVOLUCION CLIENTE') {
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
            // Consulta si exite numero de serie en el arreglo de equipos        
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
                if (existeStatus) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Equipo ya se encuentra en Bodega'
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
            // const fechaMoment = moment(fechaInOut)

            if (nomTipoIn === 'DEVOLUCION CLIENTE') {
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
                        CabeceraInDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoIn,
                            rut: rut,
                            entidad: entidad,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            tipMov: 1,
                            confirmado: false
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
                    const fechaInOut = new Date(date);
                    setEntidad(existeProv[0].nombre);
                    try {
                        CabeceraInDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: fechaInOut,
                            tipoInOut: nomTipoIn,
                            rut: rut,
                            entidad: entidad,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            tipMov: 1,
                            confirmado: false
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
        // const existe2 = equipo.filter(eq => eq.id === numSerie);
        // Validar en N° Serie en Entradas
        const existeIn = documento.filter(doc => doc.serie === numSerie);
        const existeIn2 = documento.filter(doc => doc.eq_id === numSerie);
        console.log('existe', existe)
        // Validar Id de Cabecera en Entradas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut)
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
            if (existeStatus) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra en Bodega'
                })
            } else {
                const fechaInOut = new Date(date);
                // console.log('fechaInOut', fechaInOut)
                setBtnConfirmar(false);
                try {
                    EntradasDB({
                        emp_id: users.emp_id,
                        tipDoc: nomTipDoc,
                        numDoc: numDoc,
                        date: fechaInOut,
                        tipoInOut: nomTipoIn,
                        rut: rut,
                        entidad: entidad,
                        eq_id: existe[0].id,
                        familia: existe[0].familia,
                        tipo: existe[0].tipo,
                        marca: existe[0].marca,
                        modelo: existe[0].modelo,
                        serie: existe[0].serie,
                        rfid: existe[0].rfid,
                        price: price,
                        cab_id: existeCab[0].id,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 1,
                        status: 'BODEGA',
                        observacion: ''
                    });
                    setPrice('')
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
        setNumSerie('');
        setPrice('');
        setNomTipDoc('');
        setNumDoc('');
        setDate('');
        setNomTipoIn('');
        setRut('');
        setEntidad('');
        setNumSerie('');
        setPrice('');
        setConfirmar(false);
        setBtnConfirmar(false);
        setBtnAgregar(true);
        setBtnGuardar(false)
    };
    useEffect(() => {
        getProveedor();
        getCliente();
        getEquipo();
        getEntrada();
        getStatus();
        getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        getEntrada();
        getCabecera();
        if (documento.length > 0) setBtnConfirmar(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor >
                <Titulo>Recepcion de Equipos</Titulo>
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
                        <BotonGuardar
                            style={{ margin: '35px 0' }}
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
                            {documento.map((item, index) => {
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
                            if (item.confirmado === false) {
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
                                            setNomTipoIn(item.tipoinout);
                                            setRut(item.rut);
                                            setEntidad(item.entidad);
                                            fechaDate(item.date)
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

export default Entradas;