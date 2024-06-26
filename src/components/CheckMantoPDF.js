import React, { useState, useEffect, useRef } from 'react';
import generatePDF from 'react-to-pdf'
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerBitacora from '../hooks/useObtenerBitacora';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react';
import { ContenedorProveedor, Titulo, Subtitulo, BotonGuardar } from '../elementos/General';
import moment from 'moment';

const CheckMantoPDF = () => {
    //fecha hoy
    // const fechaHoy = new Date();
    const { users } = useContext(UserContext);

    const navigate = useNavigate();
    const { id } = useParams();
    const [bitacora] = useObtenerBitacora(id);

    const [itemsCheck, setItemsCheck] = useState([]);
    const [itemsMedicion, setItemsMedicion] = useState([]);
    const [itemsSeg, setItemsSeg] = useState([]);
    const [nombreProtocolo, setNombreProtocolo] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [serie, setSerie] = useState('');
    const [fechaManto, setFechaManto] = useState(null);
    const targetRef = useRef();
    // const bitacoraCab = useRef(0);

    console.log(itemsSeg);
    console.log(familia);

    const volver = () => {
        navigate('/serviciotecnico/bitacora')
    }

    useEffect(() => {
        if (bitacora) {
            // bitacoraCab.current = bitacora.id
            setNombreProtocolo(bitacora.nombre_protocolo);
            setFamilia(bitacora.familia);
            setTipo(bitacora.tipo);
            setSerie(bitacora.serie);
            console.log('bitacora.fecha', bitacora.fecha_mantencion)
            setFechaManto(bitacora.fecha_mantencion);
        } else {
            navigate('/serviciotecnico/bitacora')
        }
    }, [bitacora, navigate])

    // Detalle de Bitacoras por categoria
    const consultarBitacoras = async () => {
        const docCheck = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'CHECK'));
        const docuCheck = await getDocs(docCheck);
        const documenCheck = (docuCheck.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsCheck(documenCheck);

        const docLlen = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'MEDICION'));
        const docuLlen = await getDocs(docLlen);
        const documenLlen = (docuLlen.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsMedicion(documenLlen);

        const docSel = query(collection(db, 'bitacoras'), where('emp_id', '==', users.emp_id), where('cab_id_bitacora', '==', id), where('categoria', '==', 'SEGURIDAD'));
        const docuSel = await getDocs(docSel);
        const documenSel = (docuSel.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setItemsSeg(documenSel);
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
        consultarBitacoras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ContenedorProveedor>
                <ContenedorProveedor style={{ padding: '40px' }} ref={targetRef} >
                    {/* <Contenedor> */}
                    <div>
                        <img src='../../ILZdSWD4irkgKTdzqsf0.png' alt='LogoEmprsa' style={{ height: '60px', width: '100px' }} />
                    </div>
                    <Titulo style={{fontSize: '20px'}}>{nombreProtocolo}</Titulo>
                    {/* </Contenedor> */}

                    {/* <ListarProveedor > */}
                    {/* Contenido del cliente */}
                    <Subtitulo style={{fontSize: '16px'}}>Identificacion del equipo Médicos</Subtitulo>
                    <Table singleLine style={{fontSize: '10px', lineHeight: '10px'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Cliente</Table.HeaderCell>
                                <Table.HeaderCell>Tipo de equipo</Table.HeaderCell>
                                <Table.HeaderCell>Marca</Table.HeaderCell>
                                <Table.HeaderCell>Modelo</Table.HeaderCell>
                                <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                <Table.HeaderCell>Fecha de Revision</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row >
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{users.empresa}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{tipo}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >Marca</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >Modelo</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{serie}</Table.Cell>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{fechaManto ? formatearFecha(fechaManto) : '00/00/00 00:00'}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    {/* </ListarProveedor> */}

                    {/* <ListarProveedor> */}
                    {/* Detalle de bitacora Checks */}
                    <Subtitulo style={{fontSize: '16px'}}>Protocolo de Mantencion</Subtitulo>
                    <Table singleLine style={{fontSize: '10px',lineHeight: '10px'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>item</Table.HeaderCell>
                                <Table.HeaderCell>Resultado</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {itemsCheck.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{item.item}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }} >{item.valor}</Table.Cell>
                                    </Table.Row>
                                )
                            })}

                        </Table.Body>
                    </Table>
                    <p>** Pruebas realiadas con Pulmón artificial, IMTMEDICAL EASYLUNG **</p>
                    {/* </ListarProveedor> */}

                    {/* <ListarProveedor> */}
                    {/* Detalle de bitacora Tabla de presion */}
                    <Subtitulo style={{fontSize: '16px'}}>Test de Presión</Subtitulo>
                    <Table singleLine style={{fontSize: '10px', lineHeight: '10px'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Medicion</Table.HeaderCell>
                                <Table.HeaderCell>Rango Ref.</Table.HeaderCell>
                                <Table.HeaderCell>Test</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {itemsMedicion.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell  >{item.valor}</Table.Cell>
                                        <Table.Cell>Por definir</Table.Cell>
                                        <Table.Cell>Por definir</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <Table singleLine style={{fontSize: '10px', lineHeight: '10px'}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Medicion</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {itemsSeg.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell  >{item.valor}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                    <p>** Medición efectuada con flujometro digital CITREX H4 IMTMEDICAL **</p>
                    {/* </ListarProveedor> */}

                    {/* <Contenedor> */}
                    <div style={{fontSize: '10px', lineHeight: '10px'}}>
                    <h3>Tecnico: {users.nombre + ' ' + users.apellido}</h3>
                    <h4>SERVICIO TÉCNICO</h4>
                    <p>soporte@dormirbien.cl</p>
                    <p>General Parra #674 Oficina H, Providencia</p>
                    <p>+569 59505300</p>
                    </div>
                    {/* </Contenedor> */}

                </ContenedorProveedor>

                <div>
                    <BotonGuardar style={{ marginTop: '30px' }} onClick={volver} >Volver</BotonGuardar>
                    <BotonGuardar onClick={() => generatePDF(targetRef, Options)}>Descargar PDF</BotonGuardar>
                </div>
            </ContenedorProveedor>
        </>
    );
}

export default CheckMantoPDF;