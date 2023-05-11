import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { auth , db} from '../firebase/firebaseConfig';
import  Alerta from '../components/Alertas';
import AgregarClientesDb from '../firebase/AgregarClientesDb';
import { getDocs, collection } from 'firebase/firestore';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';

const Clientes = () => {
    
    const navigate = useNavigate();
    const user = auth.currentUser;   
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [rut, setRut] = useState('')
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [nomContacto, setNomContacto] = useState('')
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [leer, setLeer] = useState([]);

    const volver = ()=>{
        navigate('/home/actualizacliente')
    }

    //Leer data
    const getData = async () => {
        const data = await getDocs(collection(db, "clientes"));
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))

    }
    //filtrar para paginacion
    const filtroCliente = () => {

        if (buscador.length === 0)

            return leer.slice(pagina, pagina + 5);

        const nuevoFiltro = leer.filter(cli => cli.nombre.includes(buscador));
        return nuevoFiltro.slice(pagina, pagina + 5);

    }

    const siguientePag = () => {
        if (leer.filter(cli => cli.nombre.includes(buscador)).length > pagina + 5)
            setPagina(pagina + 5);
    }

    const paginaAnterior = () => {
        if (pagina > 0) setPagina(pagina - 5)

    }

    const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setPagina(0);
        setBuscardor(target.value)

    }

    useEffect(() => {
        getData();
    }, [setNombre, nombre])

    const handleChange = (e)=>{
        switch(e.target.name){
            case 'rut':
                setRut(e.target.value);
                break;
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
                AgregarClientesDb({
                    rut:rut,
                    nombre:nombre,
                    direccion:direccion,
                    telefono:telefono,
                    correo:correo,
                    contacto:nomContacto,
                    userAdd: user.email,
                    userMod: user.email,
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod

                })
                setRut('');
                setNombre('');
                setDireccion('');
                setTelefono('');
                setCorreo('');
                setNomContacto('')
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                tipo: 'exito',
                mensaje: 'Cliente registrado exitosamente'
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

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Mis Clientes</Titulo>
            </ContenedorFormulario>
           
            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Rut</Label>
                        <Input
                            type='number'
                            name = 'rut'
                            placeholder = 'Ingrese Rut'
                            value = { rut }
                            onChange = { handleChange }
                             
                        />
                        <Label>Nombre</Label>
                        <Input
                            type='text'
                            name = 'nombre'
                            placeholder = 'Ingrese Nombre'
                            value = { nombre }
                            onChange = { handleChange }                        
                        />
                        <Label >Dirección</Label>
                        <Input
                            type='text'
                            name = 'direccion'
                            placeholder = 'Ingrese Dirección'
                            value = { direccion }
                            onChange = { handleChange }                        
                        />
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Telefono</Label>
                        <Input 
                            type='number'
                            name = 'telefono'
                            placeholder = 'Ingrese Telefono'
                            value = { telefono }
                            onChange = { handleChange }
                        />
                        <Label>Email</Label>
                        <Input
                            type='email'
                            name = 'correo'
                            placeholder = 'Ingrese Correo'
                            value = { correo }
                            onChange = { handleChange }
                        
                        />
                        <Label>Nombre Contacto</Label>
                        <Input
                            type='text'
                            name = 'contacto'
                            placeholder = 'Ingrese Nombre Contacto'
                            value = { nomContacto }
                            onChange = { handleChange }
                        
                        />  
                    </ContentElemen>
                    <BotonGuardar >Guardar</BotonGuardar>              
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
            <ContentElemen>
                    <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color:'green' }} /></Boton>
                    <Titulo>Listado Clientes</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
            </ContentElemen>
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Empresa'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>
                <Table singleLine>
                            <Table.Header>
                                 <Table.Row>
                                    <Table.HeaderCell>Nombre Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Rut</Table.HeaderCell>        
                                    <Table.HeaderCell>Direccion</Table.HeaderCell>        
                                    <Table.HeaderCell>Telefono</Table.HeaderCell>        
                                    <Table.HeaderCell>Accion</Table.HeaderCell>        
                                    </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    filtroCliente().map((item, index)=>{
                                        return(
                                            <Table.Row key={item.index}>
                                                <Table.Cell>{item.nombre}</Table.Cell>
                                                <Table.Cell>{item.id}</Table.Cell>       
                                                <Table.Cell>{item.direccion}</Table.Cell>       
                                                <Table.Cell>{item.telefono}</Table.Cell>       
                                                <Table.Cell><Boton onClick={volver}><FaIcons.FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                                                </Boton></Table.Cell>       
                                            </Table.Row>
                                        )
                                    })

                                }                           
                                              
           
                            </Table.Body>
                </Table>
            </ListarProveedor>
            <Alerta 
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            /> 
            
        </ContenedorProveedor>
    );
}



export default Clientes;

const Titulo = styled.h2`
    color:  #83d394;
`
const ContenedorProveedor = styled.div`
   
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

const ListarProveedor = styled.div`
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
`

const Label = styled.label`
        padding: 5px;
        font-size: 20px;
`

const Boton = styled.button`
        cursor:pointer;
        background-color: #ffff;        
        border-radius: 5px;
        border: none;        
        &:hover{
            background-color: #83d310;
        }
`

const BotonGuardar = styled.button`
        cursor: pointer;
        background-color: green;        
        border-radius: 5px;
        border: none;
        padding: 5px;
        &:hover{
            background-color: #83d310;
        }
`