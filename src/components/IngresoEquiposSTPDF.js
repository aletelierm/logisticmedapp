import React, { useState, useEffect, useRef } from 'react';
import generatePDF from 'react-to-pdf'
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react';
import { ContenedorProveedor, Titulo, Subtitulo, BotonGuardar } from '../elementos/General';
import { Input } from '../elementos/CrearEquipos';
import moment from 'moment';

const IngresoEquiposSTPDF = () => {
    //fecha hoy
    // const fechaHoy = new Date();
    const { users } = useContext(UserContext);

    const navigate = useNavigate();
    const { id } = useParams();
    const [ingreso] = useObtenerIngreso(id);

    const [detalle, setDetalle] = useState([]);
    const [test, setTest] = useState([]);
    // const [itemsSeg, setItemsSeg] = useState([]);
    const [folio, setFolio] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [date, setDate] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [obs, setObs] = useState('');

    const targetRef = useRef();
    // const bitacoraCab = useRef(0);

    const volver = () => {
        navigate('/serviciotecnico/ingreso')
    }

    useEffect(() => {
        if (ingreso) {
            // bitacoraCab.current = bitacora.id
            setFolio(ingreso.folio);
            setRut(ingreso.rut);
            setEntidad(ingreso.entidad);
            setDate(ingreso.date);
            setTelefono(ingreso.telefono);
            setDireccion(ingreso.direccion);
            setCorreo(ingreso.correo);
            setObs(ingreso.observaciones);
        } else {
            navigate('/serviciotecnico/ingreso')
        }
    }, [ingreso, navigate])

    // Detalle de Ingreso de equipo
    const consultarIngresosDet = async () => {
        const det = query(collection(db, 'ingresostdet'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
        const deta = await getDocs(det);
        const existeDet = (deta.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setDetalle(existeDet);
    }
    // Detalle de Bitacoras por categoria
    const consultarTest = async () => {
        const test = query(collection(db, 'testingreso'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
        const testIn = await getDocs(test);
        const existeTest = (testIn.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setTest(existeTest);
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        return formatear;
    }
    // Configuración de react-to-pdf
    const Options = {
        filename: 'Documento.pdf',
        margin: {
            top: '1in', // Margen superior
            right: '1in', // Margen derecho
            bottom: '1in', // Margen inferior
            left: '1in' // Margen izquierdo
        },
        // format: 'letter',
        orientation: 'landscape', // Orientación del PDF
        unit: 'in', // Unidad de medida
        format: 'a4' // Formato del PDF
    };


    useEffect(() => {
        consultarIngresosDet();
        consultarTest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ContenedorProveedor>
                <ContenedorProveedor style={{ padding: '40px' }} ref={targetRef} >
                    {/* <Contenedor> */}
                    <Titulo style={{ fontSize: '20px' }}>Orden de Ingreso</Titulo>
                    {/* </Contenedor> */}

                    {/* Informacion Cliente */}
                    <Subtitulo style={{ fontSize: '16px' }}>Informacion Cliente</Subtitulo>
                    <Table singleLine style={{ fontSize: '10px', lineHeight: '10px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Folio</Table.HeaderCell>
                                <Table.HeaderCell>Rut</Table.HeaderCell>
                                <Table.HeaderCell>Nombre</Table.HeaderCell>
                                <Table.HeaderCell>Fecha</Table.HeaderCell>
                                <Table.HeaderCell>Telefono</Table.HeaderCell>
                                <Table.HeaderCell>Dirección</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{folio}</Table.Cell>
                                <Table.Cell>{rut}</Table.Cell>
                                <Table.Cell>{entidad}</Table.Cell>
                                <Table.Cell>{formatearFecha(date)}</Table.Cell>
                                <Table.Cell>{telefono}</Table.Cell>
                                <Table.Cell>{direccion}</Table.Cell>
                                <Table.Cell>{correo}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Informacion Equipo */}
                    <Subtitulo style={{ fontSize: '16px' }}>Informacion Equipo</Subtitulo>
                    <Table singleLine style={{ fontSize: '10px', lineHeight: '10px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Familia</Table.HeaderCell>
                                <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                                <Table.HeaderCell>Marca</Table.HeaderCell>
                                <Table.HeaderCell>Modelo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Servicio</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {detalle.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell >{item.familia}</Table.Cell>
                                        <Table.Cell  >{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.marca}</Table.Cell>
                                        <Table.Cell>{item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.servicio}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    {/* Test Ingreso */}
                    <Subtitulo style={{ fontSize: '16px' }}>Test de Ingreso</Subtitulo>
                    <Table singleLine style={{ fontSize: '10px', lineHeight: '10px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Si</Table.HeaderCell>
                                <Table.HeaderCell>No</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {test.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.valorsi}></Input></Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.valorno}></Input></Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <Table singleLine style={{ fontSize: '10px', lineHeight: '10px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Observaciones</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {detalle.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{obs}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <div style={{ fontSize: '10px', lineHeight: '10px' }}>
                        <h3>Tecnico: {users.nombre + ' ' + users.apellido}</h3>
                        <h4>SERVICIO TÉCNICO</h4>
                        <p>soporte@dormirbien.cl</p>
                        <p>General Parra #674 Oficina H, Providencia</p>
                        <p>+569 59505300</p>
                    </div>
                </ContenedorProveedor>

                <div>
                    <BotonGuardar style={{ marginTop: '30px' }} onClick={volver} >Volver</BotonGuardar>
                    <BotonGuardar onClick={() => generatePDF(targetRef, Options)}>Descargar PDF</BotonGuardar>
                </div>
            </ContenedorProveedor>
        </>
    );
}

export default IngresoEquiposSTPDF;