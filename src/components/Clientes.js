import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import {  Link } from 'react-router-dom';
import { auth , db} from '../firebase/firebaseConfig';
import  Alerta from '../components/Alertas';
import AgregarClientesDb from '../firebase/AgregarClientesDb';
import { getDocs, collection, where, query } from 'firebase/firestore';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import validarRut from '../funciones/validarRut';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const Clientes = () => {
    
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;   
    let fechaAdd = new Date();
    let fechaMod = new Date();
    
    //Obtener datos de contexto global
    const {users} = useContext(UserContext);   
  
    const [rut, setRut] = useState('')
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')    
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [leer, setLeer] = useState([]);
    const [flag, setFlag] = useState(false)
    const [checked, setChecked] = useState();
    const [nomRsf, setNomRsf] = useState('')
    const [dirRsf, setDirRsf] = useState('')
    const [telRsf, setTelRsf] = useState('')

   
   
   
    //Lectura de datots filtrados por empresa
    const getData = async () => {
        const traerClientes = collection(db, 'clientes');
        const dato = query(traerClientes, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    /* useEffect(()=>{
         generarCorrelativo();
        
    },[]) */

    const handleChange = (e)=>{        

        switch(e.target.name){
            case 'rut':
                setRut(e.target.value)
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
                default:
                break;
        }

        if(checked){
            switch(e.target.name){
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

    /* const detectar = (e)=>{
        if(e.key==='Enter' || e.key==='Tab'){
            // Consulta si exite rut en el arreglo            
            const existe = leer.filter(cli => cli.rut === rut).length === 0      
             
        if(!existe){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut ya existe'
            })            
            return;
        }        
        }
    } */
    const handleChek = (e)=>{
        setChecked(e.target.checked)
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});       
        //Comprobar que existe el rut en DB
        const existe = leer.filter(cli => cli.rut === rut).length === 0  
        /* const existe = leer.filter(cli => cli.rut.includes(rut.toLocaleUpperCase().trim())).length > 0; */

        //Comprobar que correo sea correcto
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        const expresionRegularRut = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
       
       /*  console.log(validarRut(rut)); */
        const temp = rut.split('-');
        let digito = temp[1];
        if(digito ==='k' || digito ==='K') digito = -1;
        const validaR = validarRut(rut);

        if(rut ===''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Rut no puede estar vacio'
            })
            return;
        }else if(!expresionRegularRut.test(rut)){          
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Formato incorrecto de rut'
            })
            return;
        }else if(validaR !== parseInt(digito)){ 
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut no válido'
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
        /* }else if(nomContacto ===''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo Contacto no puede estar vacio'
            })
            return; */
        }else if(!existe){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Rut ya existe'
            })
            return;
        }else if(checked && nomRsf==='' ){           
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Campo nombre RSF no puede estar vacio'
                    })
                    return;
        }else if( checked && dirRsf ===''){
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Campo Dirección no puede estar vacio'
                    })
                    return;
        }else if(checked && telRsf===''){
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Campo telefono no puede estar vacio'
                    })
                    return;
        }else{         
                try {
                    const nom = nombre.toLocaleUpperCase().trim();
                    const dir = direccion.toLocaleUpperCase().trim();
                    const nomrsf = nomRsf.toLocaleUpperCase().trim();
                    const dirrsf = dirRsf.toLocaleUpperCase().trim();
                    const telrsf = telRsf.toLocaleUpperCase().trim();
                    const corr = correo.toLocaleLowerCase().trim();
                    const ruts = rut.toLocaleUpperCase().trim();
                    AgregarClientesDb({
                        emp_id: users.emp_id,
                        rut:ruts,
                        nombre:nom,
                        direccion:dir,
                        telefono:telefono,
                        correo:corr,
                        nomrsf:nomrsf,
                        dirrsf:dirrsf,
                        telrsf:telrsf,
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
                        setNomRsf('');
                        setDirRsf('');
                        setTelRsf('');
                        setChecked(false)
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Cliente registrado exitosamente'
                         })
                        setFlag(!flag);
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
                <Formulario action='' >
                    <ContentElemen>
                        <Label>Rut</Label>
                        <Input
                            maxLength='10'
                            type='text'
                            name = 'rut'
                            placeholder = 'Ingrese Rut sin puntos'
                            value = { rut }
                            onChange = { handleChange }
                            /* onKeyDown={detectar} */
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
                        <Label>Responsable financiero?</Label>
                        <Input 
                            style={{width:"3%",color:"green"}}
                            type="checkbox"
                            checked={checked}                          
                            onChange={handleChek}
                            />                      
                    </ContentElemen>                    
                    
                        { checked ? 
                            <ContentElemen>
                                <Label>Nombre</Label>
                                <Input
                                    name="nombrersf"
                                    type="text"
                                    placeholder='Responsable financiero'
                                    value={nomRsf}
                                    onChange={handleChange}
                                />
                                <Label>Dirección</Label>
                                <Input
                                name="direccionrsf"
                                    type="text"
                                    placeholder='Ingres dirección'
                                    value={dirRsf}
                                    onChange={handleChange}
                                />
                                <Label>Telefono</Label>
                                <Input
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
                            
                </Formulario>
                <BotonGuardar onClick={handleSubmit}>Guardar</BotonGuardar> 
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
                                            <Table.Row key={index}>
                                                <Table.Cell>{item.nombre}</Table.Cell>
                                                <Table.Cell>{item.rut}</Table.Cell>       
                                                <Table.Cell>{item.direccion}</Table.Cell>       
                                                <Table.Cell>{item.telefono}</Table.Cell>       
                                                <Table.Cell><Link to={`/home/actualizacliente/${item.id}`}><FaIcons.FaRegEdit style={{ fontSize: '20px', color: 'green' }} />
                                                </Link></Table.Cell>       
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
    color: #ffffff;
    border-radius: 5px;
    border: none;
    margin: 0px 10px;
    padding: 5px 10px;

    &:hover{
        background-color: #83d310;
        }
`
