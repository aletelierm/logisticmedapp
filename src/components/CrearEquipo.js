import React, { useState, useEffect, useRef } from 'react';
import Alerta from './Alertas'
import { Table } from 'semantic-ui-react'
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import Modal from './Modal';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ExportarExcel from '../funciones/ExportarExcel';
import Swal from 'sweetalert2';
/* import EnviarCorreo from '../funciones/EnviarCorreo'; */
import { ContentElemenSelect, Select, Formulario, Input, Label, Contenido } from '../elementos/CrearEquipos'
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, BotonGuardar, Boton2 } from '../elementos/General';

const CrearEquipos = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [familia, setFamilia] = useState([]);
    const [nomFamilia, setNomFamilia] = useState(sessionStorage.getItem('familia'));
    const [tipo, setTipo] = useState([]);
    const [nomTipo, setNomTipo] = useState(sessionStorage.getItem('tipo'));
    const [marca, setMarca] = useState([]);
    const [nomMarca, setNomMarca] = useState(sessionStorage.getItem('marca'));
    const [modelo, setModelo] = useState([]);
    const [nomModelo, setNomModelo] = useState(sessionStorage.getItem('modelo'));
    const [serie, setSerie] = useState('');
    const [rfid, setRfid] = useState('');
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [equipo, setEquipo] = useState([]);
    // const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [categoria, setCategoria] = useState('Tipo')
    const [flag, setFlag] = useState(false);
    const [estadoModal, setEstadoModal] = useState(false);
    const [status, setStatus] = useState([]);
    const [mostrarSt, setMostrarSt] = useState([]);
    const documentoId = useRef('');
    const empresaRut = useRef('');

    //Leer los datos de Familia
    const getFamilia = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setFamilia(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer  Empresa
    const getEmpresa = async () => {
        const traerEmp = await getDoc(doc(db, 'empresas', users.emp_id));
        /* setEmpresa(traerEmp.data());  */
        empresaRut.current = traerEmp.data().rut;
    }
    //Leer los datos de Tipos
    const getTipo = async () => {
        const traerTip = collection(db, 'tipos');
        const dato = query(traerTip, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setTipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Marcas
    const getMarca = async () => {
        const traerMar = collection(db, 'marcas');
        const dato = query(traerMar, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setMarca(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Modelos
    const getModelo = async () => {
        const traerMod = collection(db, 'modelos');
        const dato = query(traerMod, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setModelo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Leer los datos de Equipos
    const getEquipo = async () => {
        const traerEq = collection(db, 'equipos');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEquipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id})));
    }
    //Leer los datos de Equipos
    const getStatus = async () => {
        const traerEq = collection(db, 'status');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }
    //Funcion Guardar los equipos creados
    const EquipoDb = async ({ status, nomEntidad, familia, tipo, marca, modelo, serie, rfid, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
        try {
            const documento = await addDoc(collection(db, 'equipos'), {
                familia: familia,
                tipo: tipo,
                marca: marca,
                modelo: modelo,
                serie: serie,
                rfid: rfid,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                emp_id: emp_id
            });
            documentoId.current = documento.id;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }

        try {
            //Guarda el status incial del equipo          
            await setDoc(doc(db, 'status', documentoId.current), {
                emp_id: emp_id,
                familia: familia,
                tipo: tipo,
                marca: marca,
                modelo: modelo,
                status: status,
                entidad: nomEntidad,
                serie: serie,
                flag: true,
                rut: empresaRut.current,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod
            });
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }
    }

    function ordenar(a, b) {
        // Primero, comparar por Familia
        const familiaA = a.familia;
        const familiaB = b.familia;
        if (familiaA < familiaB) {
            return -1;
        }
        if (familiaA > familiaB) {
            return 1;
        }
        // Si las Familias son iguales, comparar por Tipo
        const tipoA = a.tipo;
        const tipoB = b.tipo;
        if (tipoA < tipoB) {
            return -1;
        }
        if (tipoA > tipoB) {
            return 1;
        }
        // Si los apellidos y nombres son iguales, no se cambia el orden
        return 0;
    }
    // Ordenar el arreglo de objetos por múltiples campos
    equipo.sort(ordenar);

    // Buscador de equipos
    const filtro = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return equipo.slice(/*pagina, pagina + 5*/);
        if (categoria === 'Familia') {
            const nuevoFiltroFamilia = equipo.filter(eq => eq.familia.includes(buscar));
            return nuevoFiltroFamilia.slice(/*pagina, pagina + 5*/);
        } else if (categoria === 'Tipo') {
            const nuevoFiltroTipo = equipo.filter(eq => eq.tipo.includes(buscar));
            return nuevoFiltroTipo.slice(/*pagina, pagina + 5*/);
        } else if (categoria === 'Marca') {
            const nuevoFiltro = equipo.filter(eq => eq.marca.includes(buscar));
            return nuevoFiltro.slice(/*pagina, pagina + 5*/);
        } else if (categoria === 'Modelo') {
            const nuevoFiltro = equipo.filter(eq => eq.modelo.includes(buscar));
            return nuevoFiltro.slice(/*pagina, pagina + 5*/);
        } else if (categoria === 'N°Serie') {
            const nuevoFiltro = equipo.filter(eq => eq.serie.includes(buscar));
            return nuevoFiltro.slice(/*pagina, pagina + 5*/);
        }
    }

    // Paginacion
    // const siguientePag = () => {
    //     const buscar = buscador.toLocaleUpperCase();
    //     if (categoria === 'Familia') {
    //         if (equipo.filter(eq => eq.familia.includes(buscar)).length > pagina + 5)
    //             setPagina(pagina + 5);
    //     } else if (categoria === 'Tipo') {
    //         if (equipo.filter(eq => eq.tipo.includes(buscar)).length > pagina + 5)
    //             setPagina(pagina + 5);
    //     } else if (categoria === 'Marca') {
    //         if (equipo.filter(eq => eq.marca.includes(buscar)).length > pagina + 5)
    //             setPagina(pagina + 5);
    //     } else if (categoria === 'Modelo') {
    //         if (equipo.filter(eq => eq.modelo.includes(buscar)).length > pagina + 5)
    //             setPagina(pagina + 5);
    //     } else if (categoria === 'N°Serie') {
    //         if (equipo.filter(eq => eq.serie.includes(buscar)).length > pagina + 5)
    //             setPagina(pagina + 5);
    //     }
    // }

    // const paginaAnterior = () => {
    //     if (pagina > 0) setPagina(pagina - 5)
    // }
    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        // setPagina(0);
        setBuscardor(target.value)
    }

    useEffect(() => {
        getFamilia();
        getTipo();
        getMarca();
        getModelo();
        getEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getEquipo();
        getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag])

    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        setFlag(false);

        const existeSerie = equipo.filter(equi => equi.serie === serie).length > 0;
        if (nomFamilia === '' || nomFamilia === 'Selecciona Opción:') {
            console.log(nomFamilia);
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Familia'
            })
        } else if (nomTipo === '' || nomTipo === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Tipo Equipamiento'
            })
        } else if (nomMarca === '' || nomMarca === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Marca'
            })
        } else if (nomModelo === '' || nomModelo === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Modelo'
            })
        } else if (serie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Ingresar N° Serie'
            })
            // } else if (rfid === '') {
            //     cambiarEstadoAlerta(true);
            //     cambiarAlerta({
            //         tipo: 'error',
            //         mensaje: 'Favor Ingresar RFID'
            //     })
        } else if (existeSerie) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra registrado'
            })
        } else {
            try {
                //llama a la funcion guardar equipos y status, pasando los props
                EquipoDb({
                    familia: nomFamilia,
                    tipo: nomTipo,
                    marca: nomMarca,
                    modelo: nomModelo,
                    serie: serie,
                    rfid: rfid,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    emp_id: users.emp_id,
                    rut: users.rut,
                    nomEntidad: users.empresa,
                    status: 'PREPARACION'
                })
                /*   setNomFamilia('');
                setNomMarca('');
                setNomModelo('');
                setNomTipo('');
                setSerie('');
                setRfid(''); */
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Equipo creado correctamente'
                })
                setFlag(!flag);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const leerStatus = (id) => {
        const existeStatus = status.filter(st => st.id === id);
        setMostrarSt(existeStatus);
    }

    //Exportar a excel los equipos
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['id', 'familia', 'tipo', 'marca', 'modelo', 'serie', 'rfid']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(equipo, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'equipos.xlsx';
        downloadLink.click();
    }

    familia.sort((a, b) => {
        const nameA = a.familia;
        const nameB = b.familia;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    tipo.sort((a, b) => {
        const nameA = a.tipo;
        const nameB = b.tipo;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    marca.sort((a, b) => {
        const nameA = a.marca;
        const nameB = b.marca;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    modelo.sort((a, b) => {
        const nameA = a.modelo;
        const nameB = b.modelo;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Crear Dispositivos Médicos</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemenAdd>
                        <ContentElemenSelect>
                            <Label>Familias</Label>
                            <Select defaultValue='' value={nomFamilia} onChange={e => { setNomFamilia(e.target.value); sessionStorage.setItem('familia', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {familia.map((d) => {
                                    return (<option key={d.id}>{d.familia}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo Equipamiento</Label>
                            <Select value={nomTipo} onChange={e => { setNomTipo(e.target.value); sessionStorage.setItem('tipo', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {tipo.map((d) => {
                                    return (<option key={d.id}>{d.tipo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Marca</Label>
                            <Select value={nomMarca} onChange={e => { setNomMarca(e.target.value); sessionStorage.setItem('marca', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {marca.map((d) => {
                                    return (<option key={d.id}>{d.marca}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Modelo</Label>
                            <Select value={nomModelo} onChange={e => { setNomModelo(e.target.value); sessionStorage.setItem('modelo', e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {modelo.map((d) => {
                                    return (<option key={d.id}>{d.modelo}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenAdd>
                    <ContentElemenAdd>
                        <Label >N° Serie</Label>
                        <Input
                            type='text'
                            placeholder='Ingrese N° Serie'
                            name='serie'
                            value={serie}
                            onChange={e => setSerie(e.target.value)}
                        />
                        <Label >RFID</Label>
                        <Input
                            type='text'
                            placeholder='RFID'
                            name='rfid'
                            value={rfid}
                            onChange={e => setRfid(e.target.value)}
                            disabled
                        />
                    </ContentElemenAdd>
                    <BotonGuardar>Crear</BotonGuardar>
                </Formulario>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    {/* <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                    <Titulo>Listado de Dispositivos Médicos</Titulo>
                    {/* <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                </ContentElemenAdd>
                <ContentElemenSelect>
                    <Label>Buscar Por</Label>
                    <Select required value={categoria} onChange={e => setCategoria(e.target.value)} >
                        <option>Familia</option>
                        <option>Tipo</option>
                        <option>Marca</option>
                        <option>Modelo</option>
                        <option>N°Serie</option>
                    </Select>
                </ContentElemenSelect>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} title='Buscar Equipos' />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder={`Buscar ${categoria}`}
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Equipos a Excel' />
                </ContentElemenAdd>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>Marca</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>N° Serie</Table.HeaderCell>
                            <Table.HeaderCell>RFID</Table.HeaderCell>
                            <Table.HeaderCell>Ubicación</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            filtro().map((item, index) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.familia}</Table.Cell>
                                        <Table.Cell>{item.tipo}</Table.Cell>
                                        <Table.Cell>{item.marca}</Table.Cell>
                                        <Table.Cell>{item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>{item.rfid}</Table.Cell>
                                        <Table.Cell
                                            style={{ textAlign: 'center' }}
                                            title='Ver Satus del Equipo'
                                            onClick={() => {
                                                leerStatus(item.id)
                                                setEstadoModal(!estadoModal)
                                            }
                                            }><MdIcons.MdFactCheck style={{ fontSize: '20px', color: '#328AC4' }} />
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
            <Modal estado={estadoModal} cambiarEstado={setEstadoModal}>
                <Contenido>
                    <h1>Ubicacion del Equipo</h1>
                    {mostrarSt.map((st) => {
                        return <p key={st.id2}>El estado es en: {st.status}</p>
                    })}
                    <Boton2 onClick={() => setEstadoModal(!estadoModal)}>Aceptar</Boton2>
                </Contenido>
            </Modal>
        </ContenedorProveedor>
    );
};

export default CrearEquipos;