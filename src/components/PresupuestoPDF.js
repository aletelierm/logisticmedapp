import React, { useState, useEffect, useRef } from 'react';
import generatePDF from 'react-to-pdf'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
import { ContenedorProveedor, Titulo, BotonGuardar, Subtitulo } from '../elementos/General'
import moment from 'moment';

const PresupuestoPDF = () => {
    //fecha hoy
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [ingreso] = useObtenerIngreso(id);

    const [usuarioIngreso, setUsuarioIngreso] = useState([]);
    const [presupuestoCab, setPresupuestoCab] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    // const [id_cab_pre, setId_cab_pre] = useState('');
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
    const targetRef = useRef();
    const id_cab_pre = useRef();

    const volver = () => {
        navigate('/serviciotecnico/asignadostecnicos')
    }

    useEffect(() => {
        if (ingreso) {
            setFolio(ingreso.folio);
            setRut(ingreso.rut);
            setEntidad(ingreso.entidad);
            setDate(ingreso.date);
            setTelefono(ingreso.telefono);
            setDireccion(ingreso.direccion);
            setCorreo(ingreso.correo);
            setFamilia(ingreso.familia);
            setTipo(ingreso.tipo);
            setMarca(ingreso.marca);
            setModelo(ingreso.modelo);
            setSerie(ingreso.serie);
            setServicio(ingreso.servicio);
        } else {
            navigate('/serviciotecnico/asignadostecnicos')
        }
    }, [ingreso, navigate])

    //Consultar usuario
    const consultarUsuario = async () => {
        const user = query(collection(db, 'usuarios'), where('emp_id', '==', users.emp_id));
        const userd = await getDocs(user);
        const traeuser = (userd.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setUsuarioIngreso(traeuser);
    }

    // Detalle de Ingreso de equipo => Funcional
    const consultarPresupuestoCab = async () => {
        const pre = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id), where('confirmado', '==', true));
        const presu = await getDocs(pre);
        const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setPresupuestoCab(existePresupuesto);
        id_cab_pre.current = existePresupuesto[0].id;
    }
    console.log(id_cab_pre.current);

    // Detalle de Ingreso de equipo => Funcional
    const consultarPresupuesto = async () => {
        console.log('presupuesto', id_cab_pre.current)
        const pre = query(collection(db, 'presupuestos'), where('emp_id', '==', users.emp_id), where('id_cab_pre', '==', id_cab_pre.current));
        const presu = await getDocs(pre);
        const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setPresupuesto(existePresupuesto);
    }
    const usuario = usuarioIngreso.filter(usuario => usuario.correo === ingreso.useradd);
    const total = presupuesto.reduce((total, dato) => total + dato.price, 0);

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
        orientation: 'landscape', // Orientación del PDF
        unit: 'in', // Unidad de medida
        format: 'a4' // Formato del PDF
    };

    useEffect(() => {
        // consultarTest();
        consultarUsuario();
        consultarPresupuesto();
        consultarPresupuestoCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ContenedorProveedor>
            <ContenedorProveedor>
                <ContenedorProveedor style={{ padding: '40px' }} ref={targetRef} >
                    {/* cabecera pdf */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <img src={`../../${users.emp_id}.png`} alt='LogoEmprsa' style={{ height: '140px' }} />
                        </div>
                        <div style={{ marginTop: '50px', marginRight: '30px' }}>
                            <h3>www.dormirbien.cl</h3>
                        </div>
                    </div>
                    <Titulo style={{ fontSize: '24px' }}>Presupuesto</Titulo>
                    {/* Informacion Cliente */}
                    <Subtitulo style={{ fontSize: '18px' }}>Informacion Cliente</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
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
                                <Table.Cell>{date ? formatearFecha(ingreso.date) : '00/00/00 00:00'}</Table.Cell>
                                <Table.Cell>{telefono}</Table.Cell>
                                <Table.Cell>{direccion}</Table.Cell>
                                <Table.Cell>{correo}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Informacion Equipo */}
                    <Subtitulo style={{ fontSize: '18px' }}>Informacion Equipo</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
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
                            <Table.Row>
                                <Table.Cell>{familia}</Table.Cell>
                                <Table.Cell>{tipo}</Table.Cell>
                                <Table.Cell>{marca}</Table.Cell>
                                <Table.Cell>{modelo}</Table.Cell>
                                <Table.Cell>{serie}</Table.Cell>
                                <Table.Cell>{servicio}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Informacion Presuuesto */}
                    <Subtitulo style={{ fontSize: '18px' }}>Presupuesto</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Categoria</Table.HeaderCell>
                                <Table.HeaderCell>Precio</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {presupuesto.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell>{item.categoria}</Table.Cell>
                                        <Table.Cell>${item.price.toLocaleString()}.-</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }} colSpan='3'>Total</Table.HeaderCell>
                                <Table.HeaderCell style={{ fontSize: '16px', fontWeight: 'bold' }}>${total.toLocaleString()}.-</Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                    <div style={{ fontSize: '12px', lineHeight: '10px' }}>
                        <h4 style={{ margin: '14px 0px' }}>{usuario.map((user, index) => {
                            return (<h4 key={index}>Ingresado por: {user.nombre}  {user.apellido}</h4>)
                        })}</h4>

                        <h5 style={{ margin: '14px 0px' }}>SERVICIO TÉCNICO</h5>
                        <p>soporte@dormirbien.cl</p>
                        <p>General Parra #674 Oficina H, Providencia</p>
                        <p>Contacto: +569 76321481 / +569 54234538</p>
                    </div>
                </ContenedorProveedor>
                <div>
                    <BotonGuardar onClick={() => generatePDF(targetRef, Options)}>Descargar PDF</BotonGuardar>
                    <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                </div>
            </ContenedorProveedor>
        </ContenedorProveedor>
    )
}

export default PresupuestoPDF;