import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EntradasDB from '../firebase/EntradasDB'
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoIn } from './TipDoc'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const Entradas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [numDoc, setNumDoc] = useState('');
    const [proveedor, setProveedor] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState([]);
    const [nomTipoIn, setNomTipoIn] = useState('');
    const [equipo, setEquipo] = useState([]);
    const [idEquipo, setIDEquipo] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [rfid, setRfid] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [flag, setFlag] = useState(false);
    const [dataEntrada, setDataEntrada] = useState([]);
    const [nomEntidad, setNomEntidad] = useState('')


    //Lectura de datos filtrados por empresa
    const getProveedor = async () => {
        const traerProveedor = collection(db, 'proveedores');
        const dato = query(traerProveedor, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setProveedor(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Lectura de datos filtrados por empresa
    const getCliente = async () => {
        const traerCliente = collection(db, 'clientes');
        const dato = query(traerCliente, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCliente(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Leer los datos de Equipos
    const getEquipo = async () => {
        const traerEq = collection(db, 'equipos');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEquipo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    const getEntrada = async () => {
        const traerEntrada = collection(db, 'entradas');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setDataEntrada(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    const documento = dataEntrada.filter(de => de.numdoc === numDoc)

    // Validar rut
    const detectarCli = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoIn === 'DEVOLUCION CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
                console.log('cliente', existeCli)
                console.log('tipo entrada', nomTipoIn)
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                }
            } else {
                const existeProv = proveedor.filter(prov => prov.rut === rut);
                console.log('proveedor', existeProv)
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                }
            }
        }
    }

    // Validar N°serie
    const detectar = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (e.key === 'Enter' || e.key === 'Tab') {
            // Consulta si exite serie en el arreglo            
            const existe = equipo.filter(eq => eq.serie === numSerie);
            console.log('existe serie', existe)
            if (existe.length === 0) {
                console.log('No exite en equipo')
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe un Equipo con este N° Serie'
                })
            } else {
                setFamilia(existe[0].familia)
                setTipo(existe[0].tipo)
                setMarca(existe[0].marca)
                setModelo(existe[0].modelo)
                setIDEquipo(existe[0].id)
                setNumSerie(existe[0].serie)
                setRfid(existe[0].rfid)
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Validar Rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);

        // Validar N° Serie en equipo
        const existe = equipo.filter(eq => eq.serie === numSerie);
        console.log('existe', existe)

        // Validar en N° Serie en Entradas
        const existeIn = documento.filter(doc => doc.serie === numSerie)

        if (nomTipDoc.length === 0 || nomTipDoc === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione Tipo Documento'
            })
            return;

        } else if (numDoc === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese N° Documento'
            })
            return;

        } else if (date === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Fecha'
            })
            return;

        } else if (nomTipoIn.length === 0 || nomTipoIn === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de Entrada'
            })
            return;

            // Validacion Rut
        } else if (rut === '') {
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

        } else if (price === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese Precio de Equipo'
            })
            return;

        } else if (numSerie === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese o Scaneé N° Serie'
            })
            return;

        } else if (existe.length === 0) {
            console.log('No exite en equipo')
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe un Equipo con este N° Serie'
            })

        } else if (existeIn.length > 0) {
            console.log('Ya existe este equipo')
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra en este documento'
            })

        } else {

            if (nomTipoIn === 'DEVOLUCION CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
                console.log('cliente', existeCli)
                console.log('tipo entrada', nomTipoIn)
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);

                    try {
                        EntradasDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: date,
                            tipoIn: nomTipoIn,
                            rut: rut,
                            entidad: entidad,
                            eq_id: existe[0].id,
                            familia: existe[0].familia,
                            tipo: existe[0].tipo,
                            marca: existe[0].marca,
                            modelo: existe[0].modelo,
                            serie: existe[0].serie,
                            rfid: existe[0].rfid,
                            price: price,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod
                        })
                        setPrice('')
                        setNumSerie('')
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Ingreso realizado exitosamente'
                        })
                        setFlag(!flag);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            } else {
                const existeProv = proveedor.filter(prov => prov.rut === rut);
                console.log('proveedor', existeProv)
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);

                    try {
                        EntradasDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: date,
                            tipoIn: nomTipoIn,
                            rut: rut,
                            entidad: entidad,
                            eq_id: existe[0].id,
                            familia: existe[0].familia,
                            tipo: existe[0].tipo,
                            marca: existe[0].marca,
                            modelo: existe[0].modelo,
                            serie: existe[0].serie,
                            rfid: existe[0].rfid,
                            price: price,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod
                        })
                        setPrice('')
                        setNumSerie('')
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Ingreso realizado exitosamente'
                        })
                        setFlag(!flag);
                        return;
                    } catch (error) {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: error
                        })
                    }
                }
            }
        }
    }

    useEffect(() => {
        getProveedor();
        getCliente();
        getEquipo();
    }, [])

    useEffect(() => {
        getEntrada();
    }, [flag, setFlag])


    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h1>Recepcion de Equipos</h1>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Tipo de Documento</Label>
                            <Select value={nomTipDoc} onChange={ev => setNomTipDoc(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipDoc.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>N° de Documento</Label>
                            <Input
                                type='text'
                                name='NumDoc'
                                placeholder='Ingrese N° Documento'
                                value={numDoc}
                                onChange={e => setNumDoc(e.target.value)}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Fecha Ingreso</Label>
                            <Input
                                type='date'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            />
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Tipo Entrada</Label>
                            <Select value={nomTipoIn} onChange={e => setNomTipoIn(e.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipoIn.map((d) => {
                                    return (<option key={d.id}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label >Rut</Label>
                            <Input
                                type='numero'
                                placeholder='Ingrese Rut'
                                name='rut'
                                value={rut}
                                onChange={e => setRut(e.target.value)}
                                onKeyDown={detectarCli}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Nombre</Label>
                            <Input
                                value={entidad}
                                disabled
                            />
                        </ContentElemenSelect>

                    </ContentElemen>
                </Formulario>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario>
                    <ContentElemen >

                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Precio</Label>
                            <Input
                                type='number'
                                name='precio'
                                placeholder='Ingrese Valor'
                                value={price}
                                onChange={e => setPrice(e.target.value)}

                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input
                                type='text'
                                name='serie'
                                placeholder='Ingrese N° Serie'
                                value={numSerie}
                                onChange={e => setNumSerie(e.target.value)}
                                onKeyDown={detectar}
                            />
                        </ContentElemenSelect>

                        <Icon>
                            <IoMdAdd style={{ fontSize: '36px', color: 'green', padding: '5px', marginRight: '15px', marginTop: '14px' }}
                                onClick={handleSubmit}
                            />
                        </Icon>

                    </ContentElemen>
                </Formulario>

                <ListarEquipos>
                    <Table singleLine>

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                {/* <Table.HeaderCell>Familia</Table.HeaderCell> */}
                                <Table.HeaderCell>Nombre de equipo</Table.HeaderCell>
                                {/* <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                                <Table.HeaderCell>Marca</Table.HeaderCell>
                                <Table.HeaderCell>Modelo</Table.HeaderCell> */}
                                <Table.HeaderCell>serie</Table.HeaderCell>
                                <Table.HeaderCell>precio</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {documento.map((item, index) => {
                                return (
                                    <Table.Row key={item.id2}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        {/* <Table.Cell>{item.familia}</Table.Cell> */}
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        {/* <Table.Cell>{item.tipo}</Table.Cell> */}
                                        {/* <Table.Cell>{item.marca}</Table.Cell> */}
                                        {/* <Table.Cell>{item.modelo}</Table.Cell> */}
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell>${item.price}.-</Table.Cell>
                                    </Table.Row>
                                )
                            })}


                            {/* <Table.Row>
                                <Table.Cell>2</Table.Cell>
                                <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                <Table.Cell>SUSED</Table.Cell>
                                <Table.Cell>TRX-800</Table.Cell>
                            </Table.Row> */}
                        </Table.Body>

                    </Table>
                </ListarEquipos>

                <Boton>Guardar</Boton>
            </ContenedorFormulario>


            <ListarProveedor>
                <h2>Listado de Documentos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Entrada</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>127</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>416509</Table.Cell>
                            <Table.Cell>9.345.654-6 </Table.Cell>
                            <Table.Cell>ARQUIMED </Table.Cell>
                            <Table.Cell>07-06-2023</Table.Cell>
                            <Table.Cell>COMPRA</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>486</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>218745</Table.Cell>
                            <Table.Cell>6.140.830-4 </Table.Cell>
                            <Table.Cell>OXIMED</Table.Cell>
                            <Table.Cell>07-06-2023</Table.Cell>
                            <Table.Cell>COMPRA</Table.Cell>
                        </Table.Row>

                    </Table.Body>
                </Table>
            </ListarProveedor>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />

            {console.log(user.uid)}
        </ContenedorProveedor>
    );
};


const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const ContentElemen = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 5px 10px;
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

const Icon = styled.div`
    display: flex;
    // justify-content: space-between;
    margin-left: 20px;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const ListarEquipos = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.40);;
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
    background-color: #83d394;
    padding: 10px;
    border-radius: 5px;
    border: none;
`

export default Entradas;