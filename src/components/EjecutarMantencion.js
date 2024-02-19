import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerMantencion from '../hooks/useObtenerMantencion';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, doc, addDoc, writeBatch, updateDoc /*, getDoc */ } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { BotonGuardar, Contenedor, Titulo, BotonCheck } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Select, Label, Input } from '../elementos/CrearEquipos'
import { Opcion } from './TipDoc';
import moment from 'moment';
import Swal from 'sweetalert2';

const EjecutarMantencion = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    console.log("fecha:", fechaAdd.setDate(fechaAdd.getDate() + 5));
    const navigate = useNavigate();
    const { id } = useParams();
    const [manto] = useObtenerMantencion(id);

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [itemsInst, setItemsInst] = useState([]);
    const [itemsCheck, setItemsCheck] = useState([]);
    const [itemsMedicion, setItemsMedicion] = useState([]);
    const [itemsSeg, setItemsSeg] = useState([]);
    const [itemsSeg2, setItemsSeg2] = useState([]);
    // const [protocolo, setProtocolo] = useState([]);
    const [nombreProtocolo, setNombreProtocolo] = useState('');
    const [programa, setPrograma] = useState('');
    const [dias, setDias] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [serie, setSerie] = useState('');
    const [eq_id, setEq_id] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [flag, setFlag] = useState(false);
    const [btnGuardar, setBtnGuardar] = useState(false);
    const [btnConfirmar, setBtnConfirmar] = useState(false);
    const protocoloCab = useRef([]);
    const falsosCheck = useRef([]);
    const falsosLlenado = useRef([]);
    const falsosSelec = useRef([]);
    const documentoId = useRef('');
    const idbitacora = useRef('');

    const volver = () => {
        navigate('/serviciotecnico/mantencion')
    }

    useEffect(() => {
        if (manto) {
            protocoloCab.current = manto.cab_id_protocol
            setNombreProtocolo(manto.nombre_protocolo);
            setPrograma(manto.programa);
            setDias(manto.dias);
            setFamilia(manto.familia);
            setTipo(manto.tipo);
            setSerie(manto.serie);
            setEq_id(manto.id_eq)
        } else {
            navigate('/')
        }
    }, [manto, navigate])

    // Filtar por docuemto de Protocolo
    const consultarProtocolos = async () => {
        const docInst = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'INSTRUMENTOS'));
        const docuInst = await getDocs(docInst);
        const documenInst = (docuInst.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsInst(documenInst);
        const docCheck = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'CHECK'));
        const docuCheck = await getDocs(docCheck);
        const documenCheck = (docuCheck.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
        setItemsCheck(documenCheck);
        const docLlen = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'MEDICION'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
        setItemsMedicion(documenLlen);
        const docSel = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'SEGURIDAD'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
        setItemsSeg(documenSel);
        // const docSel = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current));
        // const docuSel = await getDocs(docSel);
        // const documenSel = (docuSel.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
        // setProtocolo(documenSel);
        // const inst = protocolo.filter(p => p.categoria === 'INSTRUMENTOS')
        // const check = protocolo.filter(p => p.categoria === 'CHECK')
        // const llen = protocolo.filter(p => p.categoria === 'LLENADO')
        // const sel = protocolo.filter(p => p.categoria === 'SELECCION')
        // setItemsInst(inst);
        // setItemsCheck(check);
        // setItemsLlenado(llen);
        // setItemsSelec(sel);
        // console.log('itemsInst prot', itemsInst)
        // console.log('itemsCheck prot', itemsCheck)
        // console.log('itemsLlenado prot', itemsLlenado)
        // console.log('itemsSelec prot', itemsSelec)
    }
    //Funcion guardar las cabeceras de Bitacoras
    const BitacoraCabDB = async ({ nombre_protocolo, cab_id_protocolo, fecha_mantencion, familia, tipo, serie, eq_id, id_manto, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
        try {
            const documento = await addDoc(collection(db, 'bitacoracab'), {
                nombre_protocolo: nombre_protocolo,
                cab_id_protocolo: cab_id_protocolo,
                fecha_mantencion: fecha_mantencion,
                familia: familia,
                tipo: tipo,
                serie: serie,
                eq_id: eq_id,
                id_manto: id_manto,
                confirmado: confirmado,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                emp_id: emp_id,
            });
            documentoId.current = documento.id;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }
    }
    const handleButtonClick = (index, buttonId) => {
        setItemsCheck((prevItems) => {
            const nuevosElementos = [...prevItems];
            nuevosElementos[index].valor = buttonId;
            return nuevosElementos;
        });
    }
    const handleButtonClickLlen = (e, index) => {
        setItemsMedicion((prevItems) => {
            const nuevosElementos = [...prevItems];
            nuevosElementos[index].valor = e.target.value;
            return nuevosElementos;
        });
    }
    const handleButtonClickSeg = (e, index) => {
        setItemsSeg((prevItems) => {
            const nuevosElementos = [...prevItems];
            nuevosElementos[index].valor = e.target.value;
            return nuevosElementos;
        });
    }
    const handleButtonClickSelec = (e, index) => {
        setItemsSeg2((prevItems) => {
            const nuevosElementos = [...prevItems];
            nuevosElementos[index].valor = e.target.value;
            return nuevosElementos;
        });
    }
    // Sumar dias
    const sumarDias = (fecha, dias) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj);
        const nuevafecha = formatear.add(dias, 'days');
        const ultima = new Date(nuevafecha)
        // return nuevafecha.format('DD/MM/YYYY HH:mm');
        return ultima;
    }

    // Agregar Cabecera de Protocolo / Boton Siguiente
    const addCabBitacora = async (ev) => {
        // ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera Bitacora
        const cab = query(collection(db, 'bitacoracab'), where('emp_id', '==', users.emp_id), where('serie', '==', serie), where('confirmado', '==', false));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        if (existeCab.length > 0) {
            // cambiarEstadoAlerta(true);
            // cambiarAlerta({
            //     tipo: 'exito',
            //     mensaje: 'Proceda a realizar la mantención'
            // });
            documentoId.current = existeCab[0].id
        } else {
            try {
                BitacoraCabDB({
                    nombre_protocolo: nombreProtocolo,
                    cab_id_protocolo: protocoloCab.current,
                    fecha_mantencion: fechaAdd,
                    familia: familia,
                    tipo: tipo,
                    serie: serie,
                    eq_id: eq_id,
                    id_manto: id,
                    confirmado: false,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Proceda a realizar la mantención'
                })
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: error
                })
            }
        }
    }

    const bitacorasCab = async () => {
        const doc = query(collection(db, 'bitacoracab'), where('emp_id', '==', users.emp_id), where('id_manto', '==', id));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        idbitacora.current = documen[0].id
    }
    const consultarBitacoras = async () => {
        const docCheck = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', idbitacora.current), where('categoria', '==', 'CHECK'));
        const docuCheck = await getDocs(docCheck);
        const documenCheck = (docuCheck.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setItemsCheck(documenCheck);
        const docLlen = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', idbitacora.current), where('categoria', '==', 'LLENADO'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setItemsMedicion(documenLlen);
        const docSel = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', idbitacora.current), where('categoria', '==', 'SELECCION'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        setItemsSeg(documenSel);
        // const docSel = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', idbitacora.current));
        // const docuSel = await getDocs(docSel);
        // const documenSel = (docuSel.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        // setProtocolo(documenSel);
        // const inst = protocolo.filter(p => p.categoria === 'INSTRUMENTOS')
        // const check = protocolo.filter(p => p.categoria === 'CHECK')
        // const llen = protocolo.filter(p => p.categoria === 'LLENADO')
        // const sel = protocolo.filter(p => p.categoria === 'SELECCION') 
        // setItemsInst(inst);
        // setItemsCheck(check);
        // setItemsLlenado(llen);
        // setItemsSelec(sel);
    }

    // Boton Guardar
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        const docCheck = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', idbitacora.current), where('categoria', '==', 'CHECK'));
        const docuCheck = await getDocs(docCheck);
        const documenCheck = (docuCheck.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log(documenCheck)

        if (documenCheck.length === 0) {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const bitacoraRef = collection(db, 'bitacoras');
            // Itera a través de los nuevos documentos y agrégalos al lote de Checks
            itemsCheck.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    item: docs.item,
                    valor: docs.valor,
                    categoria: docs.categoria,
                    cab_id_bitacora: documentoId.current,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                });
            });
            // Itera a través de los nuevos documentos y agrégalos al lote de Llenado
            itemsMedicion.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    item: docs.item,
                    valor: docs.valor,
                    categoria: docs.categoria,
                    cab_id_bitacora: documentoId.current,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                });
            });
            // Itera a través de los nuevos documentos y agrégalos al lote de Seleccion
            itemsSeg.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    item: docs.item,
                    valor: docs.valor,
                    categoria: docs.categoria,
                    cab_id_bitacora: documentoId.current,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
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
                    Swal.fire('Se ha producido un error al crear docuemento');
                    console.log(error)
                });
        } else {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const bitacoraRef = collection(db, 'bitacoras',);
            // Itera a través de los nuevos documentos y agrégalos al lote de Checks
            itemsCheck.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef, docs.id); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.update(nuevoDocRef, {
                    valor: docs.valor,
                    userMod: user.email,
                    fechaMod: fechaMod,
                });
            });
            // Itera a través de los nuevos documentos y agrégalos al lote de Llenado
            itemsMedicion.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef, docs.id); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.update(nuevoDocRef, {
                    valor: docs.valor,
                    userMod: user.email,
                    fechaMod: fechaMod,
                });
            });
            // Itera a través de los nuevos documentos y agrégalos al lote de Seleccion
            itemsSeg.forEach((docs) => {
                const nuevoDocRef = doc(bitacoraRef, docs.id); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.update(nuevoDocRef, {
                    valor: docs.valor,
                    userMod: user.email,
                    fechaMod: fechaMod,
                });
            });
            batch.commit()
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Docuemento actualizado correctamente.'
                    });
                })
                .catch((error) => {
                    Swal.fire('Se ha producido un error al actualizar docuemento');
                    console.log(error)
                });
        }

        try {
            await updateDoc(doc(db, 'mantenciones', id), {
                enproceso: '1',
                usermod: user.email,
                fechamod: fechaMod
            });
        } catch (error) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al actualizar Mantencion:', error
            })
        }
        setBtnGuardar(true);
        setBtnConfirmar(false);
    }

    // Función para actualizar documentos / Boton Confirmar
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Filtar por docuemto de Cabecera Bitacora
        const cab = query(collection(db, 'bitacoracab'), where('emp_id', '==', users.emp_id), where('serie', '==', serie), where('confirmado', '==', false));
        const cabecera = await getDocs(cab);
        const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        itemsCheck.forEach((docs, index) => {
            falsosCheck.current = itemsCheck.filter(ic => ic.valor === '')
        });
        itemsMedicion.forEach((docs, index) => {
            falsosLlenado.current = itemsMedicion.filter(ic => ic.valor === '')
        });
        itemsSeg.forEach((docs, index) => {
            falsosSelec.current = itemsSeg.filter(ic => ic.valor === '')
        });

        if (falsosCheck.current.length > 0) {
            Swal.fire(`Item checked ${falsosCheck.current.map((i) => {
                return i.id2;
            })} no puede estar vacio. Recuerde guardar antes de Confirmar`);
            setBtnGuardar(false);
            setBtnConfirmar(true);

        } else if (falsosLlenado.current.length > 0) {
            Swal.fire(`Tabla Vacio: Item ${falsosLlenado.current.map((i) => {
                return i.id2;
            })} no puede estar vacio. Recuerde guardar antes de Confirmar`);
            setBtnGuardar(false);
            setBtnConfirmar(true);

        } else if (falsosSelec.current.length > 0) {
            Swal.fire(`Tabla Seguridad: Item ${falsosSelec.current.map((i) => {
                return i.id2;
            })} no puede estar vacio. Recuerde guardar antes de Confirmar`);
            setBtnGuardar(false);
            setBtnConfirmar(true);
        } else {

            try {
                await updateDoc(doc(db, 'mantenciones', id), {
                    enproceso: '0',
                    fecha_inicio: existeCab[0].fecha_mantencion,
                    fecha_termino: sumarDias(existeCab[0].fecha_mantencion, dias),
                    usermod: user.email,
                    fechamod: fechaMod
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al confirmar Mantencion:', error
                })
            }
            try {
                await updateDoc(doc(db, 'bitacoracab', existeCab[0].id), {
                    confirmado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                });
            } catch (error) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Error al confirmar Bitacora:', error
                })
            }
            Swal.fire('Check List de Mantención realizado con exito!').then((result) => {
                navigate('/serviciotecnico/mantencion')
            })
        }
    }

    useEffect(() => {
        if (manto.enproceso === '1') {
            bitacorasCab();
            consultarBitacoras();
        } else {
            consultarProtocolos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manto, navigate, flag, setFlag])

    return (
        <ContenedorCliente style={{ width: '800px' }}>
            <Contenedor>
                <Titulo>Ejecutar Mantención</Titulo>
            </Contenedor>
            <Contenedor>
                <Titulo>{nombreProtocolo}</Titulo>
                <ContentElemenMov>
                    <ContentElemenSelect style={{ paddingBottom: '5px' }}>
                        <Label>Familia :</Label>
                        <Label style={{ fontSize: '15px' }}>{familia}</Label>
                    </ContentElemenSelect>
                    <ContentElemenSelect style={{ paddingBottom: '5px' }}>
                        <Label>Tipo Equipamiento :</Label>
                        <Label style={{ fontSize: '15px' }}>{tipo}</Label>
                    </ContentElemenSelect>
                </ContentElemenMov>
                <ContentElemenMov>
                    {itemsInst.length === 0 ?
                        ''
                        :
                        <ContentElemenSelect style={{ padding: '5px' }}>
                            <Label>Instrumentos requeridos :</Label>
                            <ul >
                                {itemsInst.map((item, index) => {
                                    return (
                                        <li style={{ fontSize: '12px' }} key={index}>{item.item}</li>
                                    )
                                })}
                            </ul>
                        </ContentElemenSelect>
                    }
                </ContentElemenMov>
                {
                    isOpen &&
                    <BotonGuardar onClick={() => {
                        setMostrar(true);
                        setIsOpen(false);
                        setFlag(!flag)
                        addCabBitacora()
                    }}>Siguente</BotonGuardar>
                }
                {mostrar &&
                    <>
                        {itemsCheck.length === 0 ?
                            ''
                            :
                            <Table singleLine>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>N°</Table.HeaderCell>
                                        <Table.HeaderCell>Item</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {itemsCheck.map((item, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell >{index + 1}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                                                <Table.Cell style={{ textAlign: 'center' }}>
                                                    <BotonCheck
                                                        onClick={() => handleButtonClick(index, 'pasa')}
                                                        className={item.valor === 'pasa' ? 'activeBoton' : ''}

                                                    >Pasa</BotonCheck>
                                                    <BotonCheck
                                                        onClick={() => handleButtonClick(index, 'nopasa')}
                                                        className={item.valor === 'nopasa' ? 'activeBoton' : ''}
                                                    >No Pasa</BotonCheck>
                                                    <BotonCheck
                                                        onClick={() => handleButtonClick(index, 'na')}
                                                        className={item.valor === 'na' ? 'activeBoton' : ''}
                                                    >N/A</BotonCheck>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                        }
                        {itemsMedicion.length === 0 ?
                            ''
                            :
                            <>
                                <Titulo style={{ fontSize: '18px' }}>Medición</Titulo>
                                <Table singleLine>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>N°</Table.HeaderCell>
                                            <Table.HeaderCell>Item</Table.HeaderCell>
                                            <Table.HeaderCell>Referencia</Table.HeaderCell>
                                            <Table.HeaderCell style={{ textAlign: 'center' }}>Pasa</Table.HeaderCell>
                                            <Table.HeaderCell style={{ textAlign: 'center' }}>No Pasa</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {itemsMedicion.map((item, index) => {
                                            return (
                                                <Table.Row key={index} >
                                                    <Table.Cell >{index + 1}</Table.Cell>
                                                    <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                                                    <Table.Cell  >
                                                        <Input
                                                            type="number"
                                                            value={item.valor}
                                                            onChange={e => handleButtonClickLlen(e, index)}
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" checked={item.valor >= item.inicial ? true : false} /></Table.Cell>
                                                    <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" checked={item.valor > item.final ? false : true} /></Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Table.Body>
                                </Table>
                            </>
                        }
                        {itemsSeg.length === 0 ?
                        ''
                    :
                    <>
                            <Titulo style={{ fontSize: '18px' }}>Seguridad electrica</Titulo>
                            <ContentElemenMov>
                                <Table singleLine>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>N°</Table.HeaderCell>
                                            <Table.HeaderCell>Item</Table.HeaderCell>
                                            <Table.HeaderCell>Referencia</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {itemsSeg.map((item, index) => {
                                            return (
                                                <Table.Row key={index} >
                                                    <Table.Cell >{index + 1}</Table.Cell>
                                                    {item.item === 'CLASIFICACION' ?
                                                        <>
                                                            <Table.Cell >{item.item}</Table.Cell>
                                                            <Table.Cell >
                                                                <Select key={index} value={item.valor} onChange={e => { handleButtonClickSelec(e, index) }}>
                                                                    {Opcion.map((o, index) => {
                                                                        return (
                                                                            <option key={index} >{o.text}</option>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </Table.Cell>
                                                        </>
                                                        :
                                                        <>
                                                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                                                            <Table.Cell  >
                                                                <Input
                                                                    type="text"
                                                                    value={item.valor}
                                                                    onChange={e => handleButtonClickSeg(e, index)}
                                                                />
                                                            </Table.Cell>
                                                        </>
                                                    }
                                                </Table.Row>
                                            )
                                        })}
                                    </Table.Body>
                                </Table>
                                {/* // {itemsSeg.map((item, index) => { */}
                                {/* //     if (item.item !== 'CLASIFICACION') { */}
                                {/* //         return ( */}
                                {/* //             <Select key={index} value={item.valor} onChange={e => { handleButtonClickSelec(e, index) }}> */}
                                {/* //                 <option>{item.item} :</option> */}
                                {/* //                 {Opcion.map((o, index) => { */}
                                {/* //                     return ( */}
                                {/* //                         <option key={index} >{o.text}</option> */}
                                {/* //                     ) */}
                                {/* //                 })} */}
                                {/* //             </Select> */}
                                {/* //         ) */}
                                {/* {/* //     }  */}
                                {/* // })} */}
                            </ContentElemenMov>
                    </>
                    }

                        <ContentElemenMov style={{ marginTop: '10px' }}>
                            <BotonGuardar onClick={handleSubmit} disabled={btnGuardar}>Guardar</BotonGuardar>
                            <BotonGuardar onClick={actualizarDocs} disabled={btnConfirmar}>Confirmar</BotonGuardar>
                        </ContentElemenMov>
                    </>
                }
            </Contenedor>
            <BotonGuardar style={{ marginTop: '30px' }} onClick={volver} >Volver</BotonGuardar>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorCliente>
    )
}

export default EjecutarMantencion;
const ContenedorCliente = styled.div``