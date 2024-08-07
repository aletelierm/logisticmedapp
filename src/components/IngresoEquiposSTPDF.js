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

const IngresoEquiposSTPDF = ({vuelta}) => {
    //fecha hoy
    // const fechaHoy = new Date();
    const { users } = useContext(UserContext);
    
    const navigate = useNavigate();
    const { id, ruta } = useParams();
    console.log(ruta)
    const [ingreso] = useObtenerIngreso(id);

    const [test, setTest] = useState([]);
    const [folio, setFolio] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [date, setDate] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [serie, setSerie] = useState('');
    const [servicio, setServicio ] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [correo, setCorreo] = useState('');
    const [hora, setHora] = useState(0);
    const [usuarioIngreso, setUsuarioIngreso] = useState([]);
    
    const targetRef = useRef();
    
    const volver = () => {
        if (ruta === '1') {
            navigate('/serviciotecnico/ingreso')
        } else {
            navigate('/serviciotecnico/asignar')
        }
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
            setObservaciones(ingreso.observaciones)
            setHora(ingreso.horamaquina)                                      
        } else {
            navigate('/serviciotecnico/ingreso')
        }
    }, [ingreso, navigate])
   
    //Consultar usuario
    const consultarUsuario = async ()=>{
        const user = query(collection(db, 'usuarios'), where('emp_id', '==', users.emp_id));
        const userd = await getDocs(user);
        const traeuser = (userd.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setUsuarioIngreso(traeuser);
    }
  
    // Detalle de test de ingreso
    const consultarTest = async () => {
        const test = query(collection(db, 'testingreso'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
        const testIn = await getDocs(test);
        const existeTest = (testIn.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setTest(existeTest);
    }
    test.sort((a, b) => a.fechamod - b.fechamod)
    //Filtro para identificar el nommbre del usuario
    const usuario = usuarioIngreso.filter(usuario => usuario.correo === ingreso.useradd);
   
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
        consultarTest();
        consultarUsuario();            
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
   
    return (
        <>
            <ContenedorProveedor>
                <ContenedorProveedor style={{ padding: '40px' }} ref={targetRef} >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <img src={`../../${users.emp_id}.png`} alt='LogoEmprsa' style={{ height: '140px' }} />
                        </div>
                        <div style={{ marginTop: '50px', marginRight: '30px' }}>
                            <h3>www.dormirbien.cl</h3>
                        </div>
                    </div>
                    <Titulo style={{ fontSize: '24px' }}>Orden de Ingreso</Titulo>

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
                                <Table.Cell>{date ? formatearFecha(date) : '00/00/00 00:00'}</Table.Cell>
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
                                <Table.HeaderCell>Hora</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                                    <Table.Row>
                                        <Table.Cell >{familia}</Table.Cell>
                                        <Table.Cell  >{tipo}</Table.Cell>
                                        <Table.Cell>{marca}</Table.Cell>
                                        <Table.Cell>{modelo}</Table.Cell>
                                        <Table.Cell>{serie}</Table.Cell>
                                        <Table.Cell>{servicio}</Table.Cell>
                                        <Table.Cell>{hora}</Table.Cell>
                                    </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Test Ingreso */}
                    <Subtitulo style={{ fontSize: '18px' }}>Test de Ingreso</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Si</Table.HeaderCell>
                                <Table.HeaderCell>No</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {test.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.valorsi}></Input></Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.valorno}></Input></Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>

                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Observaciones</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                                    <Table.Row>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '16px' }}>{observaciones}</Table.Cell>
                                    </Table.Row>
                        </Table.Body>
                    </Table>

                    <div style={{ fontSize: '12px', lineHeight: '10px' }}>                       
                        <h4 style={{margin: '14px 0px'}}>{usuario.map((user)=>{
                            return ( <h4>Ingresado por: {user.nombre}  {user.apellido}</h4>)
                        })}</h4>

                        <h5 style={{margin: '14px 0px'}}>SERVICIO TÉCNICO</h5>
                        <p>soporte@dormirbien.cl</p>
                        <p>General Parra #674 Oficina H, Providencia</p>
                        <p>Contacto: +569 76321481 / +569 54234538</p>
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