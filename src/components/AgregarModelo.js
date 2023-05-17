import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgregarModeloDb from '../firebase/AgregarModeloDb';
import Alertas from './Alertas';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import EditarModelo from './EditarModelo';


const AgregarModelo = () => {
    // const navigate = useNavigate();
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [modelo, setModelo] = useState('');
    const [leer, setLeer] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [preguntar, setPreguntar] = useState('')

    const handleChange = (e) => {
        setModelo(e.target.value);
        // console.log('desde handle',modelo.toLocaleUpperCase());
    }

    useEffect(() => {
        const buscar = () => {
            // console.log('se ejecuta effect')
            // console.log('modelo',modelo);
            const modeloRef = (collection(db, 'modelos'));
            const x = query(modeloRef, where('modelo', '==', modelo.toLocaleUpperCase().trim()));
            // const datos = await getDocs(x);
            onSnapshot(x, (snap) => {
                // console.log('snap:', snap.docs.length)
                if (snap.docs.length > 0) {
                    // console.log(snap.docs);
                    // console.log('existe')
                    setPreguntar(true)
                    // console.log('se ejecuta setpreguntar');
                } else {
                    // console.log('no existe')
                    setPreguntar(false)
                }
            })
        }
        buscar();
    }, [preguntar, setPreguntar, modelo])



    const handleSubmit = async (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // console.log('valor de preguntar en hs', preguntar);
        if (preguntar) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe este Modelo'
            })
            
        } else if (modelo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado un Modelo'
            })

        } else {
            const mod = modelo.toLocaleUpperCase().trim();
            AgregarModeloDb({
                modelo: mod,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Modelo Ingresada Correctamente'
                    })
                    setModelo('');
                })
        }
    }


    const getData = async () => {
        const data = await getDocs(collection(db, "modelos"));
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    const filtroModelo = () => {

        if (buscador.length === 0)
            return leer.slice(pagina, pagina + 5);
        const nuevoFiltro = leer.filter(mod => mod.modelo.includes(buscador));
        return nuevoFiltro.slice(pagina, pagina + 5);
    }

    const siguientePag = () => {
        if (leer.filter(mod => mod.modelo.includes(buscador)).length > pagina + 5)
            setPagina(pagina + 5);
    }

    const paginaAnterior = () => {
        if (pagina > 0) setPagina(pagina - 5)
    }

    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setPagina(0);
        setBuscardor(target.value)
    }

    useEffect(() => {
        getData();
    }, [setModelo, modelo])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Modelos de Equipos</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <Input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Modelo Equipamiento Médico'
                        name='modelo'
                        value={modelo}
                        onChange={handleChange}
                    />
                    <Boton>
                        <BiAddToQueue style={{ fontSize: '32px', color: 'green' }} />
                    </Boton>
                </Formulario>
            </ContenedorFormulario>

            <ListarProveedor>
                <ContentElemen>
                    <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: 'green' }} /></Boton>
                    <Titulo>Listado de Modelos</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Modelo'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioAdd</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioMod</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filtroModelo().map((item) => {
                            return (
                                <EditarModelo
                                    key={item.id}
                                    id={item.id}
                                    id2={item.id2}
                                    modelo={item.modelo}
                                    userAdd={item.userAdd}
                                    userMod={item.userMod}
                                    setModelo={setModelo}
                                />
                            )
                        })}
                    </Table.Body>
                </Table>

            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
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

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const Formulario = styled.form`
    display: flex;
    padding: 0px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px 30px;
`

const Boton = styled.button`
        background-color: #ffffff;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin: 0 10px;
        cursor: pointer;
`

export default AgregarModelo;