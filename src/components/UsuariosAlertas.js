import React, { useEffect, useState } from 'react';
import Alerta from './Alertas'
import { db, auth } from './../firebase/firebaseConfig';
import { collection, getDocs} from 'firebase/firestore';
import AgregarAlertas from '../firebase/AgregarUsuariosAlertas';
import { Table } from 'semantic-ui-react';
import * as FaIcons from 'react-icons/fa';
import { FaRegEdit } from "react-icons/fa";
import ExportarExcel from '../funciones/ExportarExcel';
import {ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar} from '../elementos/General'
import {ContentElemen, Formulario, Input, Label} from '../elementos/CrearEquipos'
import Swal from 'sweetalert2';

export const UsuariosEnvios = () => {
    let fechaactual = new Date();
    const userAuth = auth.currentUser.email;
    const useraddmod = userAuth;
   /*  const { users } = useContext(UserContext); */

    const [correo, setCorreo] = useState('');
    const [ isCheckedSalida, setIsCheckedSalida] = useState(false);
    const [ isCheckedRfid, setIsCheckedRfid] = useState(false);
    const [ isCheckedConfirma, setIsCheckedConfirma] = useState(false);    
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');   
    const [entidad, setEntidad] = useState('');
    const [epmId, setEmpId] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioAlert, setUsuarioAlert] = useState([]);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [flag, setFlag] = useState(false);
  
    //Lee datos de los usuarios
    const getUsuarios = async () => {
        const dataUsuarios = await getDocs(collection(db, "usuarios"));
        setUsuarios(dataUsuarios.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
    }
     //Lee datos de usuario y alertas
     const getUsuarioAlert = async () => {
        const dataAlert = await getDocs(collection(db, "usuariosalertas"));
        setUsuarioAlert(dataAlert.docs.map((emp, index) => ({ ...emp.data(), id: emp.id, id2: index + 1 })))
     }

    useEffect(() => {        
        getUsuarios();
        getUsuarioAlert();
    }, [flag])

    //Lee input de formulario
    const handleChange = (e) => {
        switch (e.target.name) {
            case 'email':
                setCorreo(e.target.value);
                break;
            default:
                break;
        }
      
    }

    const handleCheck = (ev, checkboxNumber) =>{
        const isChecked = ev.target.checked;
        switch (checkboxNumber){
            case 1:
                setIsCheckedSalida(isChecked);
                break;
            case 2:
                setIsCheckedRfid(isChecked);
                break;
            case 3:
                setIsCheckedConfirma(isChecked);
                break;
                default:
                break;
        }
      

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        const existeCorreo = usuarios.filter(corr => corr.correo === correo);
        const existeEnAlerta = usuarioAlert.filter(existe => existe.correo === correo);
      

        if(correo === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({                
                tipo: 'error',
                mensaje: 'Campo Correo no puede estar vacio'
            })
        }else if (existeCorreo.length === 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No existe usuario con ese correo'
            })
         }else if(existeEnAlerta.length > 0){
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya esta creado este usuarios y sus alertas...'
                })
                setCorreo('');
                setNombre('');
                setApellido('');
                setEntidad('');
            }else{
                setCorreo(existeCorreo[0].correo);
                setNombre(existeCorreo[0].nombre);
                setApellido(existeCorreo[0].apellido);
                setEntidad(existeCorreo[0].empresa)
                setEmpId(existeCorreo[0].emp_id)
                try {
                    AgregarAlertas({
                        userAdd: useraddmod,
                        userMod: useraddmod, 
                        fechaAdd: fechaactual,
                        fechaMod: fechaactual,
                        emp_id: epmId,
                        empresa: entidad,
                        nombre: nombre +" "+apellido,
                        correo: correo,
                        salida:isCheckedSalida,
                        rfid: isCheckedRfid,
                        confirma: isCheckedConfirma
                    })
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({                
                        tipo: 'exito',
                        mensaje: 'Alertas asignadas correctamente'
                    })                    
                    setCorreo('');
                    setNombre('');
                    setApellido('');
                    setEntidad('');
                    setFlag(!flag)
                    } catch (error) {
                            Swal.fire('Se ha producido un error grave. Llame al Administrador',error); 
                    }
                }   
        
    }

    const detectarCorreo  = (e)=>{
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        const existeCorreo = usuarios.filter(corr => corr.correo === correo);
        const existeEnAlerta = usuarioAlert.filter(existe => existe.correo === correo);
        if (e.key === 'Enter' || e.key === 'Tab') {
            if(correo===''){
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Campo Correo no puede estar vacío'
                })
            }else if (existeCorreo.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe usuario con ese correo'
                })
            }else if(existeEnAlerta.length > 0){               
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Ya esta creado este usuarios y sus alertas...'
                })
                setCorreo('');
                setNombre('');
                setApellido('');
                setEntidad('');
            }else {
                setCorreo(existeCorreo[0].correo);
                setNombre(existeCorreo[0].nombre);
                setApellido(existeCorreo[0].apellido);
                setEntidad(existeCorreo[0].empresa)
                setEmpId(existeCorreo[0].emp_id)
             
               
            }
        }
    }

    

    //Exportar a excel los equipos
    const ExportarXls = () => {
        //Campos a mostrar en el excel   
        const columnsToShow = ['empresa', 'nombre', 'correo', 'salida','rfid','confirma']
        //Llamar a la funcion con props: array usuariosalertas y array columnas
        const excelBlob = ExportarExcel(usuarioAlert, columnsToShow);
        // Crear un objeto URL para el Blob y crear un enlace de descarga
        const excelURL = URL.createObjectURL(excelBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = excelURL;
        downloadLink.download = 'data.xlsx';
        downloadLink.click();
    }

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Configuración de Alertas</Titulo>
            </Contenedor>
            <Contenedor>
                <Formulario action='' >
                    <ContentElemen>
                        <Label>Email</Label>
                        <Input                          
                            type='email'
                            name='email'
                            placeholder='Ingrese Email'
                            value={correo}
                            onChange={handleChange}
                            onKeyDown={detectarCorreo}                     
                        />
                        <Label>Nombre</Label>
                        <Input 
                            type='nombre'
                            name='nombre'
                            value={nombre + " " + apellido}
                            disabled                           
                        />
                        <Label>Empresa</Label>
                        <Input 
                            type='empresa'
                            name='empresa'
                            value={entidad}
                            disabled                          
                        />
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Salidas</Label>
                        <Input
                            style={{width:"3%"}}
                            type='checkbox'
                            name='salida'                                                 
                            onChange={(ev) => handleCheck(ev, 1)}
                            checked={isCheckedSalida}
                        />
                        <Label>Rfid</Label>
                        <Input
                            style={{width:"3%"}}
                            type='checkbox'
                            name='rfid'                          
                            onChange={(ev) => handleCheck(ev, 2)}
                            checked={isCheckedRfid}

                        />
                        <Label>Confirmacion</Label>
                        <Input
                            style={{width:"3%"}}
                            type='checkbox'
                            name='confirma'                          
                            onChange={(ev) => handleCheck(ev, 3)}
                            checked={isCheckedConfirma}
                        />
                    </ContentElemen>
                    
                </Formulario>
                <BotonGuardar onClick={handleSubmit}>Guardar</BotonGuardar>
            </Contenedor>
            <ListarProveedor>
                
                    {/* <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                    <Titulo>Listado Usuarios y Alertas</Titulo>
                    {/* <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: '#328AC4' }} /></Boton> */}
                
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Usuario'
                        /* value={buscador}
                        onChange={onBuscarCambios} */
                    />
                    <FaIcons.FaFileExcel onClick={ExportarXls} style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Proveedores a Excel' />
                </ContentElemen>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Correo</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell>Empresa</Table.HeaderCell>
                            <Table.HeaderCell>Salidas</Table.HeaderCell>
                            <Table.HeaderCell>Rfid</Table.HeaderCell>
                            <Table.HeaderCell>Confirma</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            usuarioAlert.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{item.correo}</Table.Cell>
                                        <Table.Cell>{item.nombre}</Table.Cell>                                       
                                        <Table.Cell>{item.empresa}</Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.salida} disabled style={{width:'100%'}}/></Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.rfid} disabled style={{width:'100%'}}/></Table.Cell>
                                        <Table.Cell><Input type='checkbox' checked={item.confirma} disabled style={{width:'100%'}}/></Table.Cell>                                                                          
                                        <Table.Cell style={{textAlign: 'center'}}>
                                        <FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }}/>
                                            {/* <Link to={`/actualizaproveedor/${item.id}`}>
                                                <FaRegEdit style={{ fontSize: '20px', color: '#328AC4' }} />
                                            </Link> */}
                                        </Table.Cell>           
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
    )
}


export default UsuariosEnvios;