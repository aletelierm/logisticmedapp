import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SalidasDB from '../firebase/SalidasDB'
import CabeceraOutDB from '../firebase/CabeceraOutDB'
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { Table } from 'semantic-ui-react'
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoOut } from './TipDoc'
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';



const Salidas = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [proveedor, setProveedor] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [nomTipDoc, setNomTipDoc] = useState('');
    const [numDoc, setNumDoc] = useState('');
    const [date, setDate] = useState('');
    const [nomTipoOut, setNomTipoOut] = useState('');
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [correo, setCorreo] = useState('');
    const [patente, setPatente] = useState('');
    const [equipo, setEquipo] = useState([]);
    const [cabecera, setCabecera] = useState([]);
    const [numSerie, setNumSerie] = useState('');
    const [price, setPrice] = useState('');
    const [flag, setFlag] = useState(false);
    const [dataSalida, setDataSalida] = useState([]);
    const [confirmar, setConfirmar] = useState(false);
    // const [guardado, setGuardado] = useState(false);
    const [btnConfirmar, setBtnConfirmar] = useState(true);
    const [btnAgregar, setBtnAgregar] = useState(true);
    const [btnGuardar, setBtnGuardar] = useState(false);

    //Lectura de proveedores filtrados por empresa
    const getProveedor = async () => {
        const traerProveedor = collection(db, 'proveedores');
        const dato = query(traerProveedor, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setProveedor(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Lectura de clientes filtrados por empresa
    const getCliente = async () => {
        const traerCliente = collection(db, 'clientes');
        const dato = query(traerCliente, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCliente(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    //Lectura de equipos filtrado por empresas
    const getEquipo = async () => {
        const traerEq = collection(db, 'equipos');
        const dato = query(traerEq, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEquipo(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    // Lectura cabecera de documentos
    const getCabecera = async () => {
        const traerCabecera = collection(db, 'cabeceras');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    //Lectura mivimientos de Salida
    const getSalida = async () => {
        const traerSalida = collection(db, 'salidas');
        const dato = query(traerSalida, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setDataSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    //Almacena movimientos de entrada del documento
    const documento = dataSalida.filter(de => de.numdoc === numDoc && de.tipdoc === nomTipDoc && de.rut === rut && de.tipmov === 2 );

    // Validar rut
    const detectarCli = (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (e.key === 'Enter' || e.key === 'Tab') {
            if (nomTipoOut === 'CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
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
            const existeIn = documento.filter(doc => doc.serie === numSerie)
            if (existe.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe un Equipo con este N° Serie'
                })
            } else if (existeIn.length > 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Equipo ya se encuentra en este documento'
                })
            }
        }
    }

    const handleCheckboxChange = (event) => {
        setConfirmar(event.target.checked);
    };

    // Guardar Cabecera de Documento en Coleccion CabeceraInDB
    const addCabeceraIn = (ev) => {
        ev.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Validar Rut
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
        const temp = rut.split('-');
        let digito = temp[1];
        if (digito === 'k' || digito === 'K') digito = -1;
        const validaR = validarRut(rut);

        const existe = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut);

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

        } else if (nomTipoOut.length === 0 || nomTipoOut === 'Selecciona Opción:') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione un Tipo de Salida'
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

        } else if (existe.length > 0) {
            if (existe[0].confirmado) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento y se encuentra confirmado'
                })
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya existe este documento. Falta confirmar'
                })
            }

        } else {
            if (nomTipoOut === 'CLIENTE') {
                const existeCli = cliente.filter(cli => cli.rut === rut);
                if (existeCli.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut del cliente'
                    })
                } else {
                    setEntidad(existeCli[0].nombre);
                    try {
                        CabeceraOutDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: date,
                            tipoIn: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            // tipMov: 2,
                            confirmado: false
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Cabecera Documento guadada exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(true);
                        setBtnAgregar(false);
                        setBtnGuardar(true);
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
                if (existeProv.length === 0) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'No existe rut de proveedor'
                    })
                } else {
                    setEntidad(existeProv[0].nombre);
                    try {
                        CabeceraOutDB({
                            emp_id: users.emp_id,
                            tipDoc: nomTipDoc,
                            numDoc: numDoc,
                            date: date,
                            tipoOut: nomTipoOut,
                            rut: rut,
                            entidad: entidad,
                            correo: correo,
                            patente: patente,
                            userAdd: user.email,
                            userMod: user.email,
                            fechaAdd: fechaAdd,
                            fechaMod: fechaMod,
                            // tipMov: 2,
                            confirmado: false
                        })
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'Ingreso realizado exitosamente'
                        })
                        setFlag(!flag);
                        setConfirmar(false)
                        setBtnAgregar(false)
                        setBtnGuardar(true);
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

    // hasta aqui funcional 24-07-2023 16:36

    //Valida y guarda los detalles del documento
    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Validar N° Serie en equipo
        const existe = equipo.filter(eq => eq.serie === numSerie);

        // Validar en N° Serie en Entradas
        const existeIn = documento.filter(doc => doc.serie === numSerie)

        // Validar Id de Cabecera en Entradas
        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut && cab.tipmov === 2)

        if (price === '') {
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
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe un Equipo con este N° Serie'
            })

        } else if (existeIn.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Equipo ya se encuentra en este documento'
            })

        } else {
            setBtnConfirmar(false);
            try {
                SalidasDB({
                    emp_id: users.emp_id,
                    tipDoc: nomTipDoc,
                    numDoc: numDoc,
                    date: date,
                    tipoIn: nomTipoOut,
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
                    cab_id: existeCab[0].id,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod,
                    // tipMov: 2,
                    status: 'Cliente'
                });
                setPrice('')
                setNumSerie('')
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Item guardado correctamente'
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

    // Función para actualizar varios documentos por lotes
    const actualizarDocs = async () => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        const existeCab = cabecera.filter(cab => cab.tipdoc === nomTipDoc && cab.numdoc === numDoc && cab.rut === rut)

        const batch = writeBatch(db);
        console.log('docuemnto dentro de batch', documento)

        documento.forEach((docs) => {
            const docRef = doc(db, 'status', docs.eq_id);
            batch.update(docRef, { status: 'Cliente' });
        });

        try {
            await batch.commit();
            console.log('Documentos actualizados correctamente.');
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Documentos actualizados correctamente.'
            });
            await updateDoc(doc(db, 'cabeceras', existeCab[0].id), {
                confirmado: true,
                userMod: user.email,
                fechaMod: fechaMod
            });
            setFlag(!flag)

        } catch (error) {
            console.error('Error al actualizar documentos:', error);
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error al actualizar documentos:', error
            })
        }

        setNomTipDoc('');
        setNumDoc('');
        setDate('');
        setNomTipoOut('');
        setRut('');
        setEntidad('');
        setBtnConfirmar(true);
        setBtnAgregar(true);
        setBtnGuardar(false)
    };


    useEffect(() => {
        getProveedor();
        getCliente();
        getEquipo();
        getSalida()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getSalida();
        getCabecera();
        if (documento.length > 0) setBtnConfirmar(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    // hasta aqui

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h1>Salida de Equipos</h1>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>N° de Documento</Label>
                            <Input
                                disabled={confirmar}
                                type='text'
                                name='NumDoc'
                                placeholder='Ingrese N° Documento'
                                value={numDoc}
                                onChange={ev => setNumDoc(ev.target.value)}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Tipo de Documento</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipDoc}
                                onChange={ev => setNomTipDoc(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipDoc.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Fecha Ingreso</Label>
                            <Input
                                disabled={confirmar}
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
                            <Label>Tipo Salida</Label>
                            <Select
                                disabled={confirmar}
                                value={nomTipoOut}
                                onChange={ev => setNomTipoOut(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipoOut.map((d) => {
                                    return (<option key={d.id}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Rut</Label>
                            <Input
                                disabled={confirmar}
                                type='numero'
                                placeholder='Ingrese Rut'
                                name='rut'
                                value={rut}
                                onChange={ev => setRut(ev.target.value)}
                                onKeyDown={detectarCli}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label  >Correo Transportista</Label>
                            <Input
                                disabled={confirmar}
                                type='texto'
                                placeholder='Ingrese Correo'
                                name='correo'
                                value={correo}
                                onChange={ev => setCorreo(ev.target.value)}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Patente Vehiculo</Label>
                            <Input
                                disabled={confirmar}
                                type='texto'
                                placeholder='Ingrese Vehiculo'
                                name='patente'
                                value={patente}
                                onChange={ev => setPatente(ev.target.value)}
                            />
                            {/* hasta aqui 16:06 */}
                        </ContentElemenSelect>

                        <Boton
                            style={{ margin: '17px 0' }}
                            onClick={addCabeceraIn}
                            checked={confirmar}
                            onChange={handleCheckboxChange}
                            disabled={btnGuardar}
                        >Guardar</Boton>

                    </ContentElemen>
                </Formulario>
            </ContenedorFormulario>

            {/* hasta aqui */}

            <ContenedorFormulario>
                <Formulario>
                    <ContentElemen >
                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input style={{ width: '700px' }} /* onChange={e => setNomEquipo(e.target.value)}*/
                                placeholder='Escanee o ingrese Equipo'
                            />
                        </ContentElemenSelect>

                        <Icon style={{ marginLeft: '0' }}>
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
                            <Table.HeaderCell>Tipo Salida</Table.HeaderCell>
                            <Table.HeaderCell>Transportista</Table.HeaderCell>
                            <Table.HeaderCell>Vehículo</Table.HeaderCell>
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
                            <Table.Cell>Jose Miguel Aburto</Table.Cell>
                            <Table.Cell>LJXU-90</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>486</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>218745</Table.Cell>
                            <Table.Cell>6.140.830-4 </Table.Cell>
                            <Table.Cell>OXIMED</Table.Cell>
                            <Table.Cell>07-06-2023</Table.Cell>
                            <Table.Cell>COMPRA</Table.Cell>
                            <Table.Cell>Jose Miguel Aburto</Table.Cell>
                            <Table.Cell>LJXU-90</Table.Cell>
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

export default Salidas;