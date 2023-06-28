import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth } from '../firebase/firebaseConfig';
import ActualizarEmpresaDb from '../firebase/ActualizarEmpresaDb';
import Alerta from './Alertas';
import useObtenerEmpresa from '../hooks/useObtenerEmpresa';
import { useNavigate, useParams } from 'react-router-dom';

const ActualizaEmpresa = () => {
    /* const navigate = useNavigate(); */
    const user = auth.currentUser;  
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [empresas] = useObtenerEmpresa(id);

    const [nuevaEmpresa, setNuevaEmpresa] = useState();   
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
   

    const volver = () => {
        navigate('/home/configuracion/agregarempresa')
    }
    const handleChange = (e) => {
        setNuevaEmpresa(e.target.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        // Consulta si exite campo en el arreglo
       

        // Realiza consulta al arreglo leer para ver si existe el nombre del campo
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
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Actulizar Empresas</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario onSubmit={handleSubmit}>
                    <ContentElemen>
                    <Input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Empresa'
                        name='empresa'
                        value={nuevaEmpresa}
                        onChange={handleChange}
                    />
                    <BotonGuardar >Actualizar</BotonGuardar>
                    <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                    </ContentElemen>
                </Formulario>
            </ContenedorFormulario>           
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

export default ActualizaEmpresa;

const Titulo = styled.h2`
    color:  #83d394;
`
const ContenedorProveedor = styled.div`
    width: 70%;
`

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`


const Formulario = styled.form`
    
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 16px;
    transition: all.3s ease all;
    width: 100%;
    text-align: center;
`
const ContentElemen = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`
/* const Label = styled.label`
        padding: 10px;
        font-size: 15px;
` */

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
    }`