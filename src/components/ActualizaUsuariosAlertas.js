import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Alerta from './Alertas'
import { auth } from '../firebase/firebaseConfig';
import {ContenedorProveedor, Contenedor, Titulo, BotonGuardar} from '../elementos/General'
import {ContentElemen, Formulario, Input, Label} from '../elementos/CrearEquipos'
import useObtenerUsuarioAlertas from '../hooks/useObtenerUsuarioAlertas';
import ActualizaUsuariosAlertasDb from '../firebase/ActualizarUsuariosAlertasDb';
import Swal from 'sweetalert2';

export const ActulizaUsuariosAlertas = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [usuariosAlertas] = useObtenerUsuarioAlertas(id);

    let fechaactual = new Date();
    const userAuth = auth.currentUser.email;
    const useraddmod = userAuth;
   /*  const { users } = useContext(UserContext); */   

    const [correo, setCorreo] = useState('');
    const [ isCheckedSalida, setIsCheckedSalida] = useState(false);
    const [ isCheckedRfid, setIsCheckedRfid] = useState(false);
    const [ isCheckedConfirma, setIsCheckedConfirma] = useState(false);    
    const [nombre, setNombre] = useState('');
    const [entidad, setEntidad] = useState(''); 
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);  

    useEffect(() => {
        if (usuariosAlertas) {           
            setNombre(usuariosAlertas.nombre);           
            setCorreo(usuariosAlertas.correo);
            setEntidad(usuariosAlertas.empresa);  
            setIsCheckedSalida(usuariosAlertas.salida);
            setIsCheckedConfirma(usuariosAlertas.confirma);
            setIsCheckedRfid(usuariosAlertas.rfid);
        } else {
            navigate('/')
        }
    }, [usuariosAlertas, navigate])  

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
        
        try {
            ActualizaUsuariosAlertasDb({
                id: id,
                salida: isCheckedSalida,
                rfid: isCheckedRfid,
                confirma: isCheckedConfirma,
                userMod: useraddmod ,
                fechaMod: fechaactual
            })
            cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Cofiguración de Alertas Actualizada Correctamente'
                })
                return;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador',error)
        }      
    }

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Actualización de Alertas</Titulo>
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
                            disabled
                        />
                        <Label>Nombre</Label>
                        <Input 
                            type='nombre'
                            name='nombre'
                            value={nombre}
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
                <BotonGuardar onClick={handleSubmit}>Actualizar</BotonGuardar>
                <BotonGuardar onClick={()=> navigate('/configuracion/envios')}>Volver</BotonGuardar>
            </Contenedor>
            
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    )
}

export default ActulizaUsuariosAlertas;