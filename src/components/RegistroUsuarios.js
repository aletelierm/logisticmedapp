import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Alerta from './Alertas'
import { db, auth } from './../firebase/firebaseConfig';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Roles } from './Roles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import ExportarExcel from '../funciones/ExportarExcel';
import {Titulo, BotonGuardar} from '../elementos/General'
import {Formulario} from '../elementos/CrearEquipos'
import {ContentElemenUser, ContenedorUser, InputUser, LabelUser, SelectUser} from '../elementos/Configuracion'

export const RegistroUsuarios = () => {
    let fechaactual = new Date();
    const userAuth = auth.currentUser.email;
    const useradd = userAuth;
    const usermod = userAuth;

    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [rol, setRol] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [nomEmpresa, setNomEmpresa] = useState([]);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    //Lee datos de las empresas
    const getEmpresa = async () => {
        const dataEmpresa = await getDocs(collection(db, "empresas"));
        setEmpresa(dataEmpresa.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }
    //Lee datos de los usuarios
    const getUsuarios = async () => {
        const dataUsuarios = await getDocs(collection(db, "usuarios"));
        setUsuarios(dataUsuarios.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }

    useEffect(() => {
        getEmpresa();
        getUsuarios();
    }, [])
    //Lee input de formulario
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'email':
                setCorreo(e.target.value);
                break;
            case 'password':
                setPass(e.target.value);
                break;
            case 'password2':
                setPass2(e.target.value);
                break;
            case 'nombre':
                setNombre(e.target.value);
                break;
            case 'apellido':
                setApellido(e.target.value);
                break;
            default:
                break;
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if (nombre === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Nombre no puede estar vacio'
            })
            return;
        } else if (apellido === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Apellido no puede estar vacio'
            })
            return;
        } else if (!expresionRegular.test(correo)) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor ingresa un correo valido'
            })
            return;
        } else if (correo === '' || pass === '' || pass2 === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor ingresa los datos de autenticación '
            })
            return;
        } else if (pass !== pass2) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Las contraseñas no son iguales'
            })
            return;
        } else if (nomEmpresa.length === 0 || nomEmpresa === 'Selecciona Opción') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Empresa'
            })
        } else if (rol.length === 0 || rol === 'Selecciona Opción') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor Seleccionar Rol'
            })
        } else {
            const indice = empresa.findIndex((elemento) => elemento.empresa === nomEmpresa)
            const id_emp = empresa[indice].id
            try {
                await createUserWithEmailAndPassword(auth, correo, pass);
                //Obtener id de usuario creado en Auth
                const id = auth.currentUser.uid;
                //Crear usuarios
                const crear = async () => {
                    const coleccion = collection(db, 'usuarios');
                    await setDoc(doc(coleccion, id), {
                        nombre: nombre,
                        apellido: apellido,
                        empresa: nomEmpresa,
                        emp_id: id_emp,
                        rol: rol,
                        user_add: useradd,
                        user_mod: usermod,
                        fecha_add: fechaactual,
                        fecha_mod: fechaactual
                    });
                }
                crear();
                setNombre('');
                setApellido('');
                setCorreo('');
                setPass('');
                setPass2('');
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Usuario Registrado correctamente'
                })
            } catch (error) {
                console.log('El error es', error.code);
                cambiarEstadoAlerta(true);
                let mensaje;
                switch (error.code) {
                    case 'auth/weak-password':
                        mensaje = 'La contraseña tiene que ser de al menos 6 caracteres';
                        break;
                    case 'auth/email-already-in-use':
                        mensaje = 'Ya existe una cuenta con ese correo';
                        break;
                    case 'auth/invalid-email':
                        mensaje = 'El correo no es valido';
                        break;
                    default:
                        mensaje = 'Error al crear la cuenta';
                        break;
                }
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: mensaje
                });
            }
        }
    }

    //Exportar a excel los equipos
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['empresa', 'nombre', 'apellido', 'correo', 'rol']
        //Llamar a la funcion con props: array equipo y array columnas
        const excelBlob = ExportarExcel(usuarios, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'data.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorFormulario>
            <ContenedorUser>
                <Titulo>Registro de Usuarios y Roles</Titulo>
            </ContenedorUser>
            <ContenedorUser>
                <Formulario onSubmit={handleSubmit}>
                    <ContentElemenUser>
                        <FaIcons.FaUserAlt style={{ color: '#328AC4', fontSize: '20px' }} />
                        <LabelUser>Nombre:</LabelUser>
                        <InputUser
                            type='text'
                            name='nombre'
                            placeholder='Ingrese Nombre'
                            value={nombre}
                            onChange={handleChange}
                        />
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <FaIcons.FaUserAlt style={{ color: '#328AC4', fontSize: '20px' }} />
                        <LabelUser>Apellido:</LabelUser>
                        <InputUser
                            type='text'
                            name='apellido'
                            placeholder='Ingrese Apellido'
                            value={apellido}
                            onChange={handleChange}
                        />
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <MdIcons.MdOutlineEmail style={{ color: '#328AC4', fontSize: '20px' }} />
                        <LabelUser>Correo:</LabelUser>
                        <InputUser
                            type='email'
                            name='email'
                            placeholder='Correo Electronico'
                            value={correo}
                            onChange={handleChange}
                        />
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <FaIcons.FaKey style={{ color: '#328AC4', fontSize: '20px' }} />
                        <LabelUser>Password:</LabelUser>
                        <InputUser
                            type='password'
                            name='password'
                            placeholder='Ingrese Password'
                            value={pass}
                            onChange={handleChange}
                        />
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <FaIcons.FaKey style={{ color: '#328AC4', fontSize: '20px' }} />
                        <LabelUser>Password:</LabelUser>
                        <InputUser
                            type='password'
                            name='password2'
                            placeholder='Repita Password'
                            value={pass2}
                            onChange={handleChange}
                        />
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <LabelUser>Empresas</LabelUser>
                        <SelectUser value={nomEmpresa} onChange={e => setNomEmpresa(e.target.value)}>
                            <option>Selecciona Opción:</option>
                            {empresa.map((d) => {
                                return (<option key={d.id2}>{d.empresa}</option>)
                            })}
                        </SelectUser>
                        <LabelUser>Roles</LabelUser>
                        <SelectUser value={rol} onChange={ev => setRol(ev.target.value)}>
                            <option>Selecciona Opción:</option>
                            {Roles.map((d,index) => {
                                return (<option key={index}>{d.text}</option>)
                            })}
                        </SelectUser>
                    </ContentElemenUser>
                    <ContentElemenUser>
                        <BotonGuardar>GUARDAR</BotonGuardar>
                    </ContentElemenUser>
                </Formulario>
                <ContentElemenUser>
                    <BotonGuardar onClick={ExportarXls}>Exportar</BotonGuardar>
                </ContentElemenUser>
            </ContenedorUser>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorFormulario>
    )
}

const ContenedorFormulario = styled.div``
export default RegistroUsuarios;