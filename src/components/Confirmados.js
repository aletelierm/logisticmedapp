/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import Alertas from './Alertas';
import styled from 'styled-components';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, doc, writeBatch, addDoc, updateDoc } from 'firebase/firestore';
import * as FaIcons from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2';
import { ContenedorProveedor, Contenedor, ListarProveedor, Titulo, BotonGuardar } from '../elementos/General'
import { Input } from '../elementos/CrearEquipos'
import { fas } from '@fortawesome/free-solid-svg-icons';
// import moment from 'moment';


const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [status, setStatus] = useState([]);
    const [dataSalida, setDataSalida] = useState([]);
    const [flag, setFlag] = useState(false);
    const [cab_id, setCab_id] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const cabeceraId = useRef('');
    const inOut = useRef('');

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
        setDataSalida(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false, observacion: '' })))
    }
    //Lectura de status
    const getStatus = async () => {
        const traerEntrada = collection(db, 'status');
        const dato = query(traerEntrada, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setStatus(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
    }

    // // Cambiar fecha
    // const formatearFecha =(fecha)=>{
    //     const dateObj = fecha.toDate();
    //     const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
    //     return formatear;
    // }

    const handleCheckboxChange = (itemId) => {
        setIsChecked((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };

    // Guardar campo observaciones
    const handleChange = (e, item) => {
        const nuevoIsChecked = isChecked.map((i) => {
            if (i.id === item.id) {
                return { ...i, observacion: e.target.value };
            }
            return i;
        })
        setIsChecked(nuevoIsChecked)
    };

    // Funcion guardar Cabeceras
    const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, tipMov, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {
        try {
            const cabecera = await addDoc(collection(db, 'cabeceras'), {
                tipdoc: tipDoc,
                numdoc: numDoc,
                date: date,
                tipoinout: tipoInOut,
                rut: rut,
                entidad: entidad,
                tipmov: tipMov,
                confirmado: confirmado,
                useradd: userAdd,
                usermod: userMod,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                emp_id: emp_id
            })
            cabeceraId.current = cabecera.id;
            console.log('cabecera id', cabeceraId.current)
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }

        // Crea una nueva instancia de lote (batch)
        const batch = writeBatch(db);

        // Obtiene una referencia a una colección específica en Firestore
        const entradasRef = collection(db, 'entradas');
        console.log('cabecera id foreach', cabeceraId.current)
        // Itera a través de los nuevos documentos y agrégalos al lote
        falsoCheck.forEach((docs) => {
            const nuevoDocRef = doc(entradasRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
            batch.set(nuevoDocRef, {
                emp_id: users.emp_id,
                tipdoc: docs.tipdoc,
                numdoc: docs.numdoc,
                date: fechaAdd,
                tipoinout: inOut.current,
                rut: docs.rut,
                entidad: docs.entidad,
                eq_id: docs.id,
                familia: docs.familia,
                tipo: docs.tipo,
                marca: docs.marca,
                modelo: docs.modelo,
                serie: docs.serie,
                rfid: docs.rfid,
                price: 0,
                cab_id: cabeceraId.current,
                useradd: user.email,
                usermod: user.email,
                fechaadd: fechaAdd,
                fechamod: fechaMod,
                tipmov: 1,
                status: 'BODEGA',
                observacion: docs.observacion
            }

            );
        });

        // Ejecuta el lote
        batch.commit()
            .then(() => {
                console.log('Operaciones en el lote completadas con éxito.');
            })
            .catch((error) => {
                console.error('Error al ejecutar el lote:', error);
            });
    }


    const verdaderos = isChecked.filter(check => check.checked === true);
    const falsoCheck = isChecked.filter(check => check.checked === false && check.observacion !== '');
    const falsos = isChecked.filter(check => check.observacion === '' && check.checked === false);

    const confirmaEntrega = async (e) => {
        e.preventDefault();
        // console.log('Valores del formulario:', isChecked);
        cambiarEstadoAlerta(false);
        cambiarAlerta({});


        console.log('verdaderos', verdaderos)
        console.log('cabecera out', cab_id)
        if (falsos.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese una Observacion'
            })
            return;

        } else {
            if (verdaderos.length > 0) {
                const batch = writeBatch(db);
                verdaderos.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batch.update(docRef, { status: docs.tipoinout, rut: docs.rut, entidad: docs.entidad });
                });
                try {
                    await batch.commit();

                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });

                } catch (error) {
                    console.error('Error al actualizar documentos:', error);
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Error al actualizar documentos:', error
                    })
                }
            }

            if (falsoCheck.length > 0) {
                if (falsoCheck[0].tipoinout === 'CLIENTE') {
                    inOut.current = 'DEVOLUCION CLIENTE'
                } else {
                    inOut.current = 'SERVICIO TECNICO'
                }
                // crea cabecera
                try {
                    CabeceraInDB({
                        emp_id: users.emp_id,
                        tipDoc: falsoCheck[0].tipdoc,
                        numDoc: falsoCheck[0].numdoc,
                        date: fechaAdd,
                        tipoInOut: inOut.current,
                        rut: falsoCheck[0].rut,
                        entidad: falsoCheck[0].entidad,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 1,
                        confirmado: false
                    })
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Cabecera creada correctamente.'
                    });
                } catch (error) {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: error
                    })
                }

                // Actualiza Status de equipos
                const batchf = writeBatch(db);
                falsoCheck.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batchf.update(docRef, { status: 'TRANSITO BODEGA', rut: docs.rut, entidad: docs.entidad });
                });

                try {
                    await batchf.commit();
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    console.error('Error al actualizar documentos:', error);
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'error',
                        mensaje: 'Error al actualizar documentos:', error
                    })
                }

                // ACTUALIZAR CABECERA DE CONFIRMADOS
                try {
                    await updateDoc(doc(db, 'cabecerasout', cab_id), {
                        entregado: true,
                        usermod: user.email,
                        fechamod: fechaMod
                    })
                } catch (error) {
                    Swal.fire('Se ha producido un error al actualizar la cabecera');
                    console.log('ERROR', error)
                }
            }
        }
    }



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
                                        {/* <Table.Cell>{formatearFecha(item.date)}</Table.Cell> */}
                                        <Table.Cell>{item.date}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>
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

                        <Table.Body>
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
                                                />
                                                :
                                                <Input
                                                    type='text'
                                                    name={item.observacion}
                                                    value={item.observacion}
                                                    onChange={(e) => handleChange(e, item)}
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
                    <BotonGuardar onClick={confirmaEntrega} >Confirmar Entrega</BotonGuardar>
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