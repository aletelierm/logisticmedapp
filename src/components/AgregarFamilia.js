import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgregarFamiliaDb from '../firebase/AgregarFamiliaDb';
import Alertas from './Alertas';
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react'
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { BiAddToQueue } from "react-icons/bi";
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import Editar from './Editar';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const AgregarFamilia = () => {
    // const navigate = useNavigate();
    const user = auth.currentUser;
    const {users} = useContext(UserContext);
    console.log('obtener usuario contexto global:',users);
    let fechaAdd = new Date();
    let fechaMod = new Date();


    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [familia, setFamilia] = useState('');
    const [leer, setLeer] = useState([]);
    const [leer2, setLeer2] = useState([]);
    const [pagina, setPagina] = useState(0);
    const [buscador, setBuscardor] = useState('');
    const [flag, setFlag] = useState(false);


    const handleChange = (e) => {
        setFamilia(e.target.value);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        console.log('mostrar familia', familia.toLocaleUpperCase().trim());        
        console.log('mostrar leer', leer);

        // Consulta si exite campo en el arreglo
        const existe = leer.filter(fam => fam.familia.includes(familia.toLocaleUpperCase().trim())).length > 0;
        console.log('ver si existe:',existe);

        // Realiza consulta al arreglo leer para ver si existe el nombre del campo
        if (existe) {

            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ya existe esta Familia'
            })

        } else if (familia === '') {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'No ha ingresado una Familia'
            })

        } else {
            const fam = familia.toLocaleUpperCase().trim()
            console.log(fam);
            AgregarFamiliaDb({
                familia: fam,
                userAdd: user.email,
                userMod: user.email,
                fechaAdd: fechaAdd,
                fechaMod: fechaMod,
                emp_id: users.emp_id
            })
                .then(() => {
                    /* ver si se puede agregar item al arreglo de obejetos
                    setLeer(leer.map((doc, index) => ({ ...doc,
                        id: 11,
                        familia: fam,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod  })));   */
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Familia Ingresada Correctamente'
                    })
                    setFamilia('');
                    setFlag(!flag)
                    console.log('consulta Flag', flag);
                })
        }
    }
    

    // const getData = async () => {
    //     const data = await getDocs(collection(db, "familias"));
    //     setLeer2(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
    //     setLeer(leer2.filter(emp => emp.includes(users.emp_id)));
        
    //     // setFlag(!flag)
    //     console.log('Mostrar leer', leer.emp_id);
    //     console.log('mostrar leer2', leer2);
    // }

    const getData = async () => {
        const traerFam = collection(db, 'familias');
        const dato = query(traerFam, where('emp_id', '==', users.emp_id));
        // setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));

        const data = await getDocs(dato)
        data.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          });
        setLeer(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })));
        
    }

    // const lee = leer2.filter(emp => emp.emp_id == users.emp_id);

    const filtroFamilia = () => {
        const buscar = buscador.toLocaleUpperCase();
        if (buscar.length === 0)
            return leer.slice(pagina, pagina + 5);
        const nuevoFiltro = leer.filter(fam => fam.familia.includes(buscar ));
        return nuevoFiltro.slice(pagina, pagina + 5);
    }

    const siguientePag = () => {
        if (leer.filter(fam => fam.familia.includes(buscador)).length > pagina + 5)
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

    }, [flag, setFlag])


    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Familia de Equipos</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario action='' onSubmit={handleSubmit}>
                    <Input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='Ingrese Familia Equipamiento Médico'
                        name='familia'
                        value={familia}
                        onChange={handleChange}
                    />
                    <Boton>
                        <BiAddToQueue style={{ fontSize: '32px', color: 'green' }} />
                    </Boton>
                </Formulario>
            </ContenedorFormulario>

            <ListarProveedor>
                <ContentElemen>
                    <Boton onClick={paginaAnterior}><MdIcons.MdSkipPrevious style={{ fontSize: '30px', color: 'green' }} /></Boton>
                    <Titulo>Listado de Familias</Titulo>
                    <Boton onClick={siguientePag}><MdIcons.MdOutlineSkipNext style={{ fontSize: '30px', color: 'green' }} /></Boton>
                </ContentElemen>

                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar Familia'
                        value={buscador}
                        onChange={onBuscarCambios}
                    />
                </ContentElemen>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioAdd</Table.HeaderCell>
                            <Table.HeaderCell>UsuarioMod</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {filtroFamilia().map((item) => {
                            return (

                                <Editar
                                    key={item.id}
                                    id={item.id}
                                    id2={item.id2}
                                    familia={item.familia}
                                    userAdd={item.userAdd}
                                    userMod={item.userMod}
                                    setFamilia={setFamilia}
                                />
                            )
                        })}
                    </Table.Body>
                </Table>

            </ListarProveedor>
            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
    background-color: #ffff;
`

const Titulo = styled.h2`
    color:  #83d394;
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
    background-color: #ffff;
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
    padding: 5px 30px;
`

const Boton = styled.button`
        background-color: #ffffff;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin: 0 10px;
        cursor: pointer;
`

export default AgregarFamilia;