import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerCliente from '../hooks/useObtenerCliente';
import EditarCliente from '../firebase/EditarClientesDb';
import { auth } from '../firebase/firebaseConfig';
import { Contenedor, Titulo, InputUpdate, BotonGuardar } from '../elementos/General'
import { ContentElemen, Formulario, Label } from '../elementos/CrearEquipos'

const ActualizaCliente = () => {
    const user = auth.currentUser;
    let fechaActual = new Date();
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente] = useObtenerCliente(id);

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('')
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [checked, setChecked] = useState(true);
    const [nomRsf, setNomRsf] = useState('')
    const [dirRsf, setDirRsf] = useState('')
    const [telRsf, setTelRsf] = useState('')

    const volver = () => {
        navigate('/clientes')
    }

    useEffect(() => {
        if (cliente) {
            setRut(cliente.rut)
            setNombre(cliente.nombre);
            setDireccion(cliente.direccion);
            setTelefono(cliente.telefono);
            setCorreo(cliente.correo);
            setNomRsf(cliente.nomrsf);
            setDirRsf(cliente.dirrsf);
            setTelRsf(cliente.telrsf);
        } else {
            navigate('/')
        }
    }, [cliente, navigate])

    const handleChek = (e) => {
        setChecked(e.target.checked)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

        if (rut === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Rut no puede estar vacio'
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
                mensaje: 'favor ingresar un correo valido'
            })
            return;
        } else {
            try {
                const nom = nombre.toLocaleUpperCase().trim();
                const dir = direccion.toLocaleUpperCase().trim();
                const corr = correo.toLocaleUpperCase().trim();
                const nomrsf = nomRsf.toLocaleUpperCase().trim();
                const dirrsf = dirRsf.toLocaleUpperCase().trim();
                const telrsf = telRsf.toLocaleLowerCase().trim();
                EditarCliente({
                    id: id,
                    nombre: nom,
                    direccion: dir,
                    telefono: telefono,
                    correo: corr,
                    nomrsf: nomrsf,
                    dirrsf: dirrsf,
                    telrsf: telrsf,
                    userMod: user.email,
                    fechaMod: fechaActual
                })
                    .catch((error) => { console.log(error) })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Cliente Actualizado exitosamente'
                })
                return;
            } catch (error) {
                console.log('se produjo un error al guardar', error);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: error
                })
            }
        }
    }

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'nombre':
                setNombre(e.target.value);
                break;
            case 'direccion':
                setDireccion(e.target.value);
                break;
            case 'telefono':
                setTelefono(e.target.value);
                break;
            case 'correo':
                setCorreo(e.target.value);
                break;
            default:
                break;
        }
        if (checked) {
            switch (e.target.name) {
                case 'nombrersf':
                    setNomRsf(e.target.value)
                    break;
                case 'direccionrsf':
                    setDirRsf(e.target.value);
                    break;
                case 'telefonorsf':
                    setTelRsf(e.target.value);
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <ContenedorCliente>
            <Contenedor>
                <Titulo>Actuliaza Clientes</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Rut</Label>
                        <InputUpdate
                            type='text'
                            name='rut'
                            value={rut}
                            disabled
                        />
                        <Label>Nombre</Label>
                        <InputUpdate
                            type='text'
                            name='nombre'
                            placeholder='Modifica Nombre'
                            value={nombre}
                            onChange={handleChange}
                        />
                        <Label >Dirección</Label>
                        <InputUpdate
                            type='text'
                            name='direccion'
                            placeholder='Modifica Dirección'
                            value={direccion}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Telefono</Label>
                        <InputUpdate
                            type='number'
                            name='telefono'
                            placeholder='Modifica Telefono'
                            value={telefono}
                            onChange={handleChange}
                        />
                        <Label>Email</Label>
                        <InputUpdate
                            type='email'
                            name='correo'
                            placeholder='Modifica Correo'
                            value={correo}
                            onChange={handleChange}
                        />
                        <Label>Responsable financiero?</Label>
                        <InputUpdate
                            style={{ width: "3%", color: "green" }}
                            type="checkbox"
                            checked={checked}
                            onChange={handleChek}
                        />
                    </ContentElemen>
                    {checked ?
                        <ContentElemen>
                            <Label>Nombre</Label>
                            <InputUpdate
                                name="nombrersf"
                                type="text"
                                placeholder='Responsable financiero'
                                value={nomRsf}
                                onChange={handleChange}
                            />
                            <Label>Dirección</Label>
                            <InputUpdate
                                name="direccionrsf"
                                type="text"
                                placeholder='Ingres dirección'
                                value={dirRsf}
                                onChange={handleChange}
                            />
                            <Label>Telefono</Label>
                            <InputUpdate
                                name="telefonorsf"
                                type="number"
                                placeholder='Ingrese telefono'
                                value={telRsf}
                                onChange={handleChange}
                            />
                        </ContentElemen>
                        :
                        ''
                    }
                    <BotonGuardar >Actualizar</BotonGuardar>
                    <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                </Formulario>
            </Contenedor>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorCliente>
    )
}

export default ActualizaCliente;

const ContenedorCliente = styled.div``