import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import ItemsSTDb from '../firebase/ItemsSTDb';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import { ItemST } from './TipDoc';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as FaIcons from 'react-icons/fa';
import { TbNotes, TbNotesOff } from "react-icons/tb";
// import moment from 'moment';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContentElemenMov, ContentElemenSelect, Formulario, Label, Select } from '../elementos/CrearEquipos';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, Boton } from '../elementos/General';

const ItemsTest = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [item, setItem] = useState('');
    const [categoria, setCategoria] = useState('');
    const [price, setPrice] = useState('');
    const [leer, setLeer] = useState([]);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mostrar, setMostrar] = useState(true);
    const [isOpenRS, setIsOpenRS] = useState(false);
    const [mostrarRS, setMostrarRS] = useState(true);
    const [botonDisabled, setBotonDisabled] = useState(false);

    const getData = async () => {
        const traerit = collection(db, 'itemsst');
        const dato = query(traerit, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setLeer(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
    // // Cambiar fecha
    // const formatearFecha = (fecha) => {
    //     const dateObj = fecha.toDate();
    //     const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
    //     return formatear;
    // }
    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (!botonDisabled) {
            setBotonDisabled(true)
            // Consulta si exite campo en el arreglo
            const existe = leer.filter(it => it.nombre === item.toLocaleUpperCase().trim()).length === 0;

            if (categoria.length === 0 || categoria === 'Selecciona Opción:') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No ha seleccionado una categoria'
                })
            } else if (item === '') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No ha ingresado un Item'
                })
            } else if (!existe) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este Item'
                })
            } else {
                const it = item.toLocaleUpperCase().trim()
                if (categoria === 'REPUESTO' || categoria === 'SERVICIO') {
                    if (price === '') {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Ingrese un precio de repuesto o servicio'
                        })
                        return;
                    } else {
                        ItemsSTDb({
                            nombre: it,
                            categoria: categoria,
                            price: price,
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
                                setCategoria('');
                                setPrice('');
                                setFlag(!flag)
                            })
                    }
                } else {
                    ItemsSTDb({
                        nombre: it,
                        categoria: categoria,
                        price: 0,
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
                            setCategoria('');
                            setPrice('');
                            setFlag(!flag)
                        })
                }
            }
        }
        setTimeout(() => {
            setBotonDisabled(false);
        }, 500);
    }

    const filtroItem = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return leer.slice( /* pagina, pagina + 5 */);
        const nuevoFiltro = leer.filter(it => it.nombre.includes(buscar));
        return nuevoFiltro.slice( /* pagina, pagina + 5 */);
    }
    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        // setPagina(0);
        setBuscardor(target.value)
    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor style={{ width: '90%' }}>
            <Contenedor>
                <Titulo>Items Test de Ingreso</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Categoria</Label>
                            <Select style={{ width: '300px' }} value={categoria} onChange={e => { setCategoria(e.target.value) }}>
                                <option>Selecciona Opción:</option>
                                {ItemST.map((d,index) => {
                                    return (<option key={index}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                    </ContentElemenMov>
                    <ContentElemenMov style={{ width: '100%' }}>
                        <ContentElemenSelect style={{ width: '100%', paddingTop: '40px' }}>
                            <InputAdd
                                type='text'
                                placeholder='Ingrese Item'
                                name='item'
                                value={item}
                                onChange={e => setItem(e.target.value)}
                            />
                        </ContentElemenSelect>
                        {categoria === 'REPUESTO' || categoria === 'SERVICIO' ?
                            <ContentElemenSelect >
                                <Label>Precio</Label>
                                <InputAdd
                                    type='number'
                                    name='price'
                                    value={price}
                                    onChange={e => {
                                        if (/^[1-9]\d*$/.test(e.target.value)) {
                                            setPrice(Number(e.target.value))
                                        } else {
                                            cambiarEstadoAlerta(true);
                                            cambiarAlerta({
                                                tipo: 'error',
                                                mensaje: 'Por favor ingrese un numero positivo'
                                            })
                                            setPrice('')
                                        }
                                    }}
                                />
                            </ContentElemenSelect>
                            :
                            ''
                        }
                        <Boton onClick={handleSubmit} >
                            <BiAddToQueue style={{ fontSize: '32px', color: '#328AC4', marginTop: '20px' }} />
                        </Boton>
                    </ContentElemenMov>
                </Formulario>
            </Contenedor>
            {/* Listado Items Test de Ingreso */}
            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Items Test de Ingreso</Titulo>
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    {mostrar ?
                        <Boton onClick={() => {
                            setIsOpen(true)
                            setFlag(!flag)
                            setMostrar(false)
                        }}
                            style={{ fontSize: '28px', color: '#328AC4', marginTop: '5px' }}
                            title='Mostrar Listado de Items'
                        >
                            <TbNotes />
                        </Boton>
                        :
                        <Boton onClick={() => {
                            setIsOpen(false)
                            setMostrar(true)
                        }}
                            style={{ fontSize: '28px', color: '#328AC4' }}
                            title='No mostrar Listado de Items'
                        >
                            <TbNotesOff />
                        </Boton>
                    }
                </ContentElemenAdd>
                {isOpen &&
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Categoria</Table.HeaderCell>
                                {/* <Table.HeaderCell>Precio</Table.HeaderCell> */}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filtroItem().map((item, index) => (
                                item.categoria === 'TEST INGRESO' && (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                                        <Table.Cell>{item.categoria}</Table.Cell>
                                        {/* <Table.Cell>${item.price.toLocaleString()}.-</Table.Cell> */}
                                    </Table.Row>
                                )
                            )
                            )}
                        </Table.Body>
                    </Table>
                }
            </ListarProveedor>
            {/* Listado Items Repuestos y Servicios */}
            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Items Repuestos y Servicios</Titulo>
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                    {mostrarRS ?
                        <Boton onClick={() => {
                            setIsOpenRS(true)
                            setFlag(!flag)
                            setMostrarRS(false)
                        }}
                            style={{ fontSize: '28px', color: '#328AC4', marginTop: '5px' }}
                            title='Mostrar Listado de Items'
                        >
                            <TbNotes />
                        </Boton>
                        :
                        <Boton onClick={() => {
                            setIsOpenRS(false)
                            setMostrarRS(true)
                        }}
                            style={{ fontSize: '28px', color: '#328AC4' }}
                            title='No mostrar Listado de Items'
                        >
                            <TbNotesOff />
                        </Boton>
                    }
                </ContentElemenAdd>
                {isOpenRS &&
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Item</Table.HeaderCell>
                                <Table.HeaderCell>Categoria</Table.HeaderCell>
                                <Table.HeaderCell>Precio</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {filtroItem().map((item, index) => (
                                item.categoria !== 'TEST INGRESO' && (
                                    <Table.Row key={index}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                                        <Table.Cell>{item.categoria}</Table.Cell>
                                        <Table.Cell>${item.price.toLocaleString()}.-</Table.Cell>
                                    </Table.Row>
                                )
                            )
                            )}
                        </Table.Body>
                    </Table>
                }

            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

export default ItemsTest;