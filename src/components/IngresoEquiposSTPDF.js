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
import { ContentElemenMov, ContentElemenSelect, Input, Label, TextArea } from '../elementos/CrearEquipos';
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
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [serie, setSerie] = useState('');
    const [servicio, setServicio] = useState('');
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

        setFamilia(existeDet[0].familia);
        setTipo(existeDet[0].tipo);
        setMarca(existeDet[0].marca);
        setModelo(existeDet[0].modelo);
        setSerie(existeDet[0].serie);
        setServicio(existeDet[0].servicio);
        setObs(existeDet[0].observaciones);
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
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Folio</Label>
                            <Input disabled value={folio} />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Rut</Label>
                            <Input disabled value={rut} />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha de Ingreso</Label>
                            <Input disabled value={date} />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Telefono</Label>
                            <Input value={telefono} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Dirección</Label>
                            <Input value={direccion} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Email</Label>
                            <Input value={correo} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>

                    {/* Informacion Equipo */}
                    <Subtitulo style={{ fontSize: '16px' }}>Protocolo de Mantencion</Subtitulo>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Familia</Label>
                            <Input value={familia} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo Equipamiento</Label>
                            <Input value={tipo} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Marca</Label>
                            <Input value={marca} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Modelo</Label>
                            <Input value={modelo} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>N° Serie</Label>
                            <Input value={serie} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Servicio</Label>
                            <Input value={servicio} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>

                    {/* Test Ingreso */}
                    <Subtitulo style={{ fontSize: '16px' }}>Test de Presión</Subtitulo>
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
                                        <Table.Cell  >{item.valorsi}</Table.Cell>
                                        <Table.Cell>{item.valorno}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                    <ContentElemenMov style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Label>Observaciones</Label>
                        <TextArea style={{ width: '80%', height: '60px' }} value={obs} disabled />
                    </ContentElemenMov>

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