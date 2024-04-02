import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerBitacora from '../hooks/useObtenerBitacora';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react';
import { Contenido } from '../elementos/CrearEquipos'
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, Subtitulo, BotonGuardar } from '../elementos/General';
import moment from 'moment';

const CheckMantoPDF = () => {
    //fecha hoy
    const fechaHoy = new Date();
    const { users } = useContext(UserContext);
    console.log(users)

    const navigate = useNavigate();
    const { id } = useParams();
    const [bitacora] = useObtenerBitacora(id);

    const [itemsCheck, setItemsCheck] = useState([]);
    const [itemsMedicion, setItemsMedicion] = useState([]);
    const [itemsSeg, setItemsSeg] = useState([]);
    const [nombreProtocolo, setNombreProtocolo] = useState([]);
    const [familia, setFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [serie, setSerie] = useState([]);
    const [fechaManto, setFechaManto] = useState([]);
    const bitacoraCab = useRef(0);

    const volver = () => {
        navigate('/serviciotecnico/bitacora')
    }

    useEffect(() => {
        if (bitacora) {
            console.log(id)
            // bitacoraCab.current = bitacora.id
            setNombreProtocolo(bitacora.nombre_protocolo);
            setFamilia(bitacora.familia);
            setTipo(bitacora.tipo);
            setSerie(bitacora.serie);
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
        const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    useEffect(() => {
        consultarBitacoras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>{nombreProtocolo}</Titulo>
            </Contenedor>

            <ListarProveedor>
                {/* Contenido del cliente */}
                <Subtitulo>Identificacion del equipo Médicos</Subtitulo>
                <Table singleLine>
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
                            {/* <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }} >{formatearFecha(fechaManto)}</Table.Cell> */}
                        </Table.Row>
                    </Table.Body>
                </Table>
            </ListarProveedor>

            <ListarProveedor>
                {/* Detalle de bitacora Checks */}
                <Subtitulo>Protocolo de Mantencion</Subtitulo>
                <Table singleLine>
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
            </ListarProveedor>

            <ListarProveedor>
                {/* Detalle de bitacora Tabla de presion */}
                <Subtitulo>Test de Presión</Subtitulo>
                <Table singleLine>
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
                <p>** Medición efectuada con flujometro digital CITREX H4 IMTMEDICAL **</p>
            </ListarProveedor>

            <Contenedor>
                <h3>Tecnico: {users.nombre + ' ' + users.apellido}</h3>
                <h4>SERVICIO TÉCNICO</h4>
                <p>soporte@dormirbien.cl</p>
                <p>General Parra #674 Oficina H, Providencia</p>
                <p>+569 59505300</p>
            </Contenedor>

            <BotonGuardar style={{ marginTop: '30px' }} onClick={volver} >Volver</BotonGuardar>
        </ContenedorProveedor>
    )
}

export default CheckMantoPDF