import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import AgregarFamiliaDb from '../firebase/AgregarFamiliaDb';
import Alertas from './Alertas';
// import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';


const AgregarFamilia = () => {

    // const navigate = useNavigate();
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familia, setFamilia] = useState('');
    const [leer, setLeer] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');

    const handleChange = (e) => {
        setFamilia(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (familia === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Familia'
            })

        } else {
            const fam = familia.toLocaleUpperCase()
            console.log(fam);
            AgregarFamiliaDb({
                familia: fam,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Familia Ingresada Correctamente'
                    })
                    setFamilia('');
                })
        }
    }

    // const volver = () => {
    //     navigate('/home/actualiza')
    // }

    const getData = async () => {
        const data = await getDocs(collection(db, "familias"));
        const leido = data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index }));
        setLeer(leido.filter(fam => fam.familia !=='Selecciona Opción'));
    }

    const filtroFamilia = () => {

        if (buscador.length === 0)
            return leer.slice(pagina, pagina + 5);
        const nuevoFiltro = leer.filter(fam => fam.familia.includes(buscador));
        return nuevoFiltro.slice(pagina, pagina + 5);
    }

    const siguientePag = () => {
        if (leer.filter(fam => fam.familia.includes(buscador)).length > pagina + 5)
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
        
    }, [setFamilia, familia])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Familia de Equipos</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <Input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Familia Equipamiento Médico'
                        name='familia'
                        value={familia}
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
                    <Titulo>Listado de Familias</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Familia'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioAdd</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioMod</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filtroFamilia().map((item) => {
                            return (

                                <Table.Row key={item.id2}>
                                    <Table.Cell>{item.id2}</Table.Cell>
                                    {
                                    <Table.Cell>{item.familia}</Table.Cell>
                                    }
                                    <Table.Cell>{item.userAdd}</Table.Cell>
                                    <Table.Cell>{item.userMod}</Table.Cell>
                                    <Table.Cell>
                                    
                                        <Boton>
                                            <FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                                        </Boton>
                                    </Table.Cell>
                                </Table.Row>
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

export default AgregarFamilia;