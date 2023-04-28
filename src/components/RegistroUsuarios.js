import React, {useState}from 'react';
import styled from 'styled-components';
import Select from './SelectExample';
import Alerta from './Alertas'
import { auth } from "../firebase/firebaseConfig";
import {  createUserWithEmailAndPassword } from 'firebase/auth';


export const RegistroUsuarios = () => {

    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [rol, setRol] = useState('');
    const [empresa, setEmpresa] = useState('')
    const [ alerta, cambiarAlerta] = useState({});
    const [ estadoAlerta, cambiarEstadoAlerta ] = useState(false);

    const Empresa = [
        { key: '1', value: '1', text: 'Sociedad Tres Chanchitos Spa' },
        { key: '2', value: '2', text: 'Soft & Art Spa' }
    ]

    
    const handleChange = (e)=>{
        switch(e.target.name){
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

    const handleSubmit = (e)=>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if(!expresionRegular.test(correo)){
            /* console.log('Favor ingresa un correo valido'); */
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Favor ingresa un correo valido'
            })
            return;
        }
        if(correo === '' || pass === '' || pass2 === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rellena todos los datos del usuario'
            })
            return;
        }
        if(pass !== pass2){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Las contraseñas no son iguales'
            })
            return;
        }
        if(nombre === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Nombre no puede estar vacio'
            })
            return;
        }
        if(apellido === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Apellido no puede estar vacio'
            })
            return;
        }
    }

  return (
    <ContenedorFormulario>
        <Contenedor>
            <h2>Registro de Usuarios</h2>
        </Contenedor>
        
        <Contenedor>
         <Formulario onSubmit={handleSubmit}>            
            <ContentElemen>
                <Label>Nombre:</Label>
                <Input 
                    type = 'text'
                    name = 'nombre'
                    placeholder = 'Ingrese Nombre'
                    value = { nombre }
                    onChange = { handleChange }
                />
            </ContentElemen>
            <ContentElemen>
                <Label>Apellido:</Label>
                <Input 
                    type = 'text'
                    name = 'apellido'
                    placeholder = 'Ingrese Apellido'
                    value = { apellido }
                    onChange = { handleChange }
                />
            </ContentElemen>
            <ContentElemen>
                <Label>Correo:</Label>
                <Input
                    type = 'email'
                    name = 'email'
                    placeholder = 'Correo Electronico'
                    value = { correo }
                    onChange = { handleChange }
                />
            </ContentElemen>
            <ContentElemen>
                <Label>Password:</Label>
                <Input 
                    type = 'password'
                    name = 'password'
                    placeholder = 'Ingrese Password'
                    value = { pass }
                    onChange = { handleChange }
                />
            </ContentElemen>
            <ContentElemen>
                <Label>Password:</Label>
                <Input 
                    type = 'password'
                    name = 'password2'
                    placeholder = 'Repita Password'
                    value = { pass2 }
                    onChange = { handleChange }
                />
            </ContentElemen>  
            <ContentElemen>
                <Label>Selecciona Empresa</Label>
                <Select placeholder='Empresa' opciones={Empresa}/>
            </ContentElemen>
            <ContentElemen>
                <Boton>Guardar</Boton>
            </ContentElemen>        
         </Formulario>  
        </Contenedor>
        <Alerta 
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
        />    
    </ContenedorFormulario>
    
  )
}

const ContenedorFormulario = styled.div`

`
const ContentElemen = styled.div`   
    display: flex;
    padding: 10px;
`

const Contenedor= styled.div`
    width: 600px;
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const Formulario = styled.form`
    
        
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 100%;
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
        margin-top: 5px;
        margin-left: 20px;
`