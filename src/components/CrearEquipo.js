import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Alerta from './Alertas'
import CrearEquipoDb from '../firebase/CrearEquipoDb';
import { Table } from 'semantic-ui-react'
import { db, auth } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FaRegEdit } from "react-icons/fa";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';


const Proveedores = () => {
    const userAuth = auth.currentUser.email;
    const userAdd = userAuth;
    const userMod = userAuth;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [familia, setFamilia] = useState([]);
    const [nomFamilia, setNomFamilia] = useState([]);
    const [tipo, setTipo] = useState([]);
    const [nomTipo, setNomTipo] = useState([]);
    const [marca, setMarca] = useState([]);
    const [nomMarca, setNomMarca] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [nomModelo, setNomModelo] = useState([]);
    const [serie, setSerie] = useState('');
    const [rfid, setRfid] = useState('');
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [equipo, setEquipo] = useState([]);
    /* const [leer, setLeer] = useState([]) */
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [categoria, setCategoria] = useState('Tipo')



    //Leer los datos de Familia
    const getFamila = async () => {
        const dataFamilia = await getDocs(collection(db, 'familias'));
        setFamilia(dataFamilia.docs.map((fam) => ({ ...fam.data(), id: fam.id })));
    }

    //Leer los datos de Tipos
    const getTipo = async () => {
        const dataTipo = await getDocs(collection(db, 'tipos'));
        setTipo(dataTipo.docs.map((tip) => ({ ...tip.data(), id: tip.id })));
    }

    //Leer los datos de Marcas
    const getMarca = async () => {
        const dataMarca = await getDocs(collection(db, 'marcas'));
        setMarca(dataMarca.docs.map((mar) => ({ ...mar.data(), id: mar.id })));
    }

    //Leer los datos de Modelos
    const getModelo = async () => {
        const dataModelo = await getDocs(collection(db, 'modelos'));
        setModelo(dataModelo.docs.map((mod) => ({ ...mod.data(), id: mod.id })));
    }

    //Leer los datos de Equipos
    const getEquipo = async () => {
        const dataEquipo = await getDocs(collection(db, 'crearequipos'));
        setEquipo(dataEquipo.docs.map((eq, index) => ({ ...eq.data(), id: eq.id, id2: index + 1 })));
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
            getFamila();
            getTipo();
            getMarca();
            getModelo();
            console.log('Se ejecuto useEffect de getFamilia, getMarca...');
        }, [])

        useEffect(() => {
            getEquipo();
            console.log('Se ejecuto useEffect de getEquipo...');
        }, [])

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
            // console.log(nomFamilia);
            e.preventDefault();
            cambiarEstadoAlerta(false);
            cambiarAlerta({});

            if (nomFamilia.length === 0 || nomFamilia === 'Selecciona Opción:') {
                console.log(nomFamilia);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Favor Seleccionar Familia'
                })
            } else if (nomTipo.length === 0 || nomTipo === 'Selecciona Opción:') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Favor Seleccionar Tipo Equipamiento'
                })
            } else if (nomMarca.length === 0 || nomMarca === 'Selecciona Opción:') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Favor Seleccionar Marca'
                })
            } else if (nomModelo.length === 0 || nomModelo === 'Selecciona Opción:') {
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

            } else if (rfid === '') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Favor Ingresar RFID'
                })

            } else {
                try {
                    CrearEquipoDb({
                        familia: nomFamilia,
                        tipo: nomTipo,
                        marca: nomMarca,
                        modelo: nomModelo,
                        serie: serie,
                        rfid: rfid,
                        userAdd: userAdd,
                        userMod: userMod,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod
                    })
                    setSerie('');
                    setRfid('');
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Equipo creado correctamente'
                    })
                } catch (error) {
                    console.log(error);
                }
            }
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
                                <Select value={nomFamilia} onChange={e => setNomFamilia(e.target.value)}>
                                    console.log(nomFamilia);
                                    <option>Selecciona Opción:</option>
                                    {familia.map((d) => {
                                        return (<option key={d.id}>{d.familia}</option>)
                                    })}
                                </Select>
                            </ContentElemenSelect>

                            <ContentElemenSelect>
                                <Label>Tipo Equipamiento</Label>
                                <Select value={nomTipo} onChange={e => setNomTipo(e.target.value)}>
                                    <option>Selecciona Opción:</option>
                                    {tipo.map((d) => {
                                        return (<option key={d.id}>{d.tipo}</option>)
                                    })}
                                </Select>
                            </ContentElemenSelect>

                            <ContentElemenSelect>
                                <Label>Marca</Label>
                                <Select value={nomMarca} onChange={e => setNomMarca(e.target.value)}>
                                    <option>Selecciona Opción:</option>
                                    {marca.map((d) => {
                                        return (<option key={d.id}>{d.marca}</option>)
                                    })}
                                </Select>
                            </ContentElemenSelect>

                            <ContentElemenSelect>
                                <Label>Modelo</Label>
                                <Select value={nomModelo} onChange={e => setNomModelo(e.target.value)}>
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
                                name='serie' h
                                value={serie}
                                onChange={handleChange}
                            />
                            <Label >RFID</Label>
                            <Input
                                type='text'
                                placeholder='Ingrese RFID'
                                name='rfid'
                                value={rfid}
                                onChange={handleChange}
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
                        <Label>Seleccione Categoria</Label>
                        <Select required value={categoria} onChange={e => setCategoria(e.target.value)} >
                            {/* <option>Selecciona Opción:</option> */}
                            <option>Familia</option>
                            <option>Tipo</option>
                            <option>Marca</option>
                            <option>Modelo</option>
                            {console.log(categoria)}
                        </Select>
                    </ContentElemenSelect>

                    <ContentElemen>
                        <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} />
                        <Input style={{ width: '100%' }}
                            type='text'
                            placeholder={`Buscar ${categoria}`}
                            value={buscador}
                            onChange={onBuscarCambios}
                        />
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
                                <Table.HeaderCell>Acción</Table.HeaderCell>
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
                                            <Table.Cell>
                                                <Boton>
                                                    <FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                                                </Boton>
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
            </ContenedorFormulario>
        );
    };


    const ContenedorFormulario = styled.div`
`

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
    color: green;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
    &:hover{
            background-color: #83d310;
        }
`

    export default Proveedores;