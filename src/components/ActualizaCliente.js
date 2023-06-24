import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import  Alerta from '../components/Alertas';
import useObtenerCliente from '../hooks/useObtenerCliente';
import EditarCliente from '../firebase/EditarClientesDb';
import { auth } from '../firebase/firebaseConfig';

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
    const [nomContacto, setNomContacto] = useState('')

    const volver = ()=>{
      navigate('/home/clientes')
    }

    useEffect(()=>{
        if(cliente){
           setRut(cliente.rut)
           setNombre(cliente.nombre);
           setDireccion(cliente.direccion);
           setTelefono(cliente.telefono);
           setCorreo(cliente.correo);
           setNomContacto(cliente.contacto)
       }else{
       navigate('/')
   }

 },[cliente,navigate])



    const handleSubmit =(e)=>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

        if(rut ===''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Rut no puede estar vacio'
            })
         return;
        }else if(nombre ===''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
            tipo: 'error',
            mensaje: 'Campo Nombre no puede estar vacio'
         })
        return;
    }else if(direccion ===''){
        cambiarEstadoAlerta(true);
        cambiarAlerta({
            tipo: 'error',
            mensaje: 'Campo Dirección no puede estar vacio'
        })
        return;
    }else if(telefono ===''){
        cambiarEstadoAlerta(true);
        cambiarAlerta({
            tipo: 'error',
            mensaje: 'Campo telefono no puede estar vacio'
        })
        return;
    }else if(!expresionRegular.test(correo)){
        cambiarEstadoAlerta(true);
        cambiarAlerta({
            tipo: 'error',
            mensaje: 'favor ingresar un correo valido'
        })
        return;
    }else if(nomContacto ===''){
        cambiarEstadoAlerta(true);
        cambiarAlerta({
            tipo: 'error',
            mensaje: 'Campo Contacto no puede estar vacio'
        })
        return;
    }else{
        try {
            const nom = nombre.toLocaleUpperCase().trim()
            const dir = direccion.toLocaleUpperCase().trim()
            const nomC = nomContacto.toLocaleUpperCase().trim()
            const corr = correo.toLocaleLowerCase().trim()
            console.log('este es el id',id)
            EditarCliente({
                id: id,
                nombre:nom,
                direccion:dir,
                telefono:telefono,
                correo:corr,
                contacto:nomC,
                userMod: user.email,               
                fechaMod: fechaActual
            }) 
            .catch((error)=>{console.log(error)})
            /* setRut('');
            setEntidad('');
            setDireccion('');
            setTelefono('');
            setCorreo('');
            setNomContacto('') */
            cambiarEstadoAlerta(true);
            cambiarAlerta({
            tipo: 'exito',
            mensaje: 'Cliente Actualizado exitosamente'
            })
            return;
            
        } catch (error) {
            console.log('se produjo un error al guardar',error);
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: error
            })
        }
    }
    }
  
  
   

    const handleChange = (e)=>{
        switch(e.target.name){
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
            case 'contacto':
            setNomContacto(e.target.value);
            break;
            default:
            break;
    } 
    }

  return (
    <ContenedorCliente>
    <ContenedorFormulario>
        <Titulo>Actuliaza Clientes</Titulo>
    </ContenedorFormulario>
   
    <ContenedorFormulario>
        <Formulario action='' onSubmit={handleSubmit}>
            <ContentElemen>
                <Label>Rut</Label>
                <Input
                    type='text'
                    name = 'rut'
                    value = { rut }                   
                    disabled
                />
                <Label>Nombre</Label>
                <Input
                    type='text'
                    name = 'nombre'
                    placeholder = 'Modifica Nombre'
                    value = { nombre}
                    onChange = { handleChange }                        
                />
                <Label >Dirección</Label>
                <Input
                    type='text'
                    name = 'direccion'
                    placeholder = 'Modifica Dirección'
                    value = { direccion}
                    onChange = { handleChange }                        
                />
            </ContentElemen>
            <ContentElemen>
                <Label >Telefono</Label>
                <Input 
                    type='number'
                    name = 'telefono'
                    placeholder = 'Modifica Telefono'
                    value = { telefono}
                    onChange = { handleChange }
                />
                <Label>Email</Label>
                <Input
                    type='email'
                    name = 'correo'
                    placeholder = 'Modifica Correo'
                    value = { correo }
                    onChange = { handleChange }
                
                />
                <Label>Nombre Contacto</Label>
                <Input
                    type='text'
                    name = 'contacto'
                    placeholder = 'Modifica Nombre Contacto'
                    value = { nomContacto}
                    onChange = { handleChange }
                
                />  
            </ContentElemen>
            <BotonGuardar >Actualizar</BotonGuardar>  
            <BotonGuardar onClick={volver}>Volver</BotonGuardar>            
        </Formulario>
      </ContenedorFormulario>    
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

const Titulo = styled.h2`
    color:  #83d394;
`

const ContenedorCliente = styled.div`
   
`
const ContenedorFormulario = styled.div`
   
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
    
`
const ContentElemen = styled.div`
   
    display: flex;
    justify-content: space-between;
    padding: 20px;
`
const Formulario = styled.form`

`

const Input = styled.input`
    
    border: 2px solid #d1d1d1;
    border-radius: 6px;
    padding: 5px;
    transition: all.3s ease all;
    
    &:focus{
      border: 3px solid #83d394;
    }
`

const Label = styled.label`
        padding: 5px;
        font-size: 20px;
`

/* const Boton = styled.button`
        cursor:pointer;
        background-color: #ffff;        
        border-radius: 5px;
        border: none;        
        &:hover{
            background-color: #83d310;
        }
` */

const BotonGuardar = styled.button`
        cursor: pointer;
        background-color: green;        
        border-radius: 5px;
        border: none;
        margin-left: 5px;
        padding: 5px;
        &:hover{
            background-color: #83d310;
        }
`