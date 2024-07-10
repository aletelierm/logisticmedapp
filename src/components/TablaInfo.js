import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react';
import { ContenedorProveedor, Subtitulo } from '../elementos/General';
import moment from 'moment';

const TablaInfo = ({ ingreso, presupuesto, presupuestoCab }) => {
    const { users } = useContext(UserContext);
    const [usuarioIngreso, setUsuarioIngreso] = useState([]);

    //Consultar usuario
    const consultarUsuario = async () => {
        const user = query(collection(db, 'usuarios'), where('emp_id', '==', users.emp_id));
        const userd = await getDocs(user);
        const traeuser = (userd.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setUsuarioIngreso(traeuser);
    }
    const usuario = usuarioIngreso.filter(usuario => usuario.correo === ingreso.useradd);

    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    useEffect(() => {
        // consultarTest();
        consultarUsuario();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    console.log(presupuesto)

    return (
        <>
            <ContenedorProveedor>
                <ContenedorProveedor /*style={{ padding: '40px' }} ref={targetRef} */ >
                    {/* Informacion Cliente */}
                    <Subtitulo style={{ fontSize: '18px' }}>Informacion Cliente</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Folio</Table.HeaderCell>
                                <Table.HeaderCell>Rut</Table.HeaderCell>
                                <Table.HeaderCell>Nombre</Table.HeaderCell>
                                <Table.HeaderCell>Fecha</Table.HeaderCell>
                                <Table.HeaderCell>Telefono</Table.HeaderCell>
                                <Table.HeaderCell>Dirección</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{ingreso.folio}</Table.Cell>
                                <Table.Cell>{ingreso.rut}</Table.Cell>
                                <Table.Cell>{ingreso.entidad}</Table.Cell>
                                <Table.Cell>{ingreso.date ? formatearFecha(ingreso.date) : '00/00/00 00:00'}</Table.Cell>
                                <Table.Cell>{ingreso.telefono}</Table.Cell>
                                <Table.Cell>{ingreso.direccion}</Table.Cell>
                                <Table.Cell>{ingreso.correo}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Informacion Equipo */}
                    <Subtitulo style={{ fontSize: '18px' }}>Informacion Equipo</Subtitulo>
                    <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Familia</Table.HeaderCell>
                                <Table.HeaderCell>Tipo Equipamiento</Table.HeaderCell>
                                <Table.HeaderCell>Marca</Table.HeaderCell>
                                <Table.HeaderCell>Modelo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Servicio</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>{ingreso.familia}</Table.Cell>
                                <Table.Cell>{ingreso.tipo}</Table.Cell>
                                <Table.Cell>{ingreso.marca}</Table.Cell>
                                <Table.Cell>{ingreso.modelo}</Table.Cell>
                                <Table.Cell>{ingreso.serie}</Table.Cell>
                                <Table.Cell>{ingreso.servicio}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {/* Informacion Presuuesto */}
                    {presupuestoCab.length > 0 ?
                        <>
                            <Subtitulo style={{ fontSize: '18px' }}>Presupuesto</Subtitulo>
                            <Table singleLine style={{ fontSize: '12px', lineHeight: '8px' }}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>N°</Table.HeaderCell>
                                        <Table.HeaderCell>Item</Table.HeaderCell>
                                        <Table.HeaderCell>Categoria</Table.HeaderCell>
                                        <Table.HeaderCell>Precio</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {presupuesto.map((item, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.item}</Table.Cell>
                                                <Table.Cell>{item.categoria}</Table.Cell>
                                                <Table.Cell>${item.price.toLocaleString()}.-</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>

                            <div style={{ fontSize: '12px', lineHeight: '10px' }}>
                                <h4 style={{ margin: '14px 0px' }}>{usuario.map((user, index) => {
                                    return (<h4 key={index}>Ingresado por: {user.nombre}  {user.apellido}</h4>)
                                })}</h4>

                                <h5 style={{ margin: '14px 0px' }}>SERVICIO TÉCNICO</h5>
                                <p>soporte@dormirbien.cl</p>
                                <p>General Parra #674 Oficina H, Providencia</p>
                                <p>Contacto: +569 76321481 / +569 54234538</p>
                            </div>
                        </>
                        :
                        ''
                    }
                </ContenedorProveedor>
            </ContenedorProveedor>
        </>
    )
}

export default TablaInfo