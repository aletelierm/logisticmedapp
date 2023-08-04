import React, { useEffect, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import AgregarEmpresaDb from '../firebase/AgregarEmpresaDb';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Alerta from './Alertas';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { BiAddToQueue } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import validarRut from '../funciones/validarRut';

const AgregarEmpresa = () => {
    /* const navigate = useNavigate(); */
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [empresa, setEmpresa] = useState('');
    const [rut, setRut] = useState('');
    const [leer, setLeer] = useState([])
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);

    const handleChange = (e) => {
        switch(e.target.name){
            case 'rut':
                setRut(e.target.value)
                break;
                case 'empresa':
                setEmpresa(e.target.value);
                break;
                default:
                break;
            }
        }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Consulta si exite campo en el arreglo
        const existe = leer.filter(emp => emp.empresa === empresa.toLocaleUpperCase().trim()).length === 0;
        //Patron para valiar rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;       
       /*  console.log(validarRut(rut)); */
        const temp = rut.split('-');
        let digito = temp[1];
        if(digito ==='k' || digito ==='K') digito = -1;
        const validaR = validarRut(rut);

        // Realiza comprobacion
        if(rut ===''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Rut no puede estar vacio'
            })
            return;
        }else if(!expresionRegularRut.test(rut)){          
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Formato incorrecto de rut'
            })
            return;
        }else if(validaR !== parseInt(digito)){ 
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut no válido'
            })
            return;
        }else if (!existe) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe esta Empresa'
            })
        } else if (empresa === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Empresa.'
            })
        } else {
            const emp = empresa.toLocaleUpperCase().trim()
            AgregarEmpresaDb({
                rut: rut,
                empresa: emp,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Empresa Registrada Correctamente'
                    })
                    setEmpresa('');
                    setFlag(!flag)
                })
        }
    }

    const getData = async () => {
        const data = await getDocs(collection(db, "empresas"));
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    const filtroEmpresa = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return leer.slice(pagina, pagina + 5);
        const nuevoFiltro = leer.filter(emp => emp.empresa.includes(buscar));
        return nuevoFiltro.slice(pagina, pagina + 5);
    }

    const siguientePag = () => {
        if (leer.filter(emp => emp.empresa.includes(buscador)).length > pagina + 5)
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
                <Titulo>Registrar Empresas</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario onSubmit={handleSubmit}>
                    <Input
                            style={{ width: '80%' }}
                            maxLength='10'
                            type='text'
                            name = 'rut'
                            placeholder = 'Ingrese Rut sin puntos'
                            value = { rut }
                            onChange = { handleChange }
                            /* onKeyDown={detectar} */
                        />
                    <Input
                        style={{ width: '80%' }}
                        type='text'
                        placeholder='Ingrese Empresa'
                        name='empresa'
                        value={empresa}
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
                    <Titulo>Listado de Empresas</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Empresa'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Empresa</Table.HeaderCell>
                            <Table.HeaderCell>Agregado por</Table.HeaderCell>
                            <Table.HeaderCell>Modificado por</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filtroEmpresa().map((item,index) => {
                            return (
                                < Table.Row key={index}>
                                    <Table.Cell>{item.id2}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.empresa}</Table.Cell>
                                    <Table.Cell>{item.userAdd}</Table.Cell>
                                    <Table.Cell>{item.userMod}</Table.Cell>
                                    <Table.Cell><Link to={`/configuracion/actualizaempresa/${item.id}`}><FaRegEdit style={{ fontSize: '20px', color: 'green' }} /></Link></Table.Cell>
                                </Table.Row>
                                    )
                        })}
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

const Titulo = styled.h2`
    color:  #83d394;
`
const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
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
    border: 2px solid  green;
    border-radius: 10px;
    padding: 5px;
    margin-left: 5%;
`
const Boton = styled.button`    
    background-color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
`
export default AgregarEmpresa;