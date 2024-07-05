/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
// import ProtocoloCabDB from '../firebase/ProtocoloCabDB';
import Alertas from './Alertas';
// import Modal from './Modal';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, addDoc, doc, writeBatch } from 'firebase/firestore';
import { Programas } from './TipDoc';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, BotonGuardar } from '../elementos/General';
import { ContentElemenMov, ContentElemenSelect, /* ListarEquipos, Contenido,*/  Select, Formulario, Label } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import Swal from 'sweetalert2';

const ProgramaMant = () => {
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
    const [protocolCabConf, setProtocolCabConf] = useState([]);
    const [programa, setPrograma] = useState([]);
    const [nomFamilia, setNomFamilia] = useState('');
    const [nomTipo, setNomTipo] = useState('');
    const [flag, setFlag] = useState(false);
    const [confirmar, setConfirmar] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(false);
    // const [btnNuevo, setBtnNuevo] = useState(true);
    const dias = useRef('');
    const documentoId = useRef('');

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
    // Filtar por Cabecera de Protocolo Cconfirmado
    const consultarCabProtConf = async () => {
        const doc = query(collection(db, 'protocoloscab'), where('emp_id', '==', users.emp_id)/*, where('confirmado', '==', true)*/);
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setProtocolCabConf(documento);
    }
    // Sumar dias
    const sumarDias = (fecha, dias) => {
        // const dateObj = fecha.toDate();
        const formatear = moment(fecha);
        const nuevafecha = formatear.add(dias, 'days');
        const ultima = new Date(nuevafecha)
        console.log(ultima)
        // return nuevafecha.format('DD/MM/YYYY HH:mm');
        return ultima;
    }
    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };

    //Funcion Guardar los equipos de status en listado para alerta de mantención
    const ProtocoloCabDB = async ({ nombre, familia, tipo, programa, dias, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
        // Buscar coincidencias de equipos en status
        const traerEq = query(collection(db, 'status'), where('emp_id', '==', users.emp_id), where('tipo', '==', nomTipo));
        const dato = await getDocs(traerEq);
        const equipo = (dato.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        const mant_eq = equipo.filter(eq => eq.status !== 'PREPARACION')

        try {
            const documento = await addDoc(collection(db, 'protocoloscab'), {
                nombre: nombre,
                familia: familia,
                tipo: tipo,
                programa: programa,
                dias: dias,
                confirmado: confirmado,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                emp_id: emp_id
            });
            documentoId.current = documento.id;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }

        // Pendiente de trabajar
        if (mant_eq.length > 0) {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const mantoRef = collection(db, 'mantenciones');
            // Itera a través de los nuevos documentos y agrégalos al lote
            mant_eq.forEach((docs) => {
                const nuevoDocRef = doc(mantoRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    cab_id_protocol: documentoId.current,
                    nombre_protocolo: nombre,
                    programa: programa,
                    dias: dias,
                    fecha_inicio: fechaAdd,
                    fecha_termino: sumarDias(fechaAdd, dias),
                    id_eq: docs.id,
                    familia: docs.familia,
                    tipo: docs.tipo,
                    serie: docs.serie,
                    useradd: user.email,
                    usermod: user.email,
                    fechaadd: fechaAdd,
                    fechamod: fechaMod,
                    emp_id: users.emp_id,
                    enproceso: '0'
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
                    Swal.fire('Se ha producido un error al agregar equipos al Protocolo de mantención');
                });
        }
    }

    // Agregar Cabecera de Protocolo
    const addCabProtocolo = async (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera de Protocolo
        const existeCabProtocolo = protocolCabConf.filter(cab => cab.familia === nomFamilia && cab.tipo === nomTipo && cab.programa === programa);

        if (nomFamilia.length === 0 || nomFamilia === 'Selecciona Opción:') {
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
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe este Programa de Mantención'
            })
        } else {
            if (programa === 'ANUAL') {
                dias.current = 365
            } else if (programa === 'SEMESTRAL') {
                dias.current = 180
            } else {
                dias.current = 90
            }
            try {
                ProtocoloCabDB({
                    nombre: 'PROGRAMA DE MANTENCIÓN ' + programa,
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
                setNomFamilia('');
                setNomTipo('');
                setPrograma('');
                setFlag(!flag);
                setConfirmar(false);
                setBtnGuardar(false);
                // setBtnNuevo(false);
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

    // // Agregar una nueva cabecera
    // const nuevo = () => {
    //     setNomFamilia('');
    //     setNomTipo('');
    //     setPrograma('');
    //     setBtnGuardar(false);
    //     setBtnNuevo(true);
    // }

    useEffect(() => {
        getFamilia();
        getTipo();
        // consultarCabProt();
        consultarCabProtConf();
        // getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // consultarCabProt();
        consultarCabProtConf();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Programa de Mantenciones</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action=''>
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
                    {/* <BotonGuardar
                        style={{ margin: '10px 0' }}
                        onClick={nuevo}
                        checked={confirmar}
                        onChange={handleCheckboxChange}
                        disabled={btnNuevo}
                    >Nuevo</BotonGuardar> */}
                </Formulario>
            </Contenedor>

            {/* Lista de Programas Terminados*/}
            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Lista Programas de Mantencion</Titulo>
                </ContentElemenAdd>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                            <Table.HeaderCell>Programa</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {protocolCabConf.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell >{item.nombre}</Table.Cell>
                                    <Table.Cell >{item.familia}</Table.Cell>
                                    <Table.Cell >{item.tipo}</Table.Cell>
                                    <Table.Cell >{item.programa}</Table.Cell>
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

export default ProgramaMant;