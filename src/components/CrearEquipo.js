import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Alerta from './Alertas'
import { Table } from 'semantic-ui-react'
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query,addDoc,setDoc,doc,getDoc } from 'firebase/firestore';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import Modal from './Modal';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import ExportarExcel from '../funciones/ExportarExcel';
import Swal from 'sweetalert2';
/* import EnviarCorreo from '../funciones/EnviarCorreo'; */

const Proveedores = () => {
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
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [categoria, setCategoria] = useState('Tipo')
    const [flag, setFlag] = useState(false);
    const [estadoModal, setEstadoModal] = useState(false);
    const [status, setStatus] = useState([]);
    const [mostrarSt, setMostrarSt] = useState([]);
    /* const [empresa, setEmpresa] = useState([]); */
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
        const traerEmp = await getDoc(doc(db,'empresas', users.emp_id));     
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
        setEquipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    //Leer los datos de Equipos
    const getStatus = async () => {
        const traerEq = collection(db, 'status');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    //Funcion Guardar los equipos creados
    const EquipoDb = async ({ status,nomEntidad,familia, tipo, marca, modelo, serie, rfid, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
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
          
            Swal.fire('Se ha producido un error grave. Llame al Administrador',error);
        }
        
        try {
            //Guarda el status incial del equipo          
            await setDoc(doc(db,'status', documentoId.current),{
                emp_id: emp_id,
                familia: familia,
                tipo: tipo,
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
            Swal.fire('Se ha producido un error grave. Llame al Administrador',error);            
        }        
    }

    // Buscador de equipos
    const filtro = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return equipo.slice(pagina, pagina + 5);

        if (categoria === 'Familia') {
            const nuevoFiltro = equipo.filter(eq => eq.familia.includes(buscar));
            return nuevoFiltro.slice(pagina, pagina + 5);

        } else if (categoria === 'Tipo') {
            const nuevoFiltro = equipo.filter(eq => eq.tipo.includes(buscar));
            return nuevoFiltro.slice(pagina, pagina + 5);

        } else if (categoria === 'Marca') {
            const nuevoFiltro = equipo.filter(eq => eq.marca.includes(buscar));
            return nuevoFiltro.slice(pagina, pagina + 5);

        } else if (categoria === 'Modelo') {
            const nuevoFiltro = equipo.filter(eq => eq.modelo.includes(buscar));
            return nuevoFiltro.slice(pagina, pagina + 5);
        }
    }

    // Paginacion
    const siguientePag = () => {
        if (categoria === 'Familia') {
            if (equipo.filter(eq => eq.familia.includes(buscador)).length > pagina + 5)
                setPagina(pagina + 5);

        } else if (categoria === 'Tipo') {
            if (equipo.filter(eq => eq.tipo.includes(buscador)).length > pagina + 5)
                setPagina(pagina + 5);

        } else if (categoria === 'Marca') {
            if (equipo.filter(eq => eq.marca.includes(buscador)).length > pagina + 5)
                setPagina(pagina + 5);

        } else if (categoria === 'Modelo') {
            if (equipo.filter(eq => eq.modelo.includes(buscador)).length > pagina + 5)
                setPagina(pagina + 5);
        }
    }

    const paginaAnterior = () => {
        if (pagina > 0) setPagina(pagina - 5)
    }

    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setPagina(0);
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

    // Lee input de formulario
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'serie':
                setSerie(e.target.value);
                break;
            case 'rfid':
                setRfid(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        setFlag(false);

        const existeSerie = equipo.filter(equi => equi.serie === serie).length > 0;       
        
        if (nomFamilia ==='' || nomFamilia === 'Selecciona Opción:') {
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
                setNomFamilia('');
                setNomMarca('');
                setNomModelo('');
                setNomTipo('');
                setSerie('');
                setRfid('');
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Equipo creado correctamente'
                })
                setFlag(true);
                //Envio de correo 
               // const datosEquipo = nomTipo+" "+nomMarca+" "+nomModelo+" SN:"+serie                
               // EnviarCorreo('yeicoletelier@gmail.com','Creacion de equipo',`El usuario ${users.nombre} ${users.apellido} ha creado el equipo: ${datosEquipo}`)
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
        downloadLink.download = 'data.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorFormulario>
            <Contenedor>
                <Titulo>Crear Dispositivos Médicos</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Familias</Label>
                            <Select defaultValue='' value={nomFamilia} onChange={e => { setNomFamilia(e.target.value); sessionStorage.setItem('familia', e.target.value) }}>
                                {/* {fami ? <option>{nomFamilia}</option> : <option>Selecciona Opción:</option>} */}
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
                    </ContentElemen>
                    <ContentElemen>
                        <Label >N° Serie</Label>
                        <Input
                            type='text'
                            placeholder='Ingrese N° Serie'
                            name='serie'
                            value={serie}
                            onChange={handleChange}
                        />
                        <Label >RFID</Label>
                        <Input
                            type='text'
                            placeholder='RFID'
                            name='rfid'
                            value={rfid}
                            onChange={handleChange}
                            disabled
                        />
                    </ContentElemen>
                    <BotonGuardar>Crear</BotonGuardar>
                </Formulario>
            </Contenedor>

            <ListarProveedor>
                <ContentElemen>
                    <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: 'green' }} /></Boton>
                    <Titulo>Listado de Dispositivos Médicos</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>
                <ContentElemenSelect>
                    <Label>Buscar Por</Label>
                    <Select required value={categoria} onChange={e => setCategoria(e.target.value)} >
                        {/* <option>Selecciona Opción:</option> */}
                        <option>Familia</option>
                        <option>Tipo</option>
                        <option>Marca</option>
                        <option>Modelo</option>
                    </Select>
                </ContentElemenSelect>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} title='Buscar Equipos' />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder={`Buscar ${categoria}`}
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: 'green', marginLeft: '20px' }} title='Exportar Equipos a Excel' />
                </ContentElemen>

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
                            filtro().map((item) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{item.id2}</Table.Cell>
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
                                            }><MdIcons.MdFactCheck style={{ fontSize: '20px', color: 'green' }} />
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
        </ContenedorFormulario>
    );
};

const ContenedorFormulario = styled.div``

const Contenedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
    font-size: 15px;
`

const Titulo = styled.h2`
    color:  #83d394;
`

const ContentElemen = styled.div`
    display: flex;
    text-align: center;
    padding: 7px;
    margin-right: 30px;
    align-items: center;
    justify-content: space-between;
`

const ContentElemenSelect = styled.div`
    padding: 20px;
`
const Select = styled.select`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 200px;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`
const Formulario = styled.form``

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
`
const Label = styled.label`
        padding: 5px;
        font-size: 20px;
`
const Boton = styled.button`
    background-color: #ffffff;
    color: green;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
`
const BotonGuardar = styled.button`
    background-color: #83d394;
    color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
    // &:hover{
    //     background-color: #83d310;
    // }
`
const Boton2 = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;

	&:hover {
		background: #0066FF;
	}
`
const Contenido = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

`
export default Proveedores;