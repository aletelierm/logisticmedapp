import React, { useState } from 'react'
import Alertas from './Alertas';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Table } from 'semantic-ui-react'
import { ContenedorProveedor, Contenedor, /* ListarProveedor,*/ Titulo, BotonGuardar, /*Boton , ConfirmaModal, ConfirmaBtn, Boton2, Overlay*/ } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Formulario, Input, Label, /*, ListarEquipos, Select,*/ TextArea, Select } from '../elementos/CrearEquipos';

const IngresoEquiposST = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    // let fechaAdd = new Date();
    // let fechaMod = new Date();

    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [rut, setRut] = useState('');
    const [entidad, setEntidad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [date, setDate] = useState('');
    const [confirmar, setConfirmar] = useState(false);

    // Validar rut
    const detectarCli = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});
        // setBtnGuardar(true)
        if (e.key === 'Enter' || e.key === 'Tab') {
            const cli = query(collection(db, 'clientes'), where('emp_id', '==', users.emp_id), where('rut', '==', rut));
            const rutCli = await getDocs(cli)
            const final = (rutCli.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if (rutCli.docs.length === 0) {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No existe rut de Cliente'
                })
            } else {
                setEntidad(final[0].nombre);
                setTelefono(final[0].telefono);
                setDireccion(final[0].direccion);
                setCorreo(final[0].correo);
                // setBtnGuardar(false)
            }
        }
    }


    return (
        <ContenedorProveedor>
            <Contenedor >
                <Titulo>Orden de Ingrso de Equipos</Titulo>
            </Contenedor>
            {/* Informacion del Cliente */}
            <Contenedor>
                <Titulo>Informacion Cliente</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Rut</Label>
                            <Input
                                disabled={confirmar}
                                type='numero'
                                placeholder='Ingrese Rut sin puntos'
                                name='rut'
                                value={rut}
                                onChange={ev => setRut(ev.target.value)}
                                onKeyDown={detectarCli}
                            />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Nombre</Label>
                            <Input value={entidad} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Fecha de Ingreso</Label>
                            <Input
                                // disabled={confirmar}
                                type='datetime-local'
                                placeholder='Seleccione Fecha'
                                name='date'
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            // min={fechaMinima.toISOString().slice(0, 16)}
                            // max={fechaMaxima.toISOString().slice(0, 16)}
                            />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Telefono</Label>
                            <Input value={telefono} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Dirección</Label>
                            <Input value={direccion} disabled />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Email</Label>
                            <Input value={correo} disabled />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Informacion del Equipo */}
            <Contenedor>
                <Titulo>Informacion Equipo</Titulo>
                <Formulario action=''>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>N° Serie</Label>
                            <Input />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Equipo</Label>
                            <Input />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Marca</Label>
                            <Input />
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    <ContentElemenMov>
                        <ContentElemenSelect>
                            <Label>Modelo</Label>
                            <Input />
                        </ContentElemenSelect>
                        <ContentElemenSelect>
                            <Label>Tipo de Servicio</Label>
                            <Select>
                                <option>Seleccione Opcion:</option>
                                <option>Mantención Preventiva</option>
                                <option>Mantención Correctiva</option>
                                <option>Presupuesto</option>
                                <option>Garantia</option>
                            </Select>
                        </ContentElemenSelect>
                    </ContentElemenMov>
                    {/* Guardar datos ingresados */}
                    <BotonGuardar>Siguente</BotonGuardar>
                </Formulario>
            </Contenedor>

            {/* Test de Ingreso */}
            <Contenedor>
                <Titulo>Test de Ingreso</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Si</Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Equipo ¿Enciende?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>¿Entrega flujo?</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Filtro espuma</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Accesorios</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Trajeta memoria</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Fuente de poder o cable</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Manguera</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Bolso</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Cámara de agua</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Climate control</Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                            <Table.Cell><Input type='checkbox' /></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <ContentElemenMov style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Label>Observaciones</Label>
                    <TextArea
                        style={{ width: '80%', height: '60px' }}
                        type='text'
                        name='descripcion'
                        placeholder='Ingrese descripcion o detalles adicionales a la guía'
                    // value={descripcion}
                    // onChange={e => setDescripcion(e.target.value)}
                    />
                </ContentElemenMov>
                <BotonGuardar>Guardar</BotonGuardar>
                <BotonGuardar>Nuevo</BotonGuardar>
            </Contenedor>

            <Alertas tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    )
}

export default IngresoEquiposST