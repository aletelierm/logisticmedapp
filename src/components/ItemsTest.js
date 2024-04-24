import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import ItemsTestDb from '../firebase/ItemsTestDb';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContentElemenMov, Select, Label, ContentElemenSelect, Formulario } from '../elementos/CrearEquipos';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, Boton } from '../elementos/General';

const ItemsTest = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [item, setItem] = useState('');
    // const [categoria, setCategoria] = useState('');
    const [leer, setLeer] = useState([]);
    // const [familia, setFamilia] = useState([]);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);

    const getData = async () => {
        const traerit = collection(db, 'itemstest');
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
    // //Leer los datos de Familia
    // const getFamilia = async () => {
    //     const traerFam = collection(db, 'familias');
    //     const dato = query(traerFam, where('emp_id', '==', users.emp_id));
    //     const data = await getDocs(dato)
    //     setFamilia(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // Consulta si exite campo en el arreglo
        const existe = leer.filter(it => it.nombre === item.toLocaleUpperCase().trim()).length === 0;

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
        // } else if (categoria.length === 0 || categoria === 'Selecciona Opción:') {
        //     cambiarEstadoAlerta(true);
        //     cambiarAlerta({
        //         tipo: 'error',
        //         mensaje: 'Seleccione una categoria'
        //     })
        //     return;
        } else {
            const it = item.toLocaleUpperCase().trim()
            ItemsTestDb({
                nombre: it,
                // categoria: categoria,
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
    // useEffect(() => {
    //     getFamilia();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <ContenedorProveedor style={{ width: '90%' }}>
            <Contenedor>
                <Titulo>Items Test de Ingreso</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action=''>
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
                        {/* <ContentElemenSelect>
                            <Label>Categoria</Label>
                            <Select
                                value={categoria}
                                onChange={ev => setCategoria(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {familia.map((d, index) => {
                                    return (<option key={index}>{d.familia}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect> */}
                        <Boton onClick={handleSubmit} >
                            <BiAddToQueue style={{ fontSize: '32px', color: '#328AC4', marginTop: '20px' }} />
                        </Boton>
                    </ContentElemenMov>
                </Formulario>
            </Contenedor>

            <ListarProveedor>
                <ContentElemenAdd>
                    <Titulo>Listado de Items</Titulo>
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
                            {/* <Table.HeaderCell>Categoria</Table.HeaderCell> */}
                            <Table.HeaderCell>Agregado por</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filtroItem().map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                                    {/* <Table.Cell>{item.categoria}</Table.Cell> */}
                                    <Table.Cell>{item.useradd}</Table.Cell>
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

export default ItemsTest;