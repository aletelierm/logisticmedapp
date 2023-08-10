/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import Alertas from './Alertas';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar } from '../elementos/General'
import { Input } from '../elementos/CrearEquipos'



const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    // const user = auth.currentUser;
    const { users } = useContext(UserContext);
    // let fechaAdd = new Date();
    // let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [status, setStatus] = useState([]);
    const [dataSalida, setDataSalida] = useState([]);
    const [flag, setFlag] = useState(false);
    const [cab_id, setCab_id] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const [ver, setVer] = useState([]);
    // const [obs, setObs] = useState(false);

    // Lectura cabecera de documentos
    const getCabecera = async () => {
        const traerCabecera = collection(db, 'cabecerasout');
        const dato = query(traerCabecera, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setCabecera(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })))
    }
    const porEntregar = cabecera.filter(cab => cab.correo === users.correo)
    //Lectura movimientos de Salida
    const getSalida = async () => {
        const traerSalida = collection(db, 'salidas');
        const dato = query(traerSalida, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setDataSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false})))
        // setIsChecked(dataSalida.filter(ds => ds.cab_id === cab_id))
        console.log('Is Checked', isChecked)
    }
    //Lectura de status
    const getStatus = async () => {
        const traerEntrada = collection(db, 'status');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }
    // encontrars items que conincidan con cabecera
    // const mostrar = dataSalida.filter(ds => ds.cab_id === cab_id)
    // setVer(mostrar)
    // console.log('mostrar', mostrar)


    const handleCheckboxChange = (itemId) => {
        // console.log('mostrar2', mostrar)
        // console.log('iguaes id', itemId )
        setIsChecked((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item 
            )
        );
    };


    console.log('IsChecked', isChecked)

    useEffect(() => {
        getStatus();
        getSalida();
        getCabecera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setIsChecked(dataSalida.filter(ds => ds.cab_id === cab_id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])


    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Confirmacion de Entrega</Titulo>
            </Contenedor>

            <ListarProveedor>
                <Titulo>Listado de Documentos por Confirmar</Titulo>
                <StyledTable striped celled unstackable responsive style={{ textAlign: 'center' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>N° Docuemtno</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Nombre</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {porEntregar.map((item, index) => {
                            if (item.entregado === false && item.confirmado === true) {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.tipoout}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
                                        <Table.Cell onClick={() => {
                                            setCab_id(item.id)
                                            setIsOpen(!isOpen)
                                            setFlag(!flag)
                                        }} >
                                            <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        }
                        )}
                    </Table.Body>
                </StyledTable>
            </ListarProveedor >

            {isOpen &&
                <Contenedor>
                    <StyledTable striped celled unstackable responsive>
                        <Table.Header style={{ textAlign: 'center' }}>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Entregado</Table.HeaderCell>
                                <Table.HeaderCell>Observación</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body >
                            {isChecked.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <Input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleCheckboxChange(item.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                        {item.checked === true ? 
                                            <Input
                                                disabled
                                                type='text'
                                                name='observaciones'
                                                // value={obs}
                                                // onChange={ev => setObs(ev.target.value)}
                                            />
                                            : 
                                            <Input
                                                type='text'
                                                name='observaciones'
                                                // value={obs}
                                                // onChange={ev => setObs(ev.target.value)}
                                            />
                                        }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                            )
                            }
                        </Table.Body>
                    </StyledTable>
                    <BotonGuardar>Confirmar Entrega</BotonGuardar>
                </Contenedor>
            }

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor >
    );
};

const StyledTable = styled(Table)`
  /* Estilos generales de la tabla */

  /* Media query para pantallas con un ancho máximo de 768px (tamaño móvil típico) */
    @media screen and (max-width: 576px) {
        font-size: 16px; /* Cambia el tamaño de fuente para pantallas pequeñas */

    /* Ajusta el tamaño de las celdas para pantallas pequeñas */
    &&&.celled tbody tr > td {
      padding: 4px 10px; /* Ajusta el relleno (padding) de las celdas */
      font-size: 0.7rem ;
    }
  }
`

export default Confirmados;