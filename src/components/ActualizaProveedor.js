import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alerta from '../components/Alertas';
import useObtenerProveedor from '../hooks/useObtenerProveedor';
import EditarProveedor from '../firebase/EditarProveedorDb';
import { auth } from '../firebase/firebaseConfig';
import {Contenedor, Titulo, InputUpdate, BotonGuardar} from '../elementos/General'
import {ContentElemen, Formulario, Label} from '../elementos/CrearEquipos'

const ActualizaProveedor = () => {
    const user = auth.currentUser;
    let fechaActual = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [proveedor] = useObtenerProveedor(id);

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('')
    const [entidad, setEntidad] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [nomContacto, setNomContacto] = useState('')

    const volver = () => {
        navigate('/proveedores')
    }

    useEffect(() => {
        if (proveedor) {
            setRut(proveedor.rut)
            setEntidad(proveedor.nombre);
            setDireccion(proveedor.direccion);
            setTelefono(proveedor.telefono);
            setCorreo(proveedor.correo);
            setNomContacto(proveedor.contacto)
        } else {
            navigate('/')
        }
    }, [proveedor, navigate])

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
        } else if (entidad === '') {
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
        } else if (nomContacto === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Contacto no puede estar vacio'
            })
            return;
        } else {
            try {
                const nom = entidad.toLocaleUpperCase().trim()
                const dir = direccion.toLocaleUpperCase().trim()
                const nomC = nomContacto.toLocaleUpperCase().trim()
                const corr = correo.toLocaleLowerCase().trim()
                EditarProveedor({
                    id: id,
                    nombre: nom,
                    direccion: dir,
                    telefono: telefono,
                    correo: corr,
                    contacto: nomC,
                    userMod: user.email,
                    fechaMod: fechaActual
                })
                    .catch((error) => { console.log(error) })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Proveedor Actualizado exitosamente'
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
            case 'entidad':
                setEntidad(e.target.value);
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
            case 'contacto':
                setNomContacto(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <ContenedorCliente>
            <Contenedor>
                <Titulo>Actuliaza Proveedor</Titulo>
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
                            name='entidad'
                            placeholder='Modifica Nombre'
                            value={entidad}
                           /*  onChange={handleChange} */
                            disabled
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
                        <Label>Nombre Contacto</Label>
                        <InputUpdate
                            type='text'
                            name='contacto'
                            placeholder='Modifica Nombre Contacto'
                            value={nomContacto}
                            onChange={handleChange}
                        />
                    </ContentElemen>
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

export default ActualizaProveedor;

const ContenedorCliente = styled.div``