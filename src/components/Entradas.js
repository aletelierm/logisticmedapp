import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EntradasDB from '../firebase/EntradasDB'
import Alertas from './Alertas';
import { Table } from 'semantic-ui-react'
/* import { useNavigate } from 'react-router-dom'; */
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import * as FaIcons from 'react-icons/fa';
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
    const [nomTipDoc, setNomTipDoc] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [proveedor, setProveedor] = useState([]);
    const [nomProveedor, setNomProveedor] = useState([]);
    const [nomTipoIn, setNomTipoIn] = useState([]);
    const [equipo, setEquipo] = useState([]);
    // const [nomEquipo, setNomEquipo] = useState([]);
    const [numSerie, setNumSerie] = useState([]);
    const [date, setDate] = useState([]);
    const [price, setPrice] = useState([]);
    const [flag, setFlag] = useState(false)

    //Lectura de datos filtrados por empresa
    const getProveedor = async () => {
        const traerProveedor = collection(db, 'proveedores');
        const dato = query(traerProveedor, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setProveedor(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    //Leer los datos de Equipos
    const getEquipo = async () => {
        const traerEq = collection(db, 'equipos');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEquipo(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
        console.log("EQUIPOS", equipo)
        console.log('nombre de equipo', equipo[0].tipo + ' ' + equipo[0].marca + ' ' + equipo[0].modelo)
    }

    const detectar = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            // Consulta si exite serie en el arreglo            
            const existe = equipo.filter(eq => eq.serie === numSerie);
            console.log('N° serie', existe)
            console.log('nombre equipo', existe[0].tipo + ' ' + existe[0].marca + ' ' + existe[0].modelo )

            // if (!existe) {
            //     cambiarEstadoAlerta(true);
            //     cambiarAlerta({
            //         tipo: 'error',
            //         mensaje: 'Serie ya existe'
            //     })
            //     return 
            // }
        }
    }


        const handleSubmit = (e) => {
            e.preventDefault();
            cambiarEstadoAlerta(false);
            cambiarAlerta({});

            if (nomTipDoc.length === 0 || nomTipDoc === 'Selecciona Opción:') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Seleccione Tipo Documento'
                })
                return;

            } else if (numDoc.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ingrese N° Documento'
                })
                return;

            } else if (nomProveedor.length === 0 || nomProveedor === 'Selecciona Opción:') {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Seleccione una Entidad'
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

            } else if (price.length === 0 ) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Seleccione un Tipo de Entrada'
                })
                return;

            } else {
                try {
                    EntradasDB({
                        emp_id: users.emp_id,
                        tipDoc: nomTipDoc,
                        numDoc: numDoc,
                        proveedor: nomProveedor,
                        date: date,
                        TipoIn: nomTipoIn,
                        // eq_id: equipo.id,
                        // nomEq: (equipo.tipo + " " + equipo.marca + " " + equipo.modelo)
                        // familia: equipo.familia,
                        // tipo: equipo.tipo,
                        // marca: equipo.marca,
                        // modelo: equipo.modelo,
                        // serie: equipo.serie,
                        // rfid: equipo.rfid,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod
                    })
                    setNomTipDoc('');
                    setNumDoc('');
                    setNomProveedor('');
                    setDate('');
                    setNomTipoIn('')
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

        useEffect(() => {
            getProveedor();
            getEquipo();
        }, [])

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
                                <Label >Entidad</Label>
                                <Select value={nomProveedor} onChange={ev => setNomProveedor(ev.target.value)}>
                                    <option>Selecciona Opción:</option>
                                    {proveedor.map((d) => {
                                        return (<option key={d.key}>{d.nombre}</option>)
                                    })}
                                </Select>
                            </ContentElemenSelect>
                        </ContentElemen>

                        <ContentElemen>
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
                            <Boton onClick={handleSubmit}>Guardar</Boton>
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
                                {/* <Select value={nomEquipo} onChange={e => setNomEquipo(e.target.value)}>
                                    <option>Selecciona Opción:</option>
                                    {equipo.map((d) => {
                                        // return (<option key={d.id}>{d.tipo + ' ' + d.marca + ' ' + d.modelo}</option>)
                                        return (<option key={d.id}>{d.serie}</option>)
                                    })}
                                </Select> */}
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
                                <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px', marginTop: '16px' }} />
                                <IoMdAdd style={{ fontSize: '36px', color: 'green', padding: '5px', marginRight: '15px', marginTop: '14px' }} />
                            </Icon>

                        </ContentElemen>
                    </Formulario>

                    <ListarEquipos>
                        <Table singleLine>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>N°</Table.HeaderCell>
                                    <Table.HeaderCell>Familia</Table.HeaderCell>
                                    <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                                    <Table.HeaderCell>Marca</Table.HeaderCell>
                                    <Table.HeaderCell>Modelo</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>1</Table.Cell>
                                    <Table.Cell>DISPOSITIVOS DE INFUSION</Table.Cell>
                                    <Table.Cell>BOMBA ENTERAL</Table.Cell>
                                    <Table.Cell>ABBOTT</Table.Cell>
                                    <Table.Cell>FREEGO</Table.Cell>
                                </Table.Row>

                                <Table.Row>
                                    <Table.Cell>2</Table.Cell>
                                    <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                    <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                    <Table.Cell>SUSED</Table.Cell>
                                    <Table.Cell>TRX-800</Table.Cell>
                                </Table.Row>
                            </Table.Body>

                        </Table>
                    </ListarEquipos>

                    <Boton>Guardar</Boton>
                </ContenedorFormulario>


                <ListarProveedor>
                    <h2>Cabecera de Documentos</h2>
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