import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import { Select, Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query /*, getDoc, doc updateDoc, writeBatch, addDoc */ } from 'firebase/firestore';
import { BotonGuardar, Contenedor, ListarProveedor, Titulo /*, BotonGuardar*/ } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect /*, Formulario, Label*/, Input} from '../elementos/CrearEquipos'

const EjecutarMantencion = () => {
    const user = auth.currentUser;
    // let fechaActual = new Date();
    const navigate = useNavigate();
    const { id } = useParams();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [protocolo, setProtocolo] = useState([]);
    // const [protocolCab, setProtocoloCab] = useState([]);
    // const [flag, setFlag] = useState([false]);


    // Leer Protocolos 
    const leerProt = async () => {
        console.log('id leer prot', id)
        const traer = collection(db, 'protocolos');
        const doc = query(traer, where('cab_id', '==', id));
        const documento = await getDocs(doc)
        setProtocolo(documento.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    const volver = () => {
        navigate('/mantencion')
    }
    useEffect(() => {
        leerProt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});        
    // }

    return (
        <ContenedorCliente>
            <Contenedor>
                <Titulo>Ejecutar Mantención</Titulo>
            </Contenedor>
            <Contenedor>
                <Titulo>PAUTA DE MANTENCIÓN ANUAL</Titulo>
                <ContentElemenMov>
                    <ContentElemenSelect>
                        <h4>Familia : VENTILADOR MECANICO</h4>
                        <h4>Tipo Equipamiento : VENTILADOR MECANICO</h4>
                    </ContentElemenSelect>
                </ContentElemenMov>
                <ContentElemenMov>
                    <ContentElemenSelect>
                        <h4>Instrumentos requeridos : </h4>
                    </ContentElemenSelect>
                    <ContentElemenSelect>
                        <h6>- MEDIDOR DE AISLACION</h6>
                        <h6>- ANALIZADOR DE SEGURIDAD</h6>
                    </ContentElemenSelect>
                </ContentElemenMov>
                <ListarProveedor>
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
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>INSPECCIÓN DE PLACA CALEFACTORA Y SISTEMA DE SOPORTE PARA LA CÁMARA DE AGUA, VERIFIQUE SIGNOS DE CORROSIÓN O DAÑOS</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox"
                                // checked={item.checked}
                                // onChange={() => handleCheckboxChange(item.id)}
                                /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.Cell >2</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>INSPECCIÓN VISUAL SWITCH ON/OFF VERIFICAR ENCENDIDO Y APAGADO</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>
                            <Table.Row >
                                <Table.Cell >3</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>SANITIZACION</Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                                <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" /></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ListarProveedor>

                <ListarProveedor>
                    <h3>Tabla de vacio</h3>
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
                </ListarProveedor>
                <ListarProveedor>
                    <h3>Seguridad electrica</h3>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row style={{ textAlign: 'center' }}>
                                <Table.HeaderCell >Clasificación</Table.HeaderCell>
                                <Table.HeaderCell >Corriente de Fuga</Table.HeaderCell>
                                <Table.HeaderCell >Aislacion cable</Table.HeaderCell>
                                <Table.HeaderCell >Resistencia tierra</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row style={{ textAlign: 'center' }}>
                                <Table.Cell ><Select><option>Selecciona Opción:</option></Select></Table.Cell>
                                <Table.Cell ><Select><option>Selecciona Opción:</option></Select></Table.Cell>
                                <Table.Cell ><Select><option>Selecciona Opción:</option></Select></Table.Cell>
                                <Table.Cell ><Select><option>Selecciona Opción:</option></Select></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ListarProveedor>
                <ContentElemenMov style={{marginTop: '30px'}}>
                    <BotonGuardar>Guardar</BotonGuardar>
                    <BotonGuardar>Confirmar</BotonGuardar>
                </ContentElemenMov>
            </Contenedor>
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