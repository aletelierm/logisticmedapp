/* eslint-disable array-callback-return */
import React from 'react';
// import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
// import { auth } from '../firebase/firebaseConfig';
import * as FaIcons from 'react-icons/fa';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';
import {ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar} from '../elementos/General'
import {ContentElemenMov, Input} from '../elementos/CrearEquipos'


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
            <Contenedor>
                <Titulo>Confirmacion de Entrega</Titulo>
            </Contenedor>

            <Contenedor>
                <Titulo>Guia a Entregar</Titulo>
                <ContentElemenMov>
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
                </ContentElemenMov>

                <ContentElemenMov>
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
                                    <BotonGuardar>Confirmado</BotonGuardar>
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
                                    <BotonGuardar>Confirmado</BotonGuardar>
                                </Table.HeaderCell>
                                <Table.Cell>
                                    <Input />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </ContentElemenMov>
            </Contenedor>

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
                                <FaIcons.FaArrowCircleUp style={{ fontSize: '20px', color: '#328AC4' }} />
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