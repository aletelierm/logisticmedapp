/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import ProtocoloCabDB from '../firebase/ProtocoloCabDB';
import ProtocoloDB from '../firebase/ProtocoloDB';
import Alertas from './Alertas';
// import Modal from './Modal';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc /*, writeBatch */ } from 'firebase/firestore';
import { Programas } from './TipDoc'
import * as FaIcons from 'react-icons/fa';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, BotonGuardar } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Label } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';

const Protocolos = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    // const [estadoModal, setEstadoModal] = useState(false);
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familia, setFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [protocolCab, setProtocolCab] = useState([]);
    const [item, setItem] = useState([]);
    const [protocolo, setProtocolo] = useState([]);
    const [programa, setPrograma] = useState([]);
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [nomProtocolo, setNomProtocolo] = useState('');
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(false);
    const [btnConfirmar, setBtnConfirmar] = useState(false);
    const [btnNuevo, setBtnNuevo] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [mostrar, setMostrar] = useState(true);
    const dias = useRef('');

    //Leer los datos de Familia
    const getFamilia = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setFamilia(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    // Ordenar Listado por Familia
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
    //Leer los datos de Tipos
    const getTipo = async () => {
        const traerTip = collection(db, 'tipos');
        const dato = query(traerTip, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setTipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    // Ordenar Listado por Tipo
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
    // Filtar por Cabecera de Protocolo
    const consultarCabProt = async () => {
        const doc = query(collection(db, 'protocoloscab'), where('emp_id', '==', users.emp_id), where('confirmado', '==', false));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setProtocolCab(documento);
    }
    const getItem = async () => {
        const traerit = collection(db, 'items');
        const dato = query(traerit, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setItem(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));
    }
    // Ordenar Listado por item
    item.sort((a, b) => {
        const nameA = a.nombre;
        const nameB = b.nombre;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    // Filtar por docuemto de Entrada
    const consultarProtocolos = async () => {
        const doc = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('familia', '==', nomFamilia), where('tipo', '==', nomTipo), where('programa', '==', programa));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));
        setProtocolo(documen);
    }
    // Ordenar Items Agregados a Protocolo, Alfabetico
    protocolo.sort((a, b) => {
        const nameA = a.item;
        const nameB = b.item;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const filtroItem = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return item.slice();
        const nuevoFiltro = item.filter(it => it.nombre.includes(buscar));
        return nuevoFiltro.slice();
    }
    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setBuscardor(target.value)
    }
    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };
    // Agregar Cabecera de Protocolo
    const addCabProtocolo = async (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera de Protocolo
        const cabProtocolo = query(collection(db, 'protocoloscab'), where('emp_id', '==', users.emp_id), where('familia', '==', nomFamilia), where('tipo', '==', nomTipo), where('programa', '==', programa));
        const cabecera = await getDocs(cabProtocolo);
        const existeCabProtocolo = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        // console.log(existeCabProtocolo);

        if (nomProtocolo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese Nombre Protocolo'
            })
            return;
        } else if (nomFamilia.length === 0 || nomFamilia === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccine Familia'
            })
            return;
        } else if (nomTipo.length === 0 || nomTipo === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione Tipo de Equipamiento'
            })
            return;
        } else if (programa.length === 0 || programa === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione Programa'
            })
            return;
        } else if (existeCabProtocolo.length > 0) {
            if (existeCabProtocolo[0].confirmado) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este Protocolo y se encuentra confirmado'
                })
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este Protocolo. Falta confirmar'
                })
            }
        } else {
            if (programa === 'ANUAL') {
                dias.current = 365
            } else if (programa === 'SEMESTRAL') {
                dias.current = 180
            } else {
                dias.current = 90
            }
            const nomProt = nomProtocolo.toLocaleUpperCase().trim()
            try {
                ProtocoloCabDB({
                    nombre: nomProt,
                    familia: nomFamilia,
                    tipo: nomTipo,
                    programa: programa,
                    dias: dias.current,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                    confirmado: false
                })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Ingreso realizado exitosamente'
                })
                setFlag(!flag);
                setConfirmar(false);
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
    // Agregar Item a Protocolo
    const AgregarItem = async (id) => {
        // ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Consultar si Item se encuentra en Documento
        const item_id = item.filter(it => it.id === id);
        // Validar en N° Serie en el documento de Entradas que se esta trabatando     
        const existeProt = protocolo.filter(doc => doc.item_id === item_id[0].id);
        // Filtar por docuemto de Cabecera de Protocolo
        const cabProtocolo = query(collection(db, 'protocoloscab'), where('emp_id', '==', users.emp_id), where('familia', '==', nomFamilia), where('tipo', '==', nomTipo), where('programa', '==', programa));
        const cabecera = await getDocs(cabProtocolo);
        const existeCabProtocolo = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        if (existeProt.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Item ya se encuentra en este documento'
            })
        } else {
            try {
                ProtocoloDB({
                    nombre: existeCabProtocolo[0].nombre,
                    familia: existeCabProtocolo[0].familia,
                    tipo: existeCabProtocolo[0].tipo,
                    programa: existeCabProtocolo[0].programa,
                    dias: existeCabProtocolo[0].dias,
                    item: item_id[0].nombre,
                    item_id: item_id[0].id,
                    categoria: item_id[0].categoria,
                    cab_id: existeCabProtocolo[0].id,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                    confirmado: false
                });
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Item Agregado correctamente'
                })
                setFlag(!flag);
                setConfirmar(false);
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

    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera
        const cabProtocolo = query(collection(db, 'protocoloscab'), where('emp_id', '==', users.emp_id), where('familia', '==', nomFamilia), where('tipo', '==', nomTipo), where('programa', '==', programa));
        const cabecera = await getDocs(cabProtocolo);
        const existeCabProtocolo = (cabecera.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));

        if (protocolo.length === 0) {
            Swal.fire('No hay Datos por confirmar en este documento');
        } else {
            try {
                await updateDoc(doc(db, 'protocoloscab', existeCabProtocolo[0].id), {
                    confirmado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                });
                cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documento confirmado exitosamente.'
                    });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al confirmar Cabecera:', error
                })
            }

        }
        setFlag(!flag)
        setNomProtocolo('');
        setNomFamilia('');
        setNomTipo('');
        setPrograma('');
        setConfirmar(false);
        setBtnGuardar(false);
        setBtnConfirmar(true);
        setBtnNuevo(true);
    };

    // Agregar una nueva cabecera
    const nuevo = () => {
        setNomProtocolo('');
        setNomFamilia('');
        setNomTipo('');
        setPrograma('');
        setConfirmar(true);
        setBtnGuardar(false);
        setBtnConfirmar(true);
        setBtnNuevo(true);
    }

    useEffect(() => {
        getFamilia();
        getTipo();
        getItem();
        consultarCabProt();
        // getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getItem();
        consultarCabProt();
        consultarProtocolos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Crear Protocolos</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action=''>
                    <ContentElemenMov>
                        <InputAdd
                            disabled={confirmar}
                            type='text'
                            placeholder='Ingrese Nombre Protocolo'
                            name='nomprotocolo'
                            value={nomProtocolo}
                            onChange={e => setNomProtocolo(e.target.value)}
                        />
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Familia</Label>
                            <Select
                                disabled={confirmar}
                                value={nomFamilia}
                                onChange={ev => setNomFamilia(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {familia.map((d) => {
                                    return (<option key={d.id}>{d.familia}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Equipamiento</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipo}
                                onChange={ev => setNomTipo(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {tipo.map((d) => {
                                    return (<option key={d.id}>{d.tipo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Programa</Label>
                            <Select
                                disabled={confirmar}
                                value={programa}
                                onChange={ev => setPrograma(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {Programas.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <BotonGuardar
                        style={{ margin: '10px 10px' }}
                        onClick={addCabProtocolo}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnGuardar}
                    >Guardar</BotonGuardar>
                    <BotonGuardar
                        style={{ margin: '10px 0' }}
                        onClick={nuevo}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnNuevo}
                    >Nuevo</BotonGuardar>
                </Formulario>
            </Contenedor>
            <Contenedor>
                <ContentElemenAdd>
                    <Titulo>Items Agregados a Protocolo</Titulo>
                </ContentElemenAdd>
                <ListarEquipos>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Categoria</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {protocolo.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell>{item.categoria}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </ListarEquipos>
                <BotonGuardar onClick={actualizarDocs} disabled={btnConfirmar}>Confirmar</BotonGuardar>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Items</Titulo>
                    {mostrar ?
                        <BotonGuardar onClick={() => {
                            setIsOpen(true)
                            setFlag(!flag)
                            setMostrar(false)
                        }}
                        >Mostrar</BotonGuardar>
                        :
                        <BotonGuardar onClick={() => {
                            setIsOpen(false)
                            setMostrar(true)
                        }}
                        >No Mostrar</BotonGuardar>
                    }
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemenAdd>
                {isOpen &&
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filtroItem().map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <BotonGuardar onClick={() => AgregarItem(item.id)}>Agregar</BotonGuardar>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                }
            </ListarProveedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Protocolos por terminar</Titulo>
                </ContentElemenAdd>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                            <Table.HeaderCell>Programa</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {protocolCab.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell >{item.nombre}</Table.Cell>
                                    <Table.Cell >{item.familia}</Table.Cell>
                                    <Table.Cell >{item.tipo}</Table.Cell>
                                    <Table.Cell >{item.programa}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setNomProtocolo(item.nombre);
                                        setNomFamilia(item.familia);
                                        setNomTipo(item.tipo)
                                        setPrograma(item.programa);
                                        setBtnGuardar(true);
                                        // setConfirmar(true);
                                        setBtnNuevo(false)
                                        setBtnConfirmar(false)
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
        </ContenedorProveedor >
    );
};

export default Protocolos;