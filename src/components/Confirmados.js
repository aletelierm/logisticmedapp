/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import styled from 'styled-components';
// import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
// import { auth } from '../firebase/firebaseConfig';
import * as FaIcons from 'react-icons/fa';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';


const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    // const user = auth.currentUser;
    // const { users } = useContext(UserContext);
    // let fechaAdd = new Date();
    // let fechaMod = new Date();

    // const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    // const [alerta, cambiarAlerta] = useState({});


    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                <Titulo>Confirmacion de Entrega</Titulo>
            </ContenedorFormulario>

            <ContenedorFormulario>
                <Titulo>Guia a Entregar</Titulo>
                <ContentElemen>
                    <Table singleLine style={{ textAlign: 'center' }}>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Guía</Table.Cell>
                                <Table.Cell>13</Table.Cell>
                                <Table.Cell>01-08-2023</Table.Cell>
                                <Table.Cell>17.579.501-4</Table.Cell>
                                <Table.Cell>Catalina Astudillo</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ContentElemen>

                <ContentElemen>
                    <Table singleLine style={{ textAlign: 'center' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                                <Table.HeaderCell>N° Serie</Table.HeaderCell>
                                <Table.HeaderCell>Dar Confirmacion</Table.HeaderCell>
                                <Table.HeaderCell>Obserbaiones</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>1</Table.Cell>
                                <Table.Cell>VENTILADOR MECANICO</Table.Cell>
                                <Table.Cell>PHILIPS</Table.Cell>
                                <Table.Cell>TRILOGY 100</Table.Cell>
                                <Table.Cell>tv11404180e</Table.Cell>
                                <Table.HeaderCell>
                                    <Boton>Confirmado</Boton>
                                </Table.HeaderCell>
                                <Table.Cell>
                                    <Input />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>2</Table.Cell>
                                <Table.Cell>VENTILADOR MECANICO</Table.Cell>
                                <Table.Cell>LOWENSTEIN</Table.Cell>
                                <Table.Cell>PRISMA 50</Table.Cell>
                                <Table.Cell>32053792</Table.Cell>
                                <Table.HeaderCell>
                                    <Boton>Confirmado</Boton>
                                </Table.HeaderCell>
                                <Table.Cell>
                                    <Input />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ContentElemen>
            </ContenedorFormulario>

            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <Table /* singleLine style={{ textAlign: 'center' }}*/>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell /* width={2} */>N°</Table.HeaderCell>
                            <Table.HeaderCell /* width={2} */>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell /* width={2} */>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell /* width={2} */>Fecha</Table.HeaderCell>
                            <Table.HeaderCell /* width={2} */>Rut</Table.HeaderCell>
                            <Table.HeaderCell /* width={2} */>Cliente</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>

                        <Table.Row>
                            <Table.Cell >1</Table.Cell>
                            <Table.Cell>13</Table.Cell>
                            <Table.Cell>Guia</Table.Cell>
                            <Table.Cell>01-08-2023</Table.Cell>
                            <Table.Cell>17.579.501-4</Table.Cell>
                            <Table.Cell>Catalina Astudillo</Table.Cell>
                            <Table.Cell>
                                <FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: 'green' }} />
                            </Table.Cell>

                        </Table.Row>
                    </Table.Body>
                </Table>
            </ListarProveedor >
            {/* <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            /> */}
        </ContenedorProveedor >
    );
};

const ContenedorProveedor = styled.div`
/* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        margin-left: 40px;
        padding: 0px 20px;
        alignItems: center;
        width: 100%;
    }
`

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const ContentElemen = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 5px 10px;
`
const Titulo = styled.h2`
    color:  #83d394;

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        font-size: 1.5rem ;
    }
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
`

const Boton = styled.button`
    background-color: #83d394;
    color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    &:hover{
        background-color: #83d310;
    }
`

// const StyledTable = styled(Table)`
//   /* Estilos generales de la tabla */
//   /* Otros estilos generales para la tabla */

//   /* Media query para pantallas con un ancho máximo de 768px (tamaño móvil típico) */
//   @media screen and (max-width: 576px) {
//     font-size: 14px; /* Cambia el tamaño de fuente para pantallas pequeñas */
//     /* Otros estilos para pantallas pequeñas */

//     /* Ajusta el tamaño de las celdas para pantallas pequeñas */
//     &&&.celled tbody tr > td {

//       padding: 4px 8px; /* Ajusta el relleno (padding) de las celdas */
//     }
//   }
// `

export default Confirmados;