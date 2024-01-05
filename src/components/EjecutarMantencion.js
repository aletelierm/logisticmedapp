import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// import BitacoraCabDB from '../firebase/BitacoraCabDB';
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerMantencion from '../hooks/useObtenerMantencion';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, doc, addDoc, writeBatch /*, getDoc, updateDoc */ } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { BotonGuardar, Contenedor, Titulo, BotonCheck } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Select, Label, Input } from '../elementos/CrearEquipos'
import { Opcion } from './TipDoc';
import Swal from 'sweetalert2';

const EjecutarMantencion = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [manto] = useObtenerMantencion(id);

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    // const [cabProt, setCabProt] = useState([]);
    // const [protocolo, setProtocolo] = useState([]);
    const [itemsInst, setItemsInst] = useState([]);
    const [itemsCheck, setItemsCheck] = useState([]);
    const [itemsLlenado, setItemsLlenado] = useState([]);
    const [itemsSelec, setItemsSelec] = useState([]);
    const [nombreProtocolo, setNombreProtocolo] = useState('');
    const [programa, setPrograma] = useState('');
    const [dias, setDias] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [serie, setSerie] = useState('');
    const [eq_id, setEq_id] = useState('');
    // const [flag, setFlag] = useState([false]);
    const protocoloCab = useRef([]);
    const documentoId = useRef('');

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
        const documenCheck = (docuCheck.docs.map((doc) => ({ ...doc.data(), id: doc.id, valor: false })));
        setItemsCheck(documenCheck);
        const docLlen = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'LLENADO'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc) => ({ ...doc.data(), id: doc.id, valor: '' })));
        setItemsLlenado(documenLlen);
        const docSel = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'SELECCION'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc) => ({ ...doc.data(), id: doc.id, valor: false })));
        setItemsSelec(documenSel);
    }

    //Funcion guardar las cabeceras de Bitacoras
    const BitacoraCabDB = async ({ nombre_protocolo, cab_id_protocolo, fecha_mantencion, familia, tipo, serie, eq_id, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
        try {
            const documento = await addDoc(collection(db, 'bitacoracab'), {
                nombre_protocolo: nombre_protocolo,
                cab_id_protocolo: cab_id_protocolo,
                fecha_mantencion: fecha_mantencion,
                familia: familia,
                tipo: tipo,
                serie: serie,
                eq_id: eq_id,
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
        setItemsLlenado((prevItems) => {
            const nuevosElementos = [...prevItems];
            console.log('nuevosElementos', nuevosElementos)
            nuevosElementos[index].valor = e.target.value;
            return nuevosElementos;
        });
    }
    const handleButtonClickSelec = (e, index) => {
        setItemsCheck((prevItems) => {
            const nuevosElementos = [...prevItems];
            console.log('nuevosElementos', nuevosElementos)
            nuevosElementos[index].valor = e.target.value;
            return nuevosElementos;
        });
    }
    // Agregar Cabecera de Protocolo
    const addCabBitacora = async (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        try {
            BitacoraCabDB({
                nombre_protocolo: nombreProtocolo,
                cab_id_protocolo: protocoloCab.current,
                fecha_mantencion: fechaAdd,
                familia: familia,
                tipo: tipo,
                serie: serie,
                eq_id: eq_id,
                confirmado: false,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod,
                emp_id: users.emp_id,
            })
            console.log('se guardo cabecera')
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Ingreso realizado exitosamente'
            })
        } catch (error) {
            console.log('no se guardo cabecera')
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: error
            })
        }
    }
    console.log('items Selec', itemsSelec)
    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Crea una nueva instancia de lote (batch)
        const batch = writeBatch(db);
        // Obtiene una referencia a una colección específica en Firestore
        const bitacoraRef = collection(db, 'bitacoras');
        // Itera a través de los nuevos documentos y agrégalos al lote de Checks
        // itemsCheck.forEach((docs) => {
        //     const nuevoDocRef = doc(bitacoraRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
        //     batch.set(nuevoDocRef, {
        //         item: docs.item,
        //         valor: docs.valor,
        //         categoria: docs.categoria,
        //         cab_id_bitacora: documentoId.current,
        //         userAdd: user.email,
        //         userMod: user.email,
        //         fechaAdd: fechaAdd,
        //         fechaMod: fechaMod,
        //         emp_id: users.emp_id,
        //     });
        // });
        // // Itera a través de los nuevos documentos y agrégalos al lote de Llenado
        // itemsLlenado.forEach((docs) => {
        //     const nuevoDocRef = doc(bitacoraRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
        //     batch.set(nuevoDocRef, {
        //         item: docs.item,
        //         valor: docs.valor,
        //         categoria: docs.categoria,
        //         cab_id_bitacora: documentoId.current,
        //         userAdd: user.email,
        //         userMod: user.email,
        //         fechaAdd: fechaAdd,
        //         fechaMod: fechaMod,
        //         emp_id: users.emp_id,
        //     });
        // });
        // Itera a través de los nuevos documentos y agrégalos al lote de Seleccion
        itemsSelec.forEach((docs) => {
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
                Swal.fire('Se ha producido un error al crear docuemento de entrada retirado');
            });
    }

    useEffect(() => {
        consultarProtocolos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manto, navigate])

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
                </ContentElemenMov>
                <BotonGuardar onClick={addCabBitacora}>Guardar</BotonGuardar>

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

                <Titulo style={{ fontSize: '18px' }}>Tabla de vacio</Titulo>
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
                        {itemsLlenado.map((item, index) => {
                            return (
                                <Table.Row key={index} >
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                                    <Table.Cell  >
                                        <Input
                                            type="text"
                                            value={item.valor}
                                            onChange={e => handleButtonClickLlen(e, index)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                    <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>

                <Titulo style={{ fontSize: '18px' }}>Seguridad electrica</Titulo>
                <ContentElemenMov>
                    {itemsSelec.map((item, index) => {
                        return (
                            <Select
                                key={index}
                                // value={item.valor}
                                // onChange={e => handleButtonClickSelec(e, index)}
                            >
                                <option>{item.item} :</option>
                                {Opcion.map((o, index) => {
                                    return (
                                        <option key={index}>{o.text}</option>
                                    )
                                })}
                            </Select>
                        )
                    })}
                </ContentElemenMov>

                <ContentElemenMov style={{ marginTop: '10px' }}>
                    <BotonGuardar onClick={handleSubmit}>Guardar</BotonGuardar>
                    <BotonGuardar>Confirmar</BotonGuardar>
                </ContentElemenMov>
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