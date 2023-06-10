import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
/* import { useNavigate } from 'react-router-dom'; */
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import * as FaIcons from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { TipDoc, TipoIn } from './TipDoc'


const Entradas = () => {
    const user = auth.currentUser;

    const [nomTipDoc, setNomTipDoc] = useState([]);
    const [numDoc, setNumDoc] = useState('');
    const [proveedor, setProveedor] = useState([]);
    const [nomProveedor, setNomProveedor] = useState([]);
    // const [nomTipTrans, setNomTipTrans] = useState([]);
    const [nomTipoInOut, setNomTipoInOut] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [nomEquipo, setNomEquipo] = useState([]);

    //Lee datos de Proveedores
    const getProveedor = async () => {
        const dataProveedor = await getDocs(collection(db, "proveedores"));
        setProveedor(dataProveedor.docs.map((prov) => ({ ...prov.data(), id: prov.id })))
    }

    //Lee datos de Equipos
    const getEquipo = async () => {
        const dataEquipo = await getDocs(collection(db, "crearequipos"));
        setEquipo(dataEquipo.docs.map((eq) => ({ ...eq.data(), id: eq.id })))
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // Consulta si exite campo en el arreglo
    //     const existe = proveedor.filter(prov => prov.proveedor.includes());
    //     console.log('ver si existe:',existe);

    //     // Realiza consulta al arreglo Proveedor si 
    //     if (existe) {


    //     } else {
    //         alert('No existe Proveedor')
    //     }
    // }

    useEffect(() => {
        getProveedor();
        getEquipo();
    }, [])




    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <h1>Recepcion de Equipos</h1>
            </ContenedorFormulario>

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
                                onChange={e => setNumDoc(e.target.value)}
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label >Entidad</Label>
                            <Input
                                type='text'
                                name='Proveedor'
                                onChange={e => setNomProveedor(e.target.value)} />
                        </ContentElemenSelect>
                    </ContentElemen>

                    <ContentElemen>
                        <ContentElemenSelect>
                            <Label>Fecha Ingreso</Label>
                            <Input type='date' />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label>Tipo Entrada</Label>
                            <Select value={nomTipoInOut} onChange={e => setNomTipoInOut(e.target.value)}>
                                <option>Selecciona Opción:</option>
                                {TipoIn.map((d) => {
                                    return (<option key={d.id}>{d.text}</option>)
                                })}
                            </Select>
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Boton>Guardar</Boton>
                        </ContentElemenSelect>

                    </ContentElemen>
                </Formulario>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Formulario>
                    <ContentElemen >

                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Precio</Label>
                            <Input placeholder='Ingrese Valor'
                            />
                        </ContentElemenSelect>

                        <ContentElemenSelect>
                            <Label style={{ marginRight: '10px' }} >Equipo</Label>
                            <Input onChange={e => setNomEquipo(e.target.value)}
                                placeholder='Escanee o ingrese Equipo'
                            />
                        </ContentElemenSelect>

                        <Icon>
                            <FaIcons.FaSearch style={{ fontSize: '30px', color: 'green', padding: '5px', marginRight: '15px', marginTop: '16px' }} />
                            <IoMdAdd style={{ fontSize: '36px', color: 'green', padding: '5px', marginRight: '15px', marginTop: '14px' }} />
                        </Icon>

                    </ContentElemen>
                </Formulario>

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

                <Boton>Guardar</Boton>
            </ContenedorFormulario>


            <ListarProveedor>
                <h2>Cabecera de Documentos</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Folio</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Entrada</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>127</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>416509</Table.Cell>
                            <Table.Cell>9.345.654-6 </Table.Cell>
                            <Table.Cell>ARQUIMED </Table.Cell>
                            <Table.Cell>07-06-2023</Table.Cell>
                            <Table.Cell>COMPRA</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>486</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>218745</Table.Cell>
                            <Table.Cell>6.140.830-4 </Table.Cell>
                            <Table.Cell>OXIMED</Table.Cell>
                            <Table.Cell>07-06-2023</Table.Cell>
                            <Table.Cell>COMPRA</Table.Cell>
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
    justify-content: space-evenly;
    padding: 5px 10px;
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
    display: flex;
    // justify-content: space-between;
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
    margin: 20px 0;
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