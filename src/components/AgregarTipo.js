import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgregarTipoDb from '../firebase/AgregarTipoDb';
import Alertas from './Alertas';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import EditarTipo from './EditarTipo';


const AgregarTipo = () => {
    // const navigate = useNavigate();
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [tipo, setTipo] = useState('');
    const [leer, setLeer] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);
    

    const handleChange = (e) => {
        setTipo(e.target.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Consulta si exite campo en el arreglo
        const existe = leer.filter(tip => tip.tipo.includes(tipo.toLocaleUpperCase().trim())).length > 0;
        console.log(existe);

        // Realiza consulta al arreglo leer para ver si existe el nombre del campo
        if (existe) {

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe este Tipo de Equipamiento'
            })

        } else if (tipo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Tipo Equipamiento'
            })

        } else {
            const tip = tipo.toLocaleUpperCase().trim();
            AgregarTipoDb({
                tipo: tip,
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
                    setTipo('');
                    setFlag(!flag)
                })
        }
    }


    const getData = async () => {
        const data = await getDocs(collection(db, "tipos"));
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    const filtroTipo = () => {

        if (buscador.length === 0)
            return leer.slice(pagina, pagina + 5);
        const nuevoFiltro = leer.filter(tip => tip.tipo.includes(buscador));
        return nuevoFiltro.slice(pagina, pagina + 5);
    }

    const siguientePag = () => {
        if (leer.filter(tip => tip.tipo.includes(buscador)).length > pagina + 5)
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
    }, [setFlag, flag])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Tipos de Equipos</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <Input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Tipo Equipamiento Médico'
                        name='tipo'
                        value={tipo}
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
                    <Titulo>Listado de Tipos de Equipamientos</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Tipo Equipamiento Médico'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioAdd</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioMod</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filtroTipo().map((item) => {
                            return (
                                <EditarTipo
                                    key={item.id}
                                    id={item.id}
                                    id2={item.id2}
                                    tipo={item.tipo}
                                    userAdd={item.userAdd}
                                    userMod={item.userMod}
                                    setTipo={setTipo}
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
    color: green;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
`

export default AgregarTipo;