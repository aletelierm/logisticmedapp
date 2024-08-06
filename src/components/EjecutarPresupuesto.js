/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import Alertas from './Alertas';
import PresupuestoCabDB from '../firebase/PresupuestoCabDB';
import PresupuestoDB from '../firebase/PresupuestoDB';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
import * as FaIcons from 'react-icons/fa';
import { RiPlayListAddLine } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";
import { TbNotesOff } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, BotonGuardar, Boton, Subtitulo, Overlay, ConfirmaModal, ConfirmaBtn, Boton2 } from '../elementos/General'
import { ListarEquipos } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import Swal from 'sweetalert2';
import TablaInfo from './TablaInfo';

const EjecutarPresupuesto = () => {
  //fecha hoy
  let fechaAdd = new Date();
  let fechaMod = new Date();
  const user = auth.currentUser;
  const { users } = useContext(UserContext);
  const navigate = useNavigate();
  const { id, ruta } = useParams();
  const [ingreso] = useObtenerIngreso(id);

  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [presupuestoCab, setPresupuestoCab] = useState([]);
  const [id_cab_pre, setId_cab_pre] = useState('');
  const [presupuesto, setPresupuesto] = useState([]);
  const [item, setItem] = useState([]);
  const [folio, setFolio] = useState('');
  const [rut, setRut] = useState('');
  const [entidad, setEntidad] = useState('');
  const [date, setDate] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [familia, setFamilia] = useState('');
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [servicio, setServicio] = useState('');
  const [buscador, setBuscardor] = useState('');
  const [flag, setFlag] = useState(false);
  const [btnCab, setBtnCab] = useState(false);
  const [btnAgregarItem, setBtnAgregarItem] = useState(true);
  const [btnConfirmar, setBtnConfirmar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mostrar, setMostrar] = useState(true);
  const [mostrarAdd, setMostrarAdd] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationAceptado, setShowConfirmationAceptado] = useState(false);
  const [showConfirmationRechazar, setShowConfirmationRechazar] = useState(false);
  const [itemDelete, setItemdelete] = useState(false);
  const documentoId = useRef('');

  const volver = () => {
    navigate('/serviciotecnico/asignadostecnicos')
  }

  useEffect(() => {
    if (ingreso) {
      setFolio(ingreso.folio);
      setRut(ingreso.rut);
      setEntidad(ingreso.entidad);
      setDate(ingreso.date);
      setTelefono(ingreso.telefono);
      setDireccion(ingreso.direccion);
      setCorreo(ingreso.correo);
      setFamilia(ingreso.familia);
      setTipo(ingreso.tipo);
      setMarca(ingreso.marca);
      setModelo(ingreso.modelo);
      setSerie(ingreso.serie);
      setServicio(ingreso.servicio);
    } else {
      navigate('/serviciotecnico/asignadostecnicos')
    }
  }, [ingreso, navigate])

  // Detalle de Ingreso de equipo => Funcional
  const consultarPresupuestoCab = async () => {
    const pre = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const presu = await getDocs(pre);
    const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setPresupuestoCab(existePresupuesto);
    setId_cab_pre(existePresupuesto[0].id);
  }
  const presupuestoCabConf = presupuestoCab.filter(pc => pc.confirmado === true);
  // Detalle de Ingreso de equipo => Funcional
  const consultarPresupuesto = async () => {
    const pre = query(collection(db, 'presupuestos'), where('emp_id', '==', users.emp_id), where('id_cab_pre', '==', id_cab_pre));
    const presu = await getDocs(pre);
    const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setPresupuesto(existePresupuesto);
  }
  const total = presupuesto.reduce((total, dato) => total + dato.price, 0);
  // Listado de Items Test Ingreso => Funcional
  const getItem = async () => {
    const traerit = collection(db, 'itemsst');
    const dato = query(traerit, where('emp_id', '==', users.emp_id));
    const data = await getDocs(dato)
    setItem(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  const itemrs = item.filter(it => it.categoria !== 'TEST INGRESO' )
  // Ordenar Listado por item =>  Funcional
  itemrs.sort((a, b) => {
    const nameA = a.nombre;
    const nameB = b.nombre;
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  });
  // Cambiar fecha
  const formatearFecha = (fecha) => {
    const dateObj = fecha.toDate();
    const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
    // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
    return formatear;
  }
  const filtroItem = () => {
    const buscar = buscador.toLocaleUpperCase();
    if (buscar.length === 0)
      return itemrs.slice();
    const nuevoFiltro = itemrs.filter(it => it.nombre.includes(buscar));
    return nuevoFiltro.slice();
  }
  const onBuscarCambios = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setBuscardor(target.value)
  }
  // Agregar Cabecera de Protocolo
  const addCabPresupuesto = async (ev) => {
    ev.preventDefault();
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    const existeCab = presupuestoCab.filter(pc => pc.confirmado === false);
    const existeCabC = presupuestoCab.filter(pc => pc.confirmado === true);

    if (existeCabC.length > 0) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Ya se encuentra un presupuesto en el cual se esta trabajando'
      })
      documentoId.current = existeCab[0].id;
      setMostrarAdd(true);
      setBtnAgregarItem(false);
      setBtnCab(true)
    } else if (existeCab.length > 0) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Continue con la generacion del presupuesto'
      });
      documentoId.current = existeCab[0].id;
      setMostrarAdd(true);
      setBtnAgregarItem(false);
      setBtnCab(true)
      setFlag(!flag)
    } else {
      try {
        PresupuestoCabDB({
          id_cab_inst: id,
          confirmado: false,
          estado: 'PREPARACION',
          generado: false,
          fecha_generado: '',
          enviado: false,
          fecha_enviado: '',
          aceptado: false,
          fecha_aceptado: '',
          rechazado: false,
          fecha_rechazado: '',
          correctivo: false,
          fecha_correctivo: '',
          cerrado: false,
          fecha_cerrado: '',
          userAdd: user.email,
          userMod: user.email,
          fechaAdd: fechaAdd,
          fechaMod: fechaMod,
          emp_id: users.emp_id,
        })
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'exito',
          mensaje: 'Proceda a generar presupuesto'
        })
        setMostrarAdd(true);
        setBtnAgregarItem(false);
        setBtnCab(true)
      } catch (error) {
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'error',
          mensaje: error
        })
      }
    }
  }
  // Agregar Item a Protocolo => Funcional
  const AgregarItem = async (id_item) => {
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    // Consultar si Item se encuentra en Documento
    const item_id = itemrs.filter(it => it.id === id_item);
    // Validar Item en el documento de protocolo que se esta trabajando     
    const existePresupuesto = presupuesto.filter(doc => doc.item_id === item_id[0].id);
    // Buscar id de cabecera presupuesto
    const cabpre = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabpresu = await getDocs(cabpre);
    const existecabPresupuesto = (cabpresu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    if (!btnAgregarItem) {
      setBtnAgregarItem(true)
      if (existePresupuesto.length > 0) {
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'error',
          mensaje: 'Item ya se encuentra en este documento'
        })
      } else {
        try {
          PresupuestoDB({
            id_cab_pre: existecabPresupuesto[0].id,
            item_id: item,
            item: item_id[0].nombre,
            categoria: item_id[0].categoria,
            price: item_id[0].price,
            userAdd: user.email,
            userMod: user.email,
            fechaAdd: fechaAdd,
            fechaMod: fechaMod,
            emp_id: users.emp_id,
          });
          cambiarEstadoAlerta(true);
          cambiarAlerta({
            tipo: 'exito',
            mensaje: 'Item Agregado correctamente'
          })
          setFlag(!flag);
          setBtnConfirmar(false);
        } catch (error) {
          cambiarEstadoAlerta(true);
          cambiarAlerta({
            tipo: 'error',
            mensaje: error
          })
        }
      }
    }
    setTimeout(() => {
      setBtnAgregarItem(false);
    }, 2000);
  }
  // Borrar Items del presupuesto en proceso
  const handleDelete = (itemId) => {
    setItemdelete(itemId);
    setShowConfirmation(true);
  }
  const cancelDelete = () => {
    setShowConfirmation(false);
  }
  const borrarItem = async () => {
    if (itemDelete) {
      try {
        await deleteDoc(doc(db, "presupuestos", itemDelete));
        setFlag(!flag);
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'exito',
          mensaje: 'Item eliminado exitosamente.'
        });
      } catch (error) {
        console.log('Error al eliminar items');
      }
    }
    setShowConfirmation(false);
  }
  // Función para actualizar varios documentos por lotes
  const actualizarDocs = async () => {
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    // // Filtar por docuemto de Cabecera
    const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabecera = await getDocs(cab);
    const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    if (presupuesto.length === 0) {
      Swal.fire('No hay Datos por confirmar en este documento');
    } else {
      // Actualizar la cabecera de protocolos
      try {
        await updateDoc(doc(db, 'presupuestoscab', existeCab[0].id), {
          confirmado: true,
          estado: 'GENERADO',
          generado: true,
          fecha_generado: fechaMod,
          usermod: user.email,
          fechamod: fechaMod
        });
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'exito',
          mensaje: 'Documento confirmado exitosamente.'
        });
        setFlag(!flag)
      } catch (error) {
        cambiarEstadoAlerta(true);
        cambiarAlerta({
          tipo: 'error',
          mensaje: 'Error al confirmar Presupuesto:', error
        })
      }
      setFlag(!flag)
      setBtnCab(false)
      setMostrarAdd(false);
      setBtnAgregarItem(true);
    }
  }
  // Función para antualizar estado al enviar
  const enviar = async () => {
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    // Filtar por docuemto de Cabecera
    const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabecera = await getDocs(cab);
    const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // Actualizar la cabecera de protocolos
    try {
      await updateDoc(doc(db, 'presupuestoscab', existeCab[0].id), {
        estado: 'ENVIADO',
        enviado: true,
        fecha_enviado: fechaMod,
        usermod: user.email,
        fechamod: fechaMod
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Documento actualizado exitosamente.'
      });
      setFlag(!flag)
    } catch (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Error al confirmar Presupuesto:', error
      })
    }
  }

  // Cancelar Ingreso Cabecera
  const validarAceptado = () => {
    setShowConfirmationAceptado(true);
  }
  // Función para antualizar estado al aceptar
  const aceptar = async () => {
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    // Filtar por docuemto de Cabecera
    const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabecera = await getDocs(cab);
    const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // Actualizar la cabecera de protocolos
    try {
      await updateDoc(doc(db, 'presupuestoscab', existeCab[0].id), {
        estado: 'ACEPTADO CERRADO',
        aceptado: true,
        fecha_aceptado: fechaMod,
        cerrado: true,
        fecha_cerrado: fechaMod,
        usermod: user.email,
        fechamod: fechaMod
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Documento actualizado exitosamente.'
      });
      setFlag(!flag)
    } catch (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Error al confirmar Presupuesto:', error
      })
    }
    try {
      await updateDoc(doc(db, 'ingresostcab', id), {
        estado: 'CERRADO',
        fecha_out: fechaMod,
        usermod: user.email,
        fechamod: fechaMod
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Documento actualizado exitosamente.'
      });
      console.log('se cerro OE con estado CERRADO')
      setFlag(!flag)
    } catch (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Error al confirmar Presupuesto:', error
      })
    }
    navigate('/serviciotecnico/asignadostecnicos')
  }
  // Cancelar Ingreso Cabecera
  const cancelAceptado = () => {
    setShowConfirmationAceptado(false);
  }

  // Cancelar Ingreso Cabecera
  const validarRechazo = () => {
    setShowConfirmationRechazar(true);
  }
  // Función para antualizar estado al rechazar
  const rechazado = async () => {
    cambiarEstadoAlerta(false);
    cambiarAlerta({});
    // Filtar por docuemto de Cabecera
    const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabecera = await getDocs(cab);
    const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // Actualizar la cabecera de protocolos
    try {
      await updateDoc(doc(db, 'presupuestoscab', existeCab[0].id), {
        estado: 'ACEPTADO CERRADO',
        rechazado: true,
        fecha_rechazado: fechaMod,
        cerrado: true,
        fecha_cerrado: fechaMod,
        usermod: user.email,
        fechamod: fechaMod
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Documento actualizado exitosamente.'
      });
      setFlag(!flag)
    } catch (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Error al confirmar Presupuesto:', error
      })
    }
    try {
      await updateDoc(doc(db, 'ingresostcab', id), {
        estado: 'CERRADO',
        fecha_out: fechaMod,
        usermod: user.email,
        fechamod: fechaMod
      });
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Documento actualizado exitosamente.'
      });
      console.log('se cerro OE con estado CERRADO')
      setFlag(!flag)
    } catch (error) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'error',
        mensaje: 'Error al confirmar Presupuesto:', error
      })
    }
    navigate('/serviciotecnico/asignadostecnicos')
  }
  // Cancelar Ingreso Cabecera
  const cancelRechazado = () => {
    setShowConfirmationRechazar(false);
  }

  useEffect(() => {
    consultarPresupuesto();
    consultarPresupuestoCab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getItem();
    consultarPresupuestoCab();
    consultarPresupuesto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, setFlag])

  return (
    <ContenedorProveedor style={{ width: '80%' }}>
      {presupuestoCabConf.length > 0 ?
        <>
          <TablaInfo ingreso={ingreso} presupuestoCab={presupuestoCabConf} id_cab_pre={id_cab_pre} ruta={ruta} />
          {ruta === '1' ?
            <div>
              {presupuestoCab[0].enviado === false ?
                <BotonGuardar style={{ marginTop: '30px' }} onClick={enviar} >Enviar</BotonGuardar>
                :
                <>
                  <BotonGuardar style={{ marginTop: '30px' }} onClick={validarAceptado} >Aceptar</BotonGuardar>
                  <BotonGuardar style={{ marginTop: '30px' }} onClick={validarRechazo} >Rechazar</BotonGuardar>
                </>
              }
            </div>
            :
            ''
          }
        </>
        :
        <>
          <Contenedor>
            <Titulo>Crear Presupuesto</Titulo>
          </Contenedor>

          <Contenedor>
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
                  <Table.Cell>{folio}</Table.Cell>
                  <Table.Cell>{rut}</Table.Cell>
                  <Table.Cell>{entidad}</Table.Cell>
                  <Table.Cell>{date ? formatearFecha(date) : '00/00/00 00:00'}</Table.Cell>
                  <Table.Cell>{telefono}</Table.Cell>
                  <Table.Cell>{direccion}</Table.Cell>
                  <Table.Cell>{correo}</Table.Cell>
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
                <Table.Row >
                  <Table.Cell>{familia}</Table.Cell>
                  <Table.Cell>{tipo}</Table.Cell>
                  <Table.Cell>{marca}</Table.Cell>
                  <Table.Cell>{modelo}</Table.Cell>
                  <Table.Cell>{serie}</Table.Cell>
                  <Table.Cell>{servicio}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Contenedor>
          <BotonGuardar disabled={btnCab} style={{ marginTop: '20px', backgroundColor: btnCab && '#8F8B85', cursor: btnCab && 'default' }} onClick={addCabPresupuesto}>Comenzar Presupuesto</BotonGuardar>

          {/* Listado de item agregados a presupuesto */}
          {
            mostrarAdd && (
              <>
                <Contenedor>
                  <ContentElemenAdd>
                    <Titulo>Items Agregados a Evaluacion y Presupuesto</Titulo>
                  </ContentElemenAdd>
                  <ListarEquipos>
                    <Table singleLine>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>N°</Table.HeaderCell>
                          <Table.HeaderCell>Item</Table.HeaderCell>
                          <Table.HeaderCell>Categoria</Table.HeaderCell>
                          <Table.HeaderCell>Precio</Table.HeaderCell>
                          <Table.HeaderCell>Eliminar</Table.HeaderCell>
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
                              <Table.Cell>
                                <MdDeleteForever
                                  style={{ fontSize: '22px', color: '#69080A', marginLeft: '20px' }}
                                  onClick={() => handleDelete(item.id)}
                                  title='Eliminar Item'
                                />
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                      </Table.Body>
                      <Table.Footer>
                        <Table.Row>
                          <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }} colspan='3'>Total</Table.HeaderCell>
                          <Table.HeaderCell style={{ fontSize: '16px', fontWeight: 'bold' }}>${total.toLocaleString()}.-</Table.HeaderCell>
                          <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                      </Table.Footer>
                    </Table>
                  </ListarEquipos>
                  <BotonGuardar onClick={actualizarDocs} disabled={btnConfirmar}>Confirmar</BotonGuardar>
                </Contenedor>

                <ListarProveedor>
                  <ContentElemenAdd>
                    <Titulo>Listado de Items</Titulo>
                  </ContentElemenAdd>
                  <ContentElemenAdd>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px', marginRight: '15px' }} />
                    <InputAdd
                      type='text'
                      placeholder='Buscar Item'
                      value={buscador}
                      onChange={onBuscarCambios}
                    />
                    {mostrar ?
                      <Boton onClick={() => {
                        setIsOpen(true)
                        setFlag(!flag)
                        setMostrar(false)
                      }}
                        style={{ fontSize: '28px', color: '#328AC4', marginTop: '5px' }}
                        title='Mostrar Listado de Items'
                      >
                        <TbNotes />
                      </Boton>
                      :
                      <Boton onClick={() => {
                        setIsOpen(false)
                        setMostrar(true)
                      }}
                        style={{ fontSize: '28px', color: '#328AC4' }}
                        title='No mostrar Listado de Items'
                      >
                        <TbNotesOff />
                      </Boton>
                    }
                  </ContentElemenAdd>
                  {isOpen &&
                    <Table singleLine>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>N°</Table.HeaderCell>
                          <Table.HeaderCell>Item</Table.HeaderCell>
                          <Table.HeaderCell>Categoria</Table.HeaderCell>
                          <Table.HeaderCell>Precio</Table.HeaderCell>
                          <Table.HeaderCell style={{ textAlign: 'center' }}>Agregar</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {filtroItem().map((item, index) => {
                          return (
                            <Table.Row key={index}>
                              <Table.Cell>{index + 1}</Table.Cell>
                              <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{item.nombre}</Table.Cell>
                              <Table.Cell >{item.categoria}</Table.Cell>
                              <Table.Cell>${item.price.toLocaleString()}.-</Table.Cell>
                              <Table.Cell style={{ textAlign: 'center' }}>
                                <Boton disabled={btnAgregarItem} onClick={() => AgregarItem(item.id)}>
                                  <RiPlayListAddLine style={{ fontSize: '20px', color: '#328AC4' }} title='Agregar Item a protocolo' />
                                </Boton>
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                      </Table.Body>
                    </Table>
                  }
                </ListarProveedor>
              </>
            )
          }
        </>
      }

      {/* Modal para confirmar eliminacion de item en la lista de presupuesto en proceso */}
      {
        showConfirmation && (
          <Overlay>
            <ConfirmaModal className="confirmation-modal">
              <h2>¿Estás seguro de que deseas eliminar este elemento?</h2>
              <ConfirmaBtn className="confirmation-buttons">
                <Boton2 color={'#940000'} hover={'#FF0000'} onClick={borrarItem}>Aceptar</Boton2>
                <Boton2 onClick={cancelDelete}>Cancelar</Boton2>
              </ConfirmaBtn>
            </ConfirmaModal>
          </Overlay>
        )
      }
      {/* Modal para de validacion de Aceptado */}
      {
        showConfirmationAceptado && (
          <Overlay>
            <ConfirmaModal className="confirmation-modal">
              <h2>¿Estás seguro de que deseas aceptar el Presupuesto?</h2>
              <ConfirmaBtn className="confirmation-buttons">
                <Boton2 style={{ backgroundColor: '#43A854', }} onClick={aceptar}>Aceptar</Boton2>
                <Boton2 style={{ backgroundColor: '#E34747' }} onClick={cancelAceptado}>Cancelar</Boton2>
              </ConfirmaBtn>
            </ConfirmaModal>
          </Overlay>
        )
      }
      {/* Modal para de validacion de Rechazo */}
      {
        showConfirmationRechazar && (
          <Overlay>
            <ConfirmaModal className="confirmation-modal">
              <h2>¿Estás seguro de que deseas rechazar el Presupuesto?</h2>
              <ConfirmaBtn className="confirmation-buttons">
                <Boton2 style={{ backgroundColor: '#43A854', }} onClick={rechazado}>Aceptar</Boton2>
                <Boton2 style={{ backgroundColor: '#E34747' }} onClick={cancelRechazado}>Cancelar</Boton2>
              </ConfirmaBtn>
            </ConfirmaModal>
          </Overlay>
        )
      }

      <Alertas tipo={alerta.tipo}
        mensaje={alerta.mensaje}
        estadoAlerta={estadoAlerta}
        cambiarEstadoAlerta={cambiarEstadoAlerta}
      />

      <div>
        <BotonGuardar style={{ marginTop: '30px' }} onClick={volver} >Volver</BotonGuardar>
      </div>
    </ContenedorProveedor >
  )
}

export default EjecutarPresupuesto