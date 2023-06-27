import React, { useState, useEffect } from 'react'
import { auth } from '../firebase/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alertas from './Alertas';
import ActualizarFamiliaDb from '../firebase/ActualizarFamiliaDb';
import useObtenerFamilia from '../hooks/useObtenerFamilia';


const ActualizaFamilia = () => {
    const user = auth.currentUser;
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [familia] = useObtenerFamilia(id);

    const [nuevoCampo, setNuevoCampo] = useState();
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);

    const volver = () => {
        navigate('/home/misequipos/agregarfamilia')
    }


    const handleChange = (e) => {
        setNuevoCampo(e.target.value)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (nuevoCampo === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Campo no puede estar vacio'
            })
            return;
        } else {
            try {
                const fam = nuevoCampo.toLocaleUpperCase();
                ActualizarFamiliaDb({
                    id: id,
                    familia: fam,
                    userMod: user.email,
                    fechaMod: fechaMod,
                })
                .catch((error) => { console.log(error) })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Familia Actualizada exitosamente'
                })
                return;

            } catch (error) {
                console.log('se produjo un error al guardar', error);
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: error
                })
            }
        }
    }

    useEffect(() => {
        if (familia) {
            setNuevoCampo(familia.familia)
        } else {
            navigate('/')
        }
        console.log('useeffeect', );
    }, [familia, navigate])


    return (

        <ContenedorCliente>
            <ContenedorFormulario>
                <Titulo>Actualiazar Familia</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit} >
                    <ContentElemen>
                        <Input
                            type='text'
                            name='familia'
                            placeholder='Ingrese Familia Equipamiento Médico'
                            value={nuevoCampo}
                            onChange={handleChange}
                        />
                        <BotonGuardar >Actualizar</BotonGuardar>
                        <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                    </ContentElemen>
                </Formulario>
            </ContenedorFormulario>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />

        </ContenedorCliente >
    )
}


const Titulo = styled.h2`
    color:  #83d394;
`

const ContenedorCliente = styled.div`
width: 70%;
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
    padding: 5px 10px;
    font-size: 16px;
    transition: all.3s ease all;
    width: 100%;
    text-align: center;

    &:focus{
        border: 3px solid #83d394;
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


export default ActualizaFamilia;