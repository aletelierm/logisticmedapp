import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import Alertas from './Alertas';
import validarRut from '../funciones/validarRut';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, getDoc, collection, where, query, doc } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { Regiones } from './comunas';
import * as IoIcons from 'react-icons/io';
import { Servicio } from './TipDoc';
import { ContenedorProveedor, Contenedor, /* ListarProveedor,*/ Titulo, BotonGuardar, ConfirmaModal, ConfirmaBtn, Boton2, Overlay /*Boton */ } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, ContentElemen, Formulario, Input, Label, /*, ListarEquipos, Select,*/ TextArea, Select } from '../elementos/CrearEquipos';

const IngresoEquiposST = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    // let fechaAdd = new Date();
    // let fechaMod = new Date();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [date, setDate] = useState('');
    const [confirmar, setConfirmar] = useState(false);
    const [openModalCli, setOpenModalCli] = useState(false);
    const [region, setRegion] = useState('Arica y Parinacota');
    const [comuna, setComuna] = useState('');
    const [checked, setChecked] = useState();
    const [nomRsf, setNomRsf] = useState('');
    const [dirRsf, setDirRsf] = useState('');
    const [telRsf, setTelRsf] = useState('');
    const [serie, setSerie] = useState('');
    const [familia, setFamilia] = useState('');
    const [tipo, setTipo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [servicio, setServicio] = useState('');
    const almacenar = useRef([]);

    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // setBtnGuardar(true)
        if (e.key === 'Enter' || e.key === 'Tab') {
            const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(cli)
            const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if (rutCli.docs.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe rut de Cliente'
                })
                setOpenModalCli(!openModalCli)
                setEntidad('');
                setTelefono('');
                setDireccion('');
                setCorreo('');
            } else {
                setEntidad(final[0].nombre);
                setTelefono(final[0].telefono);
                setDireccion(final[0].direccion);
                setCorreo(final[0].correo);
                // setBtnGuardar(false)
            }
        }
    }

    // Validar N°serie
    const detectarEq = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        if (e.key === 'Enter' || e.key === 'Tab') {
            // Exite N° serie en equipos   
            const traerEq = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie', '==', serie));
            const serieEq = await getDocs(traerEq);
            const existe = (serieEq.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            // Exite ID en equipos
            const traerId = await getDoc(doc(db, 'equipos', serie));
            if (existe.length === 1) {
                almacenar.current = existe;
            } else if (traerId.exists()) {
                const existeId = traerId.data();
                const arreglo = [existeId];
                const existe2 = arreglo.map((doc) => ({ ...doc, id: serie }));
                almacenar.current = existe2;
            } else {
                console.log('almacenar', almacenar.current);
            }

            if (almacenar.current.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe un Equipo con este N° Serie o Id'
                })
                setOpenModalCli(!openModalCli)
            } else {
                setFamilia(almacenar.current[0].familia);
                setTipo(almacenar.current[0].tipo);
                setMarca(almacenar.current[0].marca);
                setModelo(almacenar.current[0].modelo);
                // setBtnGuardar(false)
            }
        }
    }

    const handleChek = (e) => {
        setChecked(e.target.checked)
    }
    const comunasxRegion = Regiones.find((option) => option.region === region).comunas
    // Guardar Cliente nuevo
    const guardarCli = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // //Comprobar que existe el rut en DB
        // const existe = leer.filter(cli => cli.rut === rut).length === 0
        //Patron para Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
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
        } else if (nombre === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Nombre no puede estar vacio'
            })
            return;
        } else if (direccion === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Dirección no puede estar vacio'
            })
            return;
        } else if (telefono === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo telefono no puede estar vacio'
            })
            return;
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor ingresar un correo valido'
            })
            return;
        } else if (checked && nomRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo nombre RSF no puede estar vacio'
            })
            return;
        } else if (checked && dirRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Dirección no puede estar vacio'
            })
            return;
        } else if (checked && telRsf === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo telefono no puede estar vacio'
            })
            return;
        } else {
            // try {
            // const nom = nombre.toLocaleUpperCase().trim();
            // const dir = direccion.toLocaleUpperCase().trim();
            // const nomrsf = nomRsf.toLocaleUpperCase().trim();
            // const dirrsf = dirRsf.toLocaleUpperCase().trim();
            // const telrsf = telRsf.toLocaleUpperCase().trim();
            // const corr = correo.toLocaleLowerCase().trim();
            // const ruts = rut.toLocaleUpperCase().trim();
            //     AgregarClientesDb({
            //         emp_id: users.emp_id,
            //         rut: ruts,
            //         nombre: nom,
            //         direccion: dir,
            //         telefono: telefono,
            //         region: region,
            //         comuna: comuna,
            //         correo: corr,
            //         nomrsf: nomrsf,
            //         dirrsf: dirrsf,
            //         telrsf: telrsf,
            //         userAdd: user.email,
            //         userMod: user.email,
            //         fechaAdd: fechaAdd,
            //         fechaMod: fechaMod
            //     })
            //     setRut('');
            //     setNombre('');
            //     setDireccion('');
            //     setTelefono('');
            //     setCorreo('');
            //     setNomRsf('');
            //     setDirRsf('');
            //     setTelRsf('');
            //     setChecked(false)
            //     cambiarEstadoAlerta(true);
            //     cambiarAlerta({
            //         tipo: 'exito',
            //         mensaje: 'Cliente registrado exitosamente'
            //     })
            //     setFlag(!flag);
            //     return;
            // } catch (error) {
            //     console.log('se produjo un error al guardar', error);
            //     cambiarEstadoAlerta(true);
            //     cambiarAlerta({
            //         tipo: 'error',
            //         mensaje: error
            //     })
            // }
        }
    }

    // Guardar Datos de Cliente en ingreso
    const ingresoCli = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        //Comprobar que existe el rut en DB
        const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
        const rutCli = await getDocs(cli)
        const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        //Patron para Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
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
        } else if (rutCli.docs.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe rut de Cliente'
            })
            setOpenModalCli(!openModalCli)
            return;
        } else if (date === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Seleccione una Fecha'
            })
            return;
        } else {
            // try {
            // Fata definir nombre coleccion
            // AgregarClientesDb({
            //     emp_id: users.emp_id,
            //     rut: rut,
            //     nombre: nombre,
            //     direccion: direccion,
            //     telefono: telefono,
            //     region: region,
            //     comuna: comuna,
            //     correo: correo,
            //     nomrsf: nomRsf,
            //     dirrsf: dirRsf,
            //     telrsf: telRsf,
            //     userAdd: user.email,
            //     userMod: user.email,
            //     fechaAdd: fechaAdd,
            //     fechaMod: fechaMod
            // })
            // setRut('');
            // setNombre('');
            // setDireccion('');
            // setTelefono('');
            // setCorreo('');
            // cambiarEstadoAlerta(true);
            // cambiarAlerta({
            //     tipo: 'exito',
            //     mensaje: 'Cliente registrado exitosamente'
            // })
            // setFlag(!flag);
            // return;
            // } catch (error) {
            // console.log('se produjo un error al guardar', error);
            // cambiarEstadoAlerta(true);
            // cambiarAlerta({
            // tipo: 'error',
            // mensaje: error
            // })
            // }
        }
    }


    return (
        <ContenedorProveedor>
            <Contenedor >
                <Titulo>Orden de Ingreso de Equipos</Titulo>
            </Contenedor>
            {/* Informacion del Cliente */}
            <Contenedor>
                <Titulo>Información Cliente</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Rut</Label>
                            <Input
                                disabled={confirmar}
                                type='numero'
                                placeholder='Ingrese Rut sin puntos'
                                name='rut'
                                value={rut}
                                onChange={ev => setRut(ev.target.value)}
                                onKeyDown={detectarCli}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha de Ingreso</Label>
                            <Input
                                // disabled={confirmar}
                                type='datetime-local'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            // min={fechaMinima.toISOString().slice(0, 16)}
                            // max={fechaMaxima.toISOString().slice(0, 16)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Telefono</Label>
                            <Input value={telefono} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Dirección</Label>
                            <Input value={direccion} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Email</Label>
                            <Input value={correo} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar onClick={ingresoCli}>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Informacion del Equipo */}
            <Contenedor>
                <Titulo>Información Equipo</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>N° Serie</Label>
                            <Input
                                type='text'
                                placeholder='Ingrese N° Serie'
                                name='serie'
                                value={serie}
                                onChange={e => setSerie(e.target.value)}
                                onKeyDown={detectarEq}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Familia</Label>
                            <Input value={familia} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Equipo</Label>
                            <Input value={tipo} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Marca</Label>
                            <Input value={marca} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Modelo</Label>
                            <Input value={modelo} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Servicio</Label>
                            <Select
                                disabled={confirmar}
                                value={servicio}
                                onChange={ev => setServicio(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {Servicio.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Test de Ingreso */}
            <Contenedor>
                <Titulo>Test de Ingreso</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Si</Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Equipo ¿Enciende?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>¿Entrega flujo?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filtro espuma</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Accesorios</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Trajeta memoria</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Fuente de poder o cable</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Manguera</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Bolso</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Cámara de agua</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Climate control</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <ContentElemenMov style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Label>Observaciones</Label>
                    <TextArea
                        style={{ width: '80%', height: '60px' }}
                        type='text'
                        name='descripcion'
                        placeholder='Ingrese observacion o detalles adicionales'
                    // value={descripcion}
                    // onChange={e => setDescripcion(e.target.value)}
                    />
                </ContentElemenMov>
                <BotonGuardar>Guardar</BotonGuardar>
                <BotonGuardar>Nuevo</BotonGuardar>
            </Contenedor>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />

            {openModalCli && (
                <Overlay>
                    <ConfirmaModal>
                        <Titulo>Crear Cliente</Titulo>
                        <BotonCerrar onClick={() => setOpenModalCli(!openModalCli)}><IoIcons.IoMdClose /></BotonCerrar>
                        <Formulario action='' >
                            <ContentElemen>
                                <Label>Rut</Label>
                                <Input
                                    maxLength='10'
                                    type='text'
                                    name='rut'
                                    placeholder='Ingrese Rut sin puntos'
                                    value={rut}
                                    onChange={ev => setRut(ev.target.value)}
                                />
                                <Label>Nombre</Label>
                                <Input
                                    type='text'
                                    name='nombre'
                                    placeholder='Ingrese Nombre'
                                    value={nombre}
                                    onChange={ev => setNombre(ev.target.value)}
                                />
                                <Label >Dirección</Label>
                                <Input
                                    type='text'
                                    name='direccion'
                                    placeholder='Ingrese Dirección'
                                    value={direccion}
                                    onChange={ev => setDireccion(ev.target.value)}
                                />
                            </ContentElemen>
                            <ContentElemen>
                                <Label>Region</Label>
                                <Select value={region} onChange={e => setRegion(e.target.value)} >
                                    {Regiones.map((r, index) => {
                                        return (
                                            <option key={index} >{r.region}</option>
                                        )
                                    })}
                                </Select>
                                <Label>Comuna</Label>
                                <Select value={comuna} onChange={e => setComuna(e.target.value)} >
                                    {comunasxRegion.map((objeto, index) => {
                                        return (<option key={index}>{objeto.name}</option>)
                                    })}
                                </Select>
                            </ContentElemen>
                            <ContentElemen>
                                <Label >Telefono</Label>
                                <Input
                                    type='number'
                                    name='telefono'
                                    placeholder='Ingrese Telefono'
                                    value={telefono}
                                    onChange={ev => setTelefono(ev.target.value)}
                                />
                                <Label>Email</Label>
                                <Input
                                    type='email'
                                    name='correo'
                                    placeholder='Ingrese Correo'
                                    value={correo}
                                    onChange={ev => setCorreo(ev.target.value)}
                                />
                                <Label>Responsable financiero?</Label>
                                <Input
                                    style={{ width: "3%", color: "#328AC4" }}
                                    type="checkbox"
                                    checked={checked}
                                    onChange={handleChek}
                                />
                            </ContentElemen>

                            {checked ?
                                <ContentElemen>
                                    <Label>Nombre</Label>
                                    <Input
                                        name="nombrersf"
                                        type="text"
                                        placeholder='Responsable financiero'
                                        value={nomRsf}
                                        onChange={ev => setNomRsf(ev.target.value)}
                                    />
                                    <Label>Dirección</Label>
                                    <Input
                                        name="direccionrsf"
                                        type="text"
                                        placeholder='Ingres dirección'
                                        value={dirRsf}
                                        onChange={ev => setDirRsf(ev.target.value)}
                                    />
                                    <Label>Telefono</Label>
                                    <Input
                                        name="telefonorsf"
                                        type="number"
                                        placeholder='Ingrese telefono'
                                        value={telRsf}
                                        onChange={ev => setTelRsf(ev.target.value)}
                                    />
                                </ContentElemen>
                                : ''
                            }
                        </Formulario>
                        <BotonGuardar onClick={guardarCli} >Guardar</BotonGuardar>
                    </ConfirmaModal>
                </Overlay>
            )}
        </ContenedorProveedor>
    )
}

export default IngresoEquiposST;

const BotonCerrar = styled.button`
    position: absolute;
    top:20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all.3s ease all;
    border-radius: 5px;
    color: #1766DC;

    &:hover{
        background: #f2f2f2;
    }
`