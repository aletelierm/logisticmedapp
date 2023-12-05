import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import ActualizarEmpresaDb from '../firebase/ActualizarEmpresaDb';
import Alerta from './Alertas';
import useObtenerEmpresa from '../hooks/useObtenerEmpresa';
import { useNavigate, useParams } from 'react-router-dom';
import {Contenedor, ContentElemenAdd, Titulo, InputAdd, BotonGuardar} from '../elementos/General';
import {ContenedorCliente, Formulario} from '../elementos/CrearEquipos';

const ActualizaEmpresa = () => {
    const user = auth.currentUser;  
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [empresas] = useObtenerEmpresa(id);
    const [nuevaEmpresa, setNuevaEmpresa] = useState();   
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);   

    const volver = () => {
        navigate('/configuracion/agregarempresa')
    }
    const handleChange = (e) => {
        setNuevaEmpresa(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        
        if (nuevaEmpresa ==='') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo no puede estar vacio'
            })
        } else{
            try {
                const emp = nuevaEmpresa.toLocaleUpperCase();
                ActualizarEmpresaDb({
                    id: id,
                    familia: emp,
                    userMod: user.email,
                    fechaMod: fechaMod,
                })
                .catch((error) => { console.log(error) })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Empresa Actualizada exitosamente'
                })
                return;
            } catch (error) {
            }
        }    
    }

    useEffect(() => {
        if (empresas) {
            setNuevaEmpresa(empresas.empresa)
        } else {
            navigate('/')
        }        
    }, [empresas, navigate])

    return (
        <ContenedorCliente>
            <Contenedor>
                <Titulo>Actulizar Empresas</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario onSubmit={handleSubmit}>
                    <ContentElemenAdd>
                    <InputAdd
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Empresa'
                        name='empresa'
                        value={nuevaEmpresa}
                        onChange={handleChange}
                    />
                    <BotonGuardar >Actualizar</BotonGuardar>
                    <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                    </ContentElemenAdd>
                </Formulario>
            </Contenedor>           
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorCliente>
    );
};

export default ActualizaEmpresa;