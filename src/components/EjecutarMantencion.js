import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerMantencion from '../hooks/useObtenerMantencion';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query /*, getDoc, doc updateDoc, writeBatch, addDoc */ } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { BotonGuardar, Contenedor, Titulo, BotonCheck } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Select, Label, Input } from '../elementos/CrearEquipos'
import { Opcion } from './TipDoc';
import '../styles/activarBoton.css'

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
    const [protocolCab, setProtocolCab] = useState('');
    const [nombreProtocolo, setNombreProtocolo] = useState('');
    const [programa, setPrograma] = useState('');
    const [dias, setDias] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [serie, setSerie] = useState('');
    const [eq_id, setEq_id] = useState('');
    // const [flag, setFlag] = useState([false]);
    const protocoloCab = useRef([]);

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
        const documenCheck = (docuCheck.docs.map((doc) => ({ ...doc.data(), id: doc.id, valor: false})));
        setItemsCheck(documenCheck);
        const docLlen = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'LLENADO'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc) => ({ ...doc.data(), id: doc.id, pasa: false, nopasa: false })));
        setItemsLlenado(documenLlen);
        const docSel = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('cab_id', '==', protocoloCab.current), where('categoria', '==', 'SELECCION'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc) => ({ ...doc.data(), id: doc.id, pasa: false, nopasa: false })));
        setItemsSelec(documenSel);
    }
    console.log('itemsCheck', itemsCheck)

    const handleButtonClick = (index, buttonId) => {
        setItemsCheck((prevItems) => {
            const nuevosElementos = [...prevItems];
        console.log('nuevosElementos', nuevosElementos)
            nuevosElementos[index].valor = buttonId;
            return nuevosElementos;
        });
    }

// const handleSubmit = (e) => {
//     e.preventDefault();
//     cambiarEstadoAlerta(false);
//     cambiarAlerta({});        
// }

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
            <BotonGuardar>Guardar</BotonGuardar>

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
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                <Table.Cell  ><Input type="text" /></Table.Cell>
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
                        <Select key={index}>
                            <option key={index}>{item.item} :</option>
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
                <BotonGuardar>Guardar</BotonGuardar>
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