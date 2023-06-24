import React, { useState, useEffect } from 'react'
import { auth } from '../firebase/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components';
import Alertas from './Alertas';
import ActualizarMarcaDb from '../firebase/ActualizarMarcaDb';
import useObtenerMarca from '../hooks/useObtenerMarca';


const ActualizaMarca = () => {
    const user = auth.currentUser;
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [marca] = useObtenerMarca(id);

    const [nuevoCampo, setNuevoCampo] = useState();
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);

    const volver = () => {
        navigate('/home/misequipos/agregarmarca')
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
                const mar = nuevoCampo.toLocaleUpperCase();
                ActualizarMarcaDb({
                    id: id,
                    marca: mar,
                    userMod: user.email,
                    fechaMod: fechaMod,
                })
                    .catch((error) => { console.log(error) })
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'exito',
                    mensaje: 'Marca Actualizada exitosamente'
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
        if (marca) {
            setNuevoCampo(marca.marca)
        } else {
            navigate('/')
        }
        console.log('useeffeect', );
    }, [marca, navigate])


    return (

        <ContenedorCliente>
            <ContenedorFormulario>
                <Titulo>Actualiazar Marca</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit} >
                    <ContentElemen>
                        <Input
                            type='text'
                            name='marca'
                            placeholder='Ingrese Marca Equipamiento Médico'
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

const Formulario = styled.form``

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
        background - color: #83d310;
    }
`


export default ActualizaMarca;