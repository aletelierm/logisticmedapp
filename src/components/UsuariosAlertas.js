import React, { useEffect, useState } from 'react';
import Alerta from './Alertas'
import { db, auth } from './../firebase/firebaseConfig';
import { collection, getDocs} from 'firebase/firestore';
import { Table } from 'semantic-ui-react';
import * as FaIcons from 'react-icons/fa';
import { FaRegEdit } from "react-icons/fa";
/* import * as MdIcons from 'react-icons/md'; */
import ExportarExcel from '../funciones/ExportarExcel';
import {ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar} from '../elementos/General'
import {ContentElemen, Formulario, Input, Label} from '../elementos/CrearEquipos'
/* import { BiAddToQueue } from "react-icons/bi";
 */
export const UsuariosEnvios = () => {
    let fechaactual = new Date();
    const userAuth = auth.currentUser.email;
    const useradd = userAuth;
    const usermod = userAuth;

    const [correo, setCorreo] = useState('');
    const [ isCheckedSalida, setIsCheckedSalida] = useState(false);
    const [ isCheckedRfid, setIsCheckedRfid] = useState(false);
    const [ isCheckedConfirma, setIsCheckedConfirma] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [empresa, setEmpresa] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
       const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    //Lee datos de las empresas
    const getEmpresa = async () => {
        const dataEmpresa = await getDocs(collection(db, "empresas"));
        setEmpresa(dataEmpresa.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }
    //Lee datos de los usuarios
    const getUsuarios = async () => {
        const dataUsuarios = await getDocs(collection(db, "usuarios"));
        setUsuarios(dataUsuarios.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }

    useEffect(() => {
        getEmpresa();
        getUsuarios();
    }, [])
    //Lee input de formulario
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'email':
                setCorreo(e.target.value);
                break;           
            case 'nombre':
                setNombre(e.target.value);
                break;
            case 'apellido':
                setApellido(e.target.value);
                break;
            default:
                break;
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        
    }

    //Exportar a excel los equipos
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['empresa', 'nombre', 'apellido', 'correo', 'rol']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(usuarios, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'data.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Configura Alertas y Envíos</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action='' >
                    <ContentElemen>
                        <Label>Email</Label>
                        <Input
                          
                            type='email'
                            name='email'
                            placeholder='Ingrese Email'
                            value={correo}
                            onChange={handleChange}
                        /* onKeyDown={detectar} */
                        />
                        <Label>Nombre</Label>
                       
                        <Label >Apellido</Label>
                        
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Salidas</Label>
                        <Input
                            type='checkbox'
                            name='salida'                          
                            value='salidas'
                            onChange={handleChange}
                            checked={isCheckedSalida}
                        />
                        <Label>Rfid</Label>
                        <Input
                            type='checkbox'
                            name='rfid'                          
                            value='rfid'
                            onChange={handleChange}
                            checked={isCheckedRfid}

                        />
                        <Label>Confirmacion</Label>
                        <Input
                            type='checkbox'
                            name='confirma'                          
                            value='confirma'
                            onChange={handleChange}
                            checked={isCheckedConfirma}
                        />
                    </ContentElemen>
                    <BotonGuardar onClick={handleSubmit}>Guardar</BotonGuardar>
                </Formulario>
            </Contenedor>
            <ListarProveedor>
                <ContentElemen>
                    {/* <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                    <Titulo>Listado Usuarios y Alertas</Titulo>
                    {/* <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                </ContentElemen>
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Usuario'
                        /* value={buscador}
                        onChange={onBuscarCambios} */
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Proveedores a Excel' />
                </ContentElemen>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Correo</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Apellido</Table.HeaderCell>
                            <Table.HeaderCell>Empresa</Table.HeaderCell>
                            <Table.HeaderCell>Salidas</Table.HeaderCell>
                            <Table.HeaderCell>Rfid</Table.HeaderCell>
                            <Table.HeaderCell>Confirma</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            usuarios.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.correo}</Table.Cell>
                                        <Table.Cell>{item.nombre}</Table.Cell>
                                        <Table.Cell>{item.apellido}</Table.Cell>
                                        <Table.Cell>{item.empresa}</Table.Cell>
                                        <Table.Cell>Salidas</Table.Cell>
                                        <Table.Cell>Rfid</Table.Cell>
                                        <Table.Cell>Confirma</Table.Cell>                                       
                                        <Table.Cell style={{textAlign: 'center'}}>
                                        <FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }}/>
                                            {/* <Link to={`/actualizaproveedor/${item.id}`}>
                                                <FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }} />
                                            </Link> */}
                                        </Table.Cell>
                                    </Table.Row>

                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </ListarProveedor>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    )
}


export default UsuariosEnvios;