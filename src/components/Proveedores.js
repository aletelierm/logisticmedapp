import React, { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import Alerta from '../components/Alertas';
import AgregarProveedorDb from '../firebase/AgregarProveedorDb';
// import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { FaRegEdit } from "react-icons/fa";
import validarRut from '../funciones/validarRut';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ExportarExcel from '../funciones/ExportarExcel';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, BotonGuardar } from '../elementos/General'
import { ContentElemen, Formulario, Input, Label } from '../elementos/CrearEquipos'

const Proveedores = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();
    //Obtener datos de contexto global
    const { users } = useContext(UserContext);

    const [rut, setRut] = useState('')
    const [entidad, setEntidad] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [nomContacto, setNomContacto] = useState('')
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    // const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [leer, setLeer] = useState([]);
    const [flag, setFlag] = useState(false)

    //Lectura de datos filtrados por empresa
    const getData = async () => {
        const traerProveedor = collection(db, 'proveedores');
        const dato = query(traerProveedor, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    leer.sort((a, b) => {
        const nameA = a.nombre;
        const nameB = b.nombre;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    //filtrar para paginacion
    const filtroProveedor = () => {
        if (buscador.length === 0)
            return leer.slice( /* pagina, pagina + 5 */);
        const nuevoFiltro = leer.filter(prov => prov.nombre.includes(buscador));
        return nuevoFiltro.slice( /* pagina, pagina + 5 */);
    }
    // const siguientePag = () => {
    //     if (leer.filter(prov => prov.nombre.includes(buscador)).length > pagina + 5)
    //         setPagina(pagina + 5);
    // }
    // const paginaAnterior = () => {
    //     if (pagina > 0) setPagina(pagina - 5)
    // }
    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        // setPagina(0);
        setBuscardor(target.value)
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'rut':
                setRut(e.target.value);
                break;
            case 'entidad':
                setEntidad(e.target.value);
                break;
            case 'direccion':
                setDireccion(e.target.value);
                break;
            case 'telefono':
                setTelefono(e.target.value);
                break;
            case 'correo':
                setCorreo(e.target.value);
                break;
            case 'contacto':
                setNomContacto(e.target.value);
                break;
            default:
                break;
        }
    }

    // Validar rut
    const detectar = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            const p = query(collection(db, 'proveedores'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutProv = await getDocs(p)
            const final = (rutProv.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if (rutProv.docs.length !== 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe rut de proveedor'
                })
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que existe el rut en DB
        const existe = leer.filter(cli => cli.rut === rut).length === 0;
        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        //Comprobar que rut tenga formato correcto
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);
        if (rut === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Rut no puede estar vacio'
            })
            return;
        } else if (!expresionRegularRut.test(rut)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Formato incorrecto de rut'
            })
            return;
        } else if (validaR !== parseInt(digito)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut no válido'
            })
            return;
        } else if (entidad === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Razon Social no puede estar vacio'
            })
            return;
        } else if (direccion === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Dirección no puede estar vacio'
            })
            return;
        } else if (telefono === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo telefono no puede estar vacio'
            })
            return;
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'favor ingresar un correo valido'
            })
            return;
        } else if (nomContacto === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Contacto no puede estar vacio'
            })
            return;
        } else if (!existe) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut ya existe'
            })
            return;
        } else {
            const nom = entidad.toLocaleUpperCase().trim()
            const dir = direccion.toLocaleUpperCase().trim()
            const nomC = nomContacto.toLocaleUpperCase().trim()
            const corr = correo.toLocaleLowerCase().trim()
            try {
                AgregarProveedorDb({
                    rut: rut,
                    nombre: nom,
                    direccion: dir,
                    telefono: telefono,
                    correo: corr,
                    contacto: nomC,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id
                })
                setRut('');
                setEntidad('');
                setDireccion('');
                setTelefono('');
                setCorreo('');
                setNomContacto('')
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Proveedor registrado exitosamente'
                })
                setFlag(!flag)
                return;
            } catch (error) {
                console.log('se produjo un error al guardar', error);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: error
                })
            }
        }
    }
    //Exportar a excel los clientes
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['rut', 'nombre', 'direccion', 'telefono', 'correo', 'contacto']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(leer, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'proveedores.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Mis Proveedores</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action='' >
                    <ContentElemen>
                        <Label>Rut</Label>
                        <Input
                            maxLength='10'
                            type='text'
                            name='rut'
                            placeholder='Ingrese Rut sin puntos'
                            value={rut}
                            onChange={handleChange}
                            onKeyDown={detectar}
                        />
                        <Label>Razon Social</Label>
                        <Input
                            type='text'
                            name='entidad'
                            placeholder='Ingrese Razon Social'
                            value={entidad}
                            onChange={handleChange}
                        />
                        <Label >Dirección</Label>
                        <Input
                            type='text'
                            name='direccion'
                            placeholder='Ingrese Dirección'
                            value={direccion}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Telefono</Label>
                        <Input
                            type='number'
                            name='telefono'
                            placeholder='Ingrese Telefono'
                            value={telefono}
                            onChange={handleChange}
                        />
                        <Label>Email</Label>
                        <Input
                            type='email'
                            name='correo'
                            placeholder='Ingrese Correo'
                            value={correo}
                            onChange={handleChange}
                        />
                        <Label>Nombre Contacto</Label>
                        <Input
                            type='text'
                            name='contacto'
                            placeholder='Ingrese Nombre Contacto'
                            value={nomContacto}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <BotonGuardar onClick={handleSubmit}>Guardar</BotonGuardar>
                </Formulario>
            </Contenedor>
            <ListarProveedor>
                <ContentElemenAdd>
                    {/* <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                    <Titulo>Listado Proveedores</Titulo>
                    {/* <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                </ContentElemenAdd>
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Proveedor'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Proveedores a Excel' />
                </ContentElemen>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Razon Social</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Direccion</Table.HeaderCell>
                            <Table.HeaderCell>Telefono</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            filtroProveedor().map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.nombre}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.direccion}</Table.Cell>
                                        <Table.Cell>{item.telefono}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <Link to={`/actualizaproveedor/${item.id}`}>
                                                <FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }} />
                                            </Link>
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
    );
};

export default Proveedores;