import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import AgregarItemsDb from '../firebase/AgregarItemsDb';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
// import { FaRegEdit } from "react-icons/fa";
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
// import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, FormularioAdd, ListarProveedor, Titulo, InputAdd, Boton } from '../elementos/General';

const AgregarItems = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [item, setItem] = useState('');
    const [leer, setLeer] = useState([]);
    // const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Consulta si exite campo en el arreglo
        const existe = leer.filter(it => it.nombre === item.toLocaleUpperCase().trim()).length === 0;
        // Realiza consulta al arreglo leer para ver si existe el nombre del campo
        if (!existe) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe este Item'
            })
        } else if (item === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado un Item'
            })
        } else {
            const it = item.toLocaleUpperCase().trim()
            AgregarItemsDb({
                nombre: it,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod,
                emp_id: users.emp_id
            })
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Item Ingresada Correctamente'
                    })
                    setItem('');
                    setFlag(!flag)
                })
        }
    }

    const getData = async () => {
        const traerit = collection(db, 'items');
        const dato = query(traerit, where('emp_id', '==', users.emp_id));
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

    const filtroItem = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return leer.slice( /* pagina, pagina + 5 */);
        const nuevoFiltro = leer.filter(it => it.nombre.includes(buscar));
        return nuevoFiltro.slice( /* pagina, pagina + 5 */);
    }
    // const siguientePag = () => {
    //     if (leer.filter(it => it.nombre.includes(buscador)).length > pagina + 5)
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

    return (
        <ContenedorProveedor style={{width: '90%'}}>
            <Contenedor>
                <Titulo>Items</Titulo>
            </Contenedor>

            <Contenedor>
                <FormularioAdd action='' onSubmit={handleSubmit} >
                    <InputAdd
                        type='text'
                        placeholder='Ingrese Item'
                        name='item'
                        value={item}
                        onChange={e => setItem(e.target.value)}
                    />
                    <Boton>
                        <BiAddToQueue style={{ fontSize: '32px', color: '#328AC4' }} />
                    </Boton>
                </FormularioAdd>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    {/* <Boton onClick={paginaAnterior} ><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                    <Titulo>Listado de Items</Titulo>
                    {/* <Boton onClick={siguientePag} ><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemenAdd>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Agregado por</Table.HeaderCell>
                            {/* <Table.HeaderCell>Accion</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filtroItem().map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                                    <Table.Cell>{item.useradd}</Table.Cell>
                                    {/* <Table.Cell>{item.usermod}</Table.Cell> */}
                                    {/* <Table.Cell style={{textAlign: 'center'}}>
                                        <Link disabled to={`/actualizafamilia/${item.id}`}>
                                            <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                                        </Link>
                                    </Table.Cell> */}
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

export default AgregarItems;