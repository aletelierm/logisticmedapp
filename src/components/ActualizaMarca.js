import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import Alertas from './Alertas';
import ActualizarMarcaDb from '../firebase/ActualizarMarcaDb';
import useObtenerMarca from '../hooks/useObtenerMarca';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {ContenedorCliente, Formulario} from '../elementos/CrearEquipos';
import {Contenedor, ContentElemenAdd, Titulo, InputAdd, BotonGuardar} from '../elementos/General';

const ActualizaMarca = () => {
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaMod = new Date();

    const navigate = useNavigate();
    const { id } = useParams();
    const [marca] = useObtenerMarca(id);

    const [nuevoCampo, setNuevoCampo] = useState();
    const [leer, setLeer] = useState([]);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);

    const volver = () => {
        navigate('/misequipos/agregarmarca')
    }

    const handleChange = (e) => {
        setNuevoCampo(e.target.value)
    }

    const getData = async () => {
        const traerMar = collection(db, 'marcas');
        const dato = query(traerMar, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        const existe = leer.filter(mar => mar.marca === nuevoCampo.toLocaleUpperCase().trim()).length === 0;        
        if (!existe) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe esta Marca'
            })
        } else if (nuevoCampo === '') {
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

    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ContenedorCliente>
            <Contenedor>
                <Titulo>Actualiazar Marca</Titulo>
            </Contenedor>

            <Contenedor>
                <Formulario action='' onSubmit={handleSubmit} >
                    <ContentElemenAdd>
                        <InputAdd
                            type='text'
                            name='marca'
                            placeholder='Ingrese Marca Equipamiento Médico'
                            value={nuevoCampo}
                            onChange={handleChange}
                        />
                        <BotonGuardar >Actualizar</BotonGuardar>
                        <BotonGuardar onClick={volver}>Volver</BotonGuardar>
                    </ContentElemenAdd>
                </Formulario>
            </Contenedor>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorCliente >
    )
}

export default ActualizaMarca;