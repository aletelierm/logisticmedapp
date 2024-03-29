import React, { useEffect, useState, ChangeEvent } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import AgregarEmpresaDb from '../firebase/AgregarEmpresaDb';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Alerta from './Alertas';
import * as FaIcons from 'react-icons/fa';
import { BiAddToQueue } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import validarRut from '../funciones/validarRut';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, FormularioAdd, Titulo, Boton } from '../elementos/General'
import { ContentElemenEmp, InputEmp } from '../elementos/Configuracion'

const AgregarEmpresa = () => {
    const user = auth.currentUser;
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [empresa, setEmpresa] = useState('');
    const [rut, setRut] = useState('');
    const [leer, setLeer] = useState([])
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);

    const handleChange = (e) => {
        switch (e.target.name) {
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
        const existe2 = leer.filter(emp => emp.rut === rut).length === 0;
        //Patron para valiar rut
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
        } else if (!existe2) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe una Empresa registrada con ese Rut'
            })
        } else if (empresa === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Empresa.'
            })
        } else if (!existe) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe esta Empresa'
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

    leer.sort((a, b) => {
        const nameA = a.empresa;
        const nameB = b.empresa;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    const filtroEmpresa = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return leer.slice( /* pagina, pagina + 5 */);
        const nuevoFiltro = leer.filter(emp => emp.empresa.includes(buscar));
        return nuevoFiltro.slice(/* pagina, pagina + 5 */);
    }
    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        // setPagina(0);
        setBuscardor(target.value)
    }

    useEffect(() => {
        getData();
    }, [setFlag, flag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Registrar Empresas</Titulo>
            </Contenedor>

            <Contenedor>
                <FormularioAdd onSubmit={handleSubmit}>
                    <InputEmp
                        style={{ width: '80%' }}
                        maxLength='10'
                        type='text'
                        name='rut'
                        placeholder='Ingrese Rut sin puntos'
                        value={rut}
                        onChange={handleChange}
                    /* onKeyDown={detectar} */
                    />
                    <InputEmp
                        style={{ width: '80%' }}
                        type='text'
                        placeholder='Ingrese Empresa'
                        name='empresa'
                        value={empresa}
                        onChange={handleChange}
                    />
                    <Boton>
                        <BiAddToQueue style={{ fontSize: '32px', color: '#328AC4' }} />
                    </Boton>
                </FormularioAdd>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Empresas</Titulo>
                </ContentElemenAdd>

                <ContentElemenEmp>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <InputEmp style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Empresa'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemenEmp>

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
                        {filtroEmpresa().map((item, index) => {
                            return (
                                < Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.empresa}</Table.Cell>
                                    <Table.Cell>{item.useradd}</Table.Cell>
                                    <Table.Cell>{item.usermod}</Table.Cell>
                                    <Table.Cell><Link to={`/configuracion/actualizaempresa/${item.id}`}><FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }} /></Link></Table.Cell>
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

export default AgregarEmpresa;