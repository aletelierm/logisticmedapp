import React from 'react';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';

const Clientes = () => {
    
    const navigate = useNavigate();
    const user = auth.currentUser;

    const volver = ()=>{
        navigate('/home/actualizacliente')
    }

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Mis Clientes</Titulo>
            </ContenedorFormulario>
           
            <ContenedorFormulario>
                <Formulario action=''>
                    <ContentElemen>
                        <Label>Rut</Label>
                        <Input type='number'/>
                        <Label>Nombre</Label>
                        <Input/>
                        <Label >Dirección</Label>
                        <Input/>
                    </ContentElemen>
                    <ContentElemen>
                        <Label >Telefono</Label>
                        <Input type='number'/>
                        <Label>Email</Label>
                        <Input  type='email'/>
                        <Label>Nombre Contacto</Label>
                        <Input/>  
                    </ContentElemen>
                    <Boton>Guardar</Boton>              
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <Titulo>Listado Clientes</Titulo>
                <Table singleLine>
                            <Table.Header>
                                 <Table.Row>
                                    <Table.HeaderCell>Nombre Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Rut</Table.HeaderCell>        
                                    <Table.HeaderCell>Direccion</Table.HeaderCell>        
                                    <Table.HeaderCell>Telefono</Table.HeaderCell>        
                                    <Table.HeaderCell>Accion</Table.HeaderCell>        
                                    </Table.Row>
                            </Table.Header>

                            <Table.Body>
                               
                                        <Table.Row>
                                            <Table.Cell>Catalina Astudillo</Table.Cell>
                                            <Table.Cell>1-9</Table.Cell>       
                                            <Table.Cell>Chañaral Norte 1853</Table.Cell>       
                                            <Table.Cell>Catm@gmail.com</Table.Cell>       
                                            <Table.Cell><Boton onClick={volver}>Modif</Boton></Table.Cell>       
                                        </Table.Row>  
                                           
           
                            </Table.Body>
                </Table>
            </ListarProveedor>
            {console.log(user.uid)}
        </ContenedorProveedor>
    );
};

export default Clientes;

const Titulo = styled.h2`
    color:  #83d394;
`
const ContenedorProveedor = styled.div`
   
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

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`
const Formulario = styled.form`

`

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