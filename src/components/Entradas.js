import React, { useState } from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
/* import { useNavigate } from 'react-router-dom'; */
import { auth } from '../firebase/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { TipDoc } from './TipDoc'

const Entradas = () => {

    const [nomTipDoc, setNomTipDoc] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [proveedor, setProveedor] = useState([]);
    const [nomProveedor, setNomProveedor] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [nomEquipo, setNomEquipo] = useState([]);

    // //Lee datos de Proveedores
    // const getProveedor = async () => {
    //     const dataProveedor = await getDocs(collection(db, "proveedores"));
    //     setProveedor(dataProveedor.docs.map((prov) => ({ ...prov.data(), id: prov.id })))
    // }

    // //Lee datos de Proveedores
    // const getEquipo = async () => {
    //     const dataEquipo = await getDocs(collection(db, "crearequipos"));
    //     setEquipo(dataEquipo.docs.map((eq) => ({ ...eq.data(), id: eq.id })))
    // }

    // useEffect(()=>{
    //     getProveedor();
    //     getEquipo();
    // },[])

    // const equipo = [
    //     { key: '1', value: '1', text: 'DISPOSITIVOS DE INFUSION' },
    //     { key: 'ax', value: 'ax', text: 'MOTOR DE ASPIRACION' }
    // ]

    /*  const navigate = useNavigate(); */
    const user = auth.currentUser;

    /*  const volver = () => {
         navigate('/home/actualiza')
     } */

    return (
        <ContenedorProveedor>
            <h1>Recepcion de Equipos</h1>
            <ContenedorFormulario>
                <Formulario action=''>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Tipo de Documento</Label>
                            <Select value={nomTipDoc} onChange={ev => setNomTipDoc(ev.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipDoc.map((d) => {
                                    return (<option key={d.key}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>N° de Documento</Label>
                            <Input
                                type='text'
                                name='NumDoc'
                                placeholder='Ingrese N° Documento'
                                value={numDoc}
                                // onChange={handleChange}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Proveedor</Label>
                            {/* <Select placeholder='Seleccione Proveedor' options={proveedores} /> */}
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Fecha Ingreso</Label>
                            <Input type='date' />
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Equipo</Label>
                            <Select placeholder='Seleccione Familia' options={equipo} />
                            <Icon><FontAwesomeIcon icon={faPlus} /></Icon>
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ListarEquipos>
                            <Table singleLine>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>N°</Table.HeaderCell>
                                        <Table.HeaderCell>Familia</Table.HeaderCell>
                                        <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                                        <Table.HeaderCell>Marca</Table.HeaderCell>
                                        <Table.HeaderCell>Modelo</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>1</Table.Cell>
                                        <Table.Cell>DISPOSITIVOS DE INFUSION</Table.Cell>
                                        <Table.Cell>BOMBA ENTERAL</Table.Cell>
                                        <Table.Cell>ABBOTT</Table.Cell>
                                        <Table.Cell>FREEGO</Table.Cell>
                                    </Table.Row>

                                    <Table.Row>
                                        <Table.Cell>2</Table.Cell>
                                        <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                        <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                                        <Table.Cell>SUSED</Table.Cell>
                                        <Table.Cell>TRX-800</Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                            </Table>
                        </ListarEquipos>
                    </ContentElemen>

                    <Boton>Guardar</Boton>
                </Formulario>
            </ContenedorFormulario>



            <ListarProveedor>
                <h2>Listado Equipos Recepcionados</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Equipo:</Table.HeaderCell>
                            <Table.HeaderCell>Familia</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                            <Table.HeaderCell>Marca</Table.HeaderCell>
                            <Table.HeaderCell>Modelo</Table.HeaderCell>
                            <Table.HeaderCell>Acción</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>DISPOSITIVOS DE INFUSION</Table.Cell>
                            <Table.Cell>BOMBA ENTERAL</Table.Cell>
                            <Table.Cell>ABBOTT</Table.Cell>
                            <Table.Cell>FREEGO</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                            <Table.Cell>MOTOR DE ASPIRACION</Table.Cell>
                            <Table.Cell>SUSED</Table.Cell>
                            <Table.Cell>TRX-800</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </ListarProveedor>

            {console.log(user.uid)}
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

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
    padding: 5px 20px;
`

const ContentElemenSelect = styled.div`
    padding: 20px;
`

const Select = styled.select`
border: 2px solid #d1d1d1;
border-radius: 10px;
padding: 5px;
width: 200px;
`

const Icon = styled.div`
    display: inline-block;
    margin-left: 20px;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const ListarEquipos = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.40);;
`

const Formulario = styled.form``

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
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
`

export default Entradas;