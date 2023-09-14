import React, { useState /*, useEffect */ } from 'react';
import Alertas from './Alertas';
// import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
// import { getDocs, collection, where, query } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ContentElemenAdd, FormularioAdd, ListarProveedor, Titulo, InputAdd, Boton } from '../elementos/General';

const AgregarItems = () => {
    // const user = auth.currentUser;
    // const { users } = useContext(UserContext);
    // let fechaAdd = new Date();
    // let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [item, setItem] = useState('');
    // const [leer, setLeer] = useState([]);
    // const [pagina, setPagina] = useState(0);
    // const [buscador, setBuscardor] = useState('');
    // const [flag, setFlag] = useState(false);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     cambiarEstadoAlerta(false);
    //     cambiarAlerta({});

    //     // Consulta si exite campo en el arreglo
    //     const existe = leer.filter(fam => fam.familia === familia.toLocaleUpperCase().trim()).length === 0;
    //     // Realiza consulta al arreglo leer para ver si existe el nombre del campo
    //     if (!existe) {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'Ya existe esta Familia'
    //         })
    //     } else if (familia === '') {
    //         cambiarEstadoAlerta(true);
    //         cambiarAlerta({
    //             tipo: 'error',
    //             mensaje: 'No ha ingresado una Familia'
    //         })
    //     } else {
    //         const fam = familia.toLocaleUpperCase().trim()
    //         AgregarFamiliaDb({
    //             familia: fam,
    //             userAdd: user.email,
    //             userMod: user.email,
    //             fechaAdd: fechaAdd,
    //             fechaMod: fechaMod,
    //             emp_id: users.emp_id
    //         })
    //             .then(() => {
    //                 cambiarEstadoAlerta(true);
    //                 cambiarAlerta({
    //                     tipo: 'exito',
    //                     mensaje: 'Familia Ingresada Correctamente'
    //                 })
    //                 setFamilia('');
    //                 setFlag(!flag)
    //             })
    //     }
    // }

    // const getData = async () => {
    //     const traerFam = collection(db, 'familias');
    //     const dato = query(traerFam, where('emp_id', '==', users.emp_id));
    //     const data = await getDocs(dato)
    //     setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    // }
    // const filtroFamilia = () => {
    //     const buscar = buscador.toLocaleUpperCase();
    //     if (buscar.length === 0)
    //         return leer.slice(pagina, pagina + 5);
    //     const nuevoFiltro = leer.filter(fam => fam.familia.includes(buscar));
    //     return nuevoFiltro.slice(pagina, pagina + 5);
    // }
    // const siguientePag = () => {
    //     if (leer.filter(fam => fam.familia.includes(buscador)).length > pagina + 5)
    //         setPagina(pagina + 5);
    // }
    // const paginaAnterior = () => {
    //     if (pagina > 0) setPagina(pagina - 5)
    // }
    // const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
    //     setPagina(0);
    //     setBuscardor(target.value)
    // }

    // useEffect(() => {
    //     getData();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Items</Titulo>
            </Contenedor>

            <Contenedor>
                <FormularioAdd action='' /* onSubmit={handleSubmit} */ >
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
                    <Boton /* onClick={paginaAnterior} */ ><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton>
                    <Titulo>Listado de Items</Titulo>
                    <Boton /* onClick={siguientePag} */ ><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton>
                </ContentElemenAdd>
                <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                        type='text'
                        placeholder='Buscar Item'
                    // value={buscador}
                    // onChange={onBuscarCambios}
                    />
                </ContentElemenAdd>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Agregado por</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {/* {filtroFamilia().map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{item.id2}</Table.Cell>
                                    <Table.Cell>{item.familia}</Table.Cell>
                                    <Table.Cell>{item.useradd}</Table.Cell>
                                    <Table.Cell>{item.usermod}</Table.Cell>
                                    <Table.Cell style={{textAlign: 'center'}}>
                                        <Link disabled to={`/actualizafamilia/${item.id}`}>
                                            <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })} */}

                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>Sanitización</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                {/* <Link disabled to={`/actualizafamilia/${item.id}`}> */}
                                    <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                                {/* </Link> */}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>Inspección visual carcasa, verificar golpes o quemaduras</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>3</Table.Cell>
                            <Table.Cell>Inspección visual de cable eléctrico, verificar roturas o conductores expuestos</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>4</Table.Cell>
                            <Table.Cell>Inspección visual conector de entrada de voltaje AC</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>5</Table.Cell>
                            <Table.Cell>Inspección visual switch ON/OFF verificar encendido y apagado</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>
                        
                        <Table.Row>
                            <Table.Cell>6</Table.Cell>
                            <Table.Cell>Inspección visual de manómetro verificar estado y funcionamiento</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>7</Table.Cell>
                            <Table.Cell>Verificar estado de mangueras y frasco</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>8</Table.Cell>
                            <Table.Cell>Desarme de equipo y revisión de motor</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>9</Table.Cell>
                            <Table.Cell>Lubricación de partes móviles</Table.Cell>
                            <Table.Cell>catalina.astudillo7@gmail.com</Table.Cell>
                            <Table.Cell style={{ textAlign: 'center' }}>
                                <FaRegEdit disabled style={{ fontSize: '20px', color: '#328AC4' }} />
                            </Table.Cell>
                        </Table.Row>

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