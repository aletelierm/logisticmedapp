import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerMantencion from '../hooks/useObtenerMantencion';
import { Select, Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
// import { getDocs, collection, where, query /*, getDoc, doc updateDoc, writeBatch, addDoc */ } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { BotonGuardar, Contenedor, Titulo /*, BotonGuardar*/ } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect /*, Formulario, Label*/, Input } from '../elementos/CrearEquipos'

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
    // const [protocolo, setProtocolo] = useState('');
    const [protocolCab, setProtocoloCab] = useState('');
    const [nombreProtocolo, setNombreProtocolo] = useState('');
    const [programa, setPrograma] = useState('');
    const [dias, setDias] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [serie, setSerie] = useState('');
    const [eq_id, setEq_id] = useState('');
    // const [flag, setFlag] = useState([false]);

    const volver = () => {
        navigate('/serviciotecnico/mantencion')
    }

    useEffect(() => {
        if (manto) {
            setProtocoloCab(manto.cab_id_protocol)
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

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});        
    // }

    return (
        <ContenedorCliente style={{ width: '800px' }}>
            <Contenedor>

                <Titulo>Ejecutar Mantención</Titulo>
            </Contenedor>
            <Contenedor>
                <Titulo>{nombreProtocolo}</Titulo>
                <ContentElemenSelect style={{ textAlign: 'left' }}>
                    <h4 style={{ marginTop: '10px' }}>Familia : {familia}</h4>
                    <h4 style={{ marginTop: '0px' }}>Tipo Equipamiento :{tipo}</h4>
                </ContentElemenSelect>
                <ContentElemenSelect style={{ textAlign: 'left', padding: '5px 20px' }}>
                    <h4>Instrumentos requeridos : </h4>
                    <h6>- MEDIDOR DE AISLACION</h6>
                    <h6>- ANALIZADOR DE SEGURIDAD</h6>
                </ContentElemenSelect>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Pasa</Table.HeaderCell>
                            <Table.HeaderCell>No Pasa</Table.HeaderCell>
                            <Table.HeaderCell>N/A</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row >
                            <Table.Cell >1</Table.Cell>
                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>INSPECCIÓN DE PLACA CALEFACTORA Y SISTEMA DE SOPORTE PARA LA CÁMARA DE AGUA, VERIFIQUE SIGNOS DE CORROSIÓN O DAÑOS</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.Cell >2</Table.Cell>
                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>INSPECCIÓN VISUAL SWITCH ON/OFF VERIFICAR ENCENDIDO Y APAGADO</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.Cell >3</Table.Cell>
                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>SANITIZACION</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <Titulo style={{fontSize: '18px'}}>Tabla de vacio</Titulo>
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
                        <Table.Row >
                            <Table.Cell >1</Table.Cell>
                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>TEMPERATURA</Table.Cell>
                            <Table.Cell  ><Input type="text" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.Cell >2</Table.Cell>
                            <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>TEMPERATURA</Table.Cell>
                            <Table.Cell  ><Input type="text" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <Titulo style={{fontSize: '18px'}}>Seguridad electrica</Titulo>
                <ContentElemenMov>
                    <ContentElemenSelect>
                        <Select><option>Clasificación:</option></Select>
                    </ContentElemenSelect>
                    <ContentElemenSelect>
                        <Select><option>Corriente de Fuga:</option></Select>
                    </ContentElemenSelect>
                </ContentElemenMov>
                <ContentElemenMov>
                    <ContentElemenSelect>
                        <Select><option>Aislacion cable:</option></Select>
                    </ContentElemenSelect>
                    <ContentElemenSelect>
                        <Select><option>Resistencia tierra:</option></Select>
                    </ContentElemenSelect>
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