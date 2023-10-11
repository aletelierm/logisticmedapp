/* eslint-disable react-hooks/exhaustive-deps */
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
import moment from 'moment';

const Confirmados = () => {
    //lee usuario de autenticado y obtiene fecha actual
    const user = auth.currentUser;
    const { users } = useContext(UserContext);
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});
    const [cabecera, setCabecera] = useState([]);
    const [flag, setFlag] = useState(false);
    const [cab_id, setCab_id] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenR, setIsOpenR] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const [isChecked2, setIsChecked2] = useState([]);
    const cabeceraId = useRef('');
    const inOut = useRef('');

    // Filtar por docuemto de Cabecera
    const consultarCab = async () => {
        const cab = query(collection(db, 'cabecerasout'), where('emp_id', '==', users.emp_id), where('confirmado', '==', true), where('correo', '==', users.correo));
        const guardaCab = await getDocs(cab);
        const existeCab = (guardaCab.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 })))
        setCabecera(existeCab);
    }
    const porEntregar = cabecera.filter(cab => cab.entregado === false)
    const porRetirar = cabecera.filter(cab => cab.retirado === false)

    // Filtar por docuemto de Entrada campo entregado
    const consultarOutEntrega = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 2));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false })));
        setIsChecked(documento)
    }
    // Filtar por docuemto de Entrada campo retirado
    const consultarOutRetiro = async () => {
        const doc = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('cab_id', '==', cab_id), where('tipmov', '==', 0));
        const docu = await getDocs(doc);
        const documento = (docu.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, checked: false })));
        setIsChecked2(documento)
    }
    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }
    // Modifica Checked Entregado
    const handleCheckboxChange = (itemId) => {
        setIsChecked((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };
    // Guardar campo observaciones Entregado
    const handleChange = (e, item) => {
        const nuevoIsChecked = isChecked.map((i) => {
            if (i.id === item.id) {
                return { ...i, observacion: e.target.value };
            }
            return i;
        })
        setIsChecked(nuevoIsChecked)
    };

    // Modifica Checked Retirado
    const handleCheckboxChange2 = (itemId) => {
        setIsChecked2((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };
    // Guardar campo observaciones Retirado
    const handleChange2 = (e, item) => {
        const nuevoIsChecked2 = isChecked2.map((i) => {
            if (i.id === item.id) {
                return { ...i, observacion: e.target.value };
            }
            return i;
        })
        setIsChecked2(nuevoIsChecked2)
    };

    // Funcion guardar Cabeceras
    const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, tipMov, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id, falsos }) => {
        try {
            const cabecera = await addDoc(collection(db, 'cabeceras'), {
                numdoc: numDoc,
                tipdoc: tipDoc,
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
                emp_id: emp_id,
            })
            cabeceraId.current = cabecera.id;
        } catch (error) {
            Swal.fire('Se ha producido un error grave. Llame al Administrador', error);
        }

        if (falsos === false) {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const entradasRef = collection(db, 'entradas');
            console.log('cabecera id foreach', cabeceraId.current)
            // Itera a través de los nuevos documentos y agrégalos al lote
            falsoCheck.forEach((docs) => {
                const nuevoDocRef = doc(entradasRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    numdoc: docs.numdoc,
                    tipdoc: docs.tipdoc,
                    date: fechaAdd,
                    tipoinout: inOut.current,
                    rut: docs.rut,
                    entidad: docs.entidad,
                    cab_id: cabeceraId.current,
                    eq_id: docs.eq_id,
                    familia: docs.familia,
                    tipo: docs.tipo,
                    marca: docs.marca,
                    price: 0,
                    modelo: docs.modelo,
                    serie: docs.serie,
                    rfid: docs.rfid,
                    useradd: user.email,
                    usermod: user.email,
                    fechaadd: fechaAdd,
                    fechamod: fechaMod,
                    tipmov: 1,
                    observacion: docs.observacion,
                    emp_id: users.emp_id,
                }
                );
            });
            // Ejecuta el lote
            batch.commit()
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Docuemento creado correctamente.'
                    });
                })
                .catch((error) => {
                    Swal.fire('Se ha producido un error al crear docuemento de entrada devoluion');
                });

        } else {
            // Crea una nueva instancia de lote (batch)
            const batch = writeBatch(db);
            // Obtiene una referencia a una colección específica en Firestore
            const entradasRef = collection(db, 'entradas');
            // Itera a través de los nuevos documentos y agrégalos al lote
            verdaderosRetiro.forEach((docs) => {
                const nuevoDocRef = doc(entradasRef); // Crea una referencia de documento vacía (Firestore asignará un ID automáticamente)
                batch.set(nuevoDocRef, {
                    numdoc: docs.numdoc,
                    tipdoc: docs.tipdoc,
                    date: fechaAdd,
                    tipoinout: docs.tipoinout,
                    rut: docs.rut,
                    entidad: docs.entidad,
                    cab_id: cabeceraId.current,
                    eq_id: docs.eq_id,
                    familia: docs.familia,
                    tipo: docs.tipo,
                    marca: docs.marca,
                    price: 0,
                    modelo: docs.modelo,
                    serie: docs.serie,
                    rfid: docs.rfid,
                    useradd: user.email,
                    usermod: user.email,
                    fechaadd: fechaAdd,
                    fechamod: fechaMod,
                    tipmov: 1,
                    observacion: docs.observacion,
                    emp_id: users.emp_id,
                }
                );
            });
            // Ejecuta el lote
            batch.commit()
                .then(() => {
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Docuemento creado correctamente.'
                    });
                })
                .catch((error) => {
                    Swal.fire('Se ha producido un error al crear docuemento de entrada retirado');
                });
        }
    }

    // Filtros para guardar datos y/o validaciones Entregado
    const verdaderos = isChecked.filter(check => check.checked === true);
    const falsoCheck = isChecked.filter(check => check.checked === false && check.observacion !== '');
    const falsos = isChecked.filter(check => check.observacion === '' && check.checked === false);
    const confirmaEntrega = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

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
                    Swal.fire('Se ha producido un error al actualizar Status de equipos recibidos');
                }
            }

            if (falsoCheck.length > 0) {
                if (falsoCheck[0].tipoinout === 'CLIENTE') {
                    inOut.current = 'DEVOLUCION CLIENTE'
                } else {
                    inOut.current = 'DEVOLUCION SERVICIO TECNICO'
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
                        confirmado: false,
                        falsos: false // devolucion
                    })
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Cabecera creada correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al guardar Cabecera de Entrda');
                }

                // Actualiza Status de equipos
                const batchf = writeBatch(db);
                falsoCheck.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    console.log('id equipo',docs.eq_id)
                    batchf.update(docRef, { status: 'TRANSITO BODEGA', rut: docs.rut, entidad: docs.entidad, fechamod: fechaMod });
                });

                try {
                    await batchf.commit();
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al actualizar Status de equipos en devolucion');
                }
            }

            // ACTUALIZAR CABECERA DE CONFIRMADOS
            try {
                await updateDoc(doc(db, 'cabecerasout', cab_id), {
                    entregado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                })
                setFlag(!flag)
                setIsOpen(!isOpen)
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar la cabecera');
            }
        }
    }

    // Filtros para guardar datos y/o validaciones Retiro
    const verdaderosRetiro = isChecked2.filter(check => check.checked === true);
    const falsoCheckRetiro = isChecked2.filter(check => check.checked === false && check.observacion !== '');
    const falsosRetiro = isChecked2.filter(check => check.observacion === '' && check.checked === false);
    const confirmaRetiro = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (falsosRetiro.length > 0) {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Ingrese una Observacion'
            })
            return;
        } else {
            if (falsoCheckRetiro.length > 0) {
                if (falsoCheckRetiro[0].tipoinout === 'RETIRO CLIENTE') {
                    inOut.current = 'CLIENTE'
                } else {
                    inOut.current = 'SERVICIO TECNICO'
                }
                const batch = writeBatch(db);
                falsoCheckRetiro.forEach((docs) => {
                    const docRef = doc(db, 'salidas', docs.id);
                    batch.update(docRef, { observacion: docs.observacion, fechamod: fechaMod });
                });
                try {
                    await batch.commit();

                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al guardar observacion');
                    console.log(error)
                }

                const batch2 = writeBatch(db);
                falsoCheckRetiro.forEach((docs) => {
                    const docRef = doc(db, 'status', docs.eq_id);
                    batch2.update(docRef, { status: inOut.current, rut: docs.rut, entidad: docs.entidad, fechamod: fechaMod });
                });
                try {
                    await batch2.commit();
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Documentos actualizados correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al actualizar Status');
                    console.log(error)
                }
            }

            // Crear Cabecera
            if (verdaderosRetiro.length > 0) {
                try {
                    CabeceraInDB({
                        emp_id: users.emp_id,
                        tipDoc: verdaderosRetiro[0].tipdoc,
                        numDoc: verdaderosRetiro[0].numdoc,
                        date: fechaAdd,
                        tipoInOut: verdaderosRetiro[0].tipoinout,
                        rut: verdaderosRetiro[0].rut,
                        entidad: verdaderosRetiro[0].entidad,
                        userAdd: user.email,
                        userMod: user.email,
                        fechaAdd: fechaAdd,
                        fechaMod: fechaMod,
                        tipMov: 1,
                        confirmado: false,
                        falsos: true // retiro
                    })
                    cambiarEstadoAlerta(true);
                    cambiarAlerta({
                        tipo: 'exito',
                        mensaje: 'Cabecera creada correctamente.'
                    });
                } catch (error) {
                    Swal.fire('Se ha producido un error al guardar Cabecera de Entrda');
                }

                // Actualiza Status de equipos
                const batchf = writeBatch(db);
                verdaderosRetiro.forEach((docs) => {
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
                    setFlag(!flag)
                    setIsOpen(!isOpen)
                } catch (error) {
                    Swal.fire('Se ha producido un error al Cambiar Status de equipos retirados');
                }
            }

            // ACTUALIZAR CABECERA DE CONFIRMADOS
            try {
                await updateDoc(doc(db, 'cabecerasout', cab_id), {
                    retirado: true,
                    usermod: user.email,
                    fechamod: fechaMod
                })
                // setFlag(!flag)
                // setIsOpen(!isOpen)
            } catch (error) {
                Swal.fire('Se ha producido un error al actualizar la cabecera');
            }
            setFlag(!flag)
            setIsOpenR(!setIsOpenR)
        }
    }

    useEffect(() => {
        consultarCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        consultarOutEntrega();
        consultarOutRetiro();
        consultarCab();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag, setFlag])

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Entregados - Retirados</Titulo>
            </Contenedor>
            <ListarProveedor>
                <Titulo>Listado de Documentos por Entregar</Titulo>
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
                        {porEntregar.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setCab_id(item.id)
                                        setIsOpen(!isOpen)
                                        setIsOpenR(false)
                                        setFlag(!flag)
                                    }} >
                                        <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
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
                                                <Input disabled type='text' name='observaciones' />
                                                :
                                                <Input type='text'
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

            <ListarProveedor>
                <Titulo>Listado de Documentos por Retirar</Titulo>
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
                        {porRetirar.map((item) => {
                            return (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.tipdoc}</Table.Cell>
                                    <Table.Cell>{item.numdoc}</Table.Cell>
                                    <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                    <Table.Cell>{item.tipoinout}</Table.Cell>
                                    <Table.Cell>{item.rut}</Table.Cell>
                                    <Table.Cell>{item.entidad}</Table.Cell>
                                    <Table.Cell onClick={() => {
                                        setCab_id(item.id)
                                        setIsOpen(false)
                                        setIsOpenR(!isOpenR)
                                        setFlag(!flag)
                                    }} >
                                        <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        )}
                    </Table.Body>
                </StyledTable>
            </ListarProveedor >
            {isOpenR &&
                <Contenedor>
                    <StyledTable striped celled unstackable responsive>
                        <Table.Header style={{ textAlign: 'center' }}>
                            <Table.Row>
                                <Table.HeaderCell>N°</Table.HeaderCell>
                                <Table.HeaderCell>Equipo</Table.HeaderCell>
                                <Table.HeaderCell>Serie</Table.HeaderCell>
                                <Table.HeaderCell>Retirado</Table.HeaderCell>
                                <Table.HeaderCell>Observación</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {isChecked2.map((item, index) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>{index + 1}</Table.Cell>
                                        <Table.Cell>{item.tipo + ' - ' + item.marca + ' - ' + item.modelo}</Table.Cell>
                                        <Table.Cell>{item.serie}</Table.Cell>
                                        <Table.Cell style={{ textAlign: 'center' }}>
                                            <Input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleCheckboxChange2(item.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.checked === true ?
                                                <Input disabled type='text' name='observaciones' />
                                                :
                                                <Input type='text'
                                                    name={item.observacion}
                                                    value={item.observacion}
                                                    onChange={(e) => handleChange2(e, item)}
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
                    <BotonGuardar onClick={confirmaRetiro} >Confirmar Retiro</BotonGuardar>
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