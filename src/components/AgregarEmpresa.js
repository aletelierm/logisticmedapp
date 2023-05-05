import React,{useEffect, useState, ChangeEvent} from 'react';
import styled from 'styled-components';
/* import { useNavigate } from 'react-router-dom'; */
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import AgregarEmpresaDb from '../firebase/AgregarEmpresaDb';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Alerta from './Alertas';
import * as MdIcons from 'react-icons/md';

const AgregarEmpresa = () => {

    /* const navigate = useNavigate(); */
    const user = auth.currentUser;    
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [ empresa, setEmpresa] = useState('');
    const [ leer, setLeer] = useState([])
    const [ alerta, cambiarAlerta] = useState({});
    const [ estadoAlerta, cambiarEstadoAlerta ] = useState(false);
    const [ pagina, setPagina ] = useState(0);
    const [ buscador, setBuscardor ] = useState('');

   

    const handleChange = (e)=>{
       setEmpresa(e.target.value) ;
       
    }

    const handleSubmit = (e)=>{
            e.preventDefault();           
            if(empresa ===''){                
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                tipo: 'error',
                mensaje: 'Input Empresa no puede estar vacio'
            })
                
            }else{
               
                AgregarEmpresaDb({
                    empresa: empresa,
                    userAdd: user.email,
                    userMod: user.email,                
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod
                })
                .then(()=>{
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                    tipo: 'exitoas',
                    mensaje: 'Empresa Registrada Correctamente'
            })
                    setEmpresa('');
                })
                
            }
            
    }

   /*  const volver = () => {
        navigate('/home/volver')
    } */

    const getData = async ()=>{
        const data = await getDocs(collection(db, "empresas"));
        setLeer(data.docs.map((doc)=>({...doc.data(),id: doc.id} )))
        
    }

    const filtroEmpresa = ()=>{
        if(buscador.length === 0)
          return leer.slice(pagina, pagina + 5);

        const nuevoFiltro = leer.filter(  emp => emp.empresa.includes( buscador));
        return nuevoFiltro.slice( pagina, pagina + 5);
        
    }

    const siguientePag = ()=>{
        if(leer.filter(  emp => emp.empresa.includes( buscador)).length > pagina + 5)
            setPagina( pagina + 5);
    }

    const paginaAnterior = ()=>{
        if (pagina > 0) setPagina( pagina - 5)

    }

    const onBuscarCambios = ( { target }: ChangeEvent<HTMLInputElement>)=>{
            setPagina(0);
            setBuscardor(target.value)

    }

    useEffect(()=>{
        getData();
    },[setEmpresa,empresa])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                    <Titulo>Registrar Empresas</Titulo>
            </ContenedorFormulario>
            
            <ContenedorFormulario>
                <Formulario onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Agregar Empresa</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Empresa'
                            name='empresa'
                            value={empresa}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <Boton>Agregar</Boton>
                </Formulario>
            </ContenedorFormulario>
          {/*   <ContenedorFormulario>
                <Input 
                    type='text'
                    placeholder='Buscar'
                    value={ buscador }
                    onChange={ onBuscarCambios }
                />
            </ContenedorFormulario> */}
            <ListarProveedor>
                <ContentElemen>
                    <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{fontSize:'30px'}}/></Boton>
                    <Titulo>Listado de Empresas</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{fontSize:'30px'}}/></Boton>
                </ContentElemen>
                <ContentElemen>
                    <Input style={{width: '100%'}}
                        type='text'
                        placeholder='Buscar'
                        value={ buscador }
                        onChange={ onBuscarCambios }
                    />
                </ContentElemen>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Empresa</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioAdd</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            
                        filtroEmpresa().map((item, index)=>{                           
                            
                                return(
                                    
                                    <Table.Row>
                                    <Table.Cell>{item.id}</Table.Cell>
                                    <Table.Cell>{item.empresa}</Table.Cell>
                                    <Table.Cell>{item.userAdd}</Table.Cell>
                                    <Table.Cell><Boton /* onClick={volver} */>Modif</Boton></Table.Cell>
                                    </Table.Row>
                                )
                        })}
                        
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
};

const Titulo = styled.h2`
    color:  #83d394;
`
const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const ContentElemen = styled.div`
    display: flex;
    text-align: center;
    padding: 7px;
    margin-right: 30px;
    align-items: center;
    justify-content: space-between;

    `

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const Formulario = styled.form`
    display: flex;
    padding: 0px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    
`

const Label = styled.label`
        padding: 10px;
        font-size: 15px;
`

const Boton = styled.button`
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-top: 5px;
        margin-left: 20px;
        cursor: pointer;
`

export default AgregarEmpresa;