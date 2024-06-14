/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import Alertas from './Alertas';
import PresupuestoCabDB from '../firebase/PresupuestoCabDB';
import PresupuestoDB from '../firebase/PresupuestoDB';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, /*addDoc, updateDoc, doc, setDoc */ } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
import * as FaIcons from 'react-icons/fa';
// import * as MdIcons from 'react-icons/md';
import { RiPlayListAddLine } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";
import { TbNotesOff } from "react-icons/tb";
import { ContenedorProveedor, Contenedor, ContentElemenAdd, ListarProveedor, Titulo, InputAdd, BotonGuardar, Boton, Subtitulo } from '../elementos/General'
import { ListarEquipos/*, Select, Formulario, Label, Contenido */ } from '../elementos/CrearEquipos';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';

const EjecutarPresupuesto = () => {
  //fecha hoy
  let fechaAdd = new Date();
  let fechaMod = new Date();
  const user = auth.currentUser;
  const { users } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [ingreso] = useObtenerIngreso(id);

  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [detalle, setDetalle] = useState([]);
  const [presupuesto, setPresupuesto] = useState([]);
  const [item, setItem] = useState([]);
  const [folio, setFolio] = useState('');
  const [rut, setRut] = useState('');
  const [entidad, setEntidad] = useState('');
  const [date, setDate] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [buscador, setBuscardor] = useState('');
  const [flag, setFlag] = useState(false);
  const [btnCab, setBtnCab] = useState(false);
  const [btnAgregarItem, setBtnAgregarItem] = useState(true);
  const [btnConfirmar, setBtnConfirmar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mostrar, setMostrar] = useState(true);
  const [mostrarAdd, setMostrarAdd] = useState(false);
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
    } else {
      navigate('/serviciotecnico/asignadostecnicos')
    }
  }, [ingreso, navigate])

  // Detalle de Ingreso de equipo
  const consultarIngresosDet = async () => {
    const det = query(collection(db, 'ingresostdet'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const deta = await getDocs(det);
    const existeDet = (deta.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setDetalle(existeDet);
  }
  // Detalle de Ingreso de equipo => No funcional
  const consultarPresupuesto = async () => {
    const pre = query(collection(db, 'presupuestos'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const presu = await getDocs(pre);
    const existePresupuesto = (presu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setPresupuesto(existePresupuesto);
  }
  // Listado de Items Test Ingreso => Funcional
  const getItem = async () => {
    const traerit = collection(db, 'itemsst');
    const dato = query(traerit, where('emp_id', '==', users.emp_id));
    const data = await getDocs(dato)
    setItem(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  const itemrs = item.filter(it => it.categoria !== 'TEST INGRESO')
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
  // Hasta aqui hacia arriba

  // Agregar Cabecera de Protocolo
  const addCabPresupuesto = async (ev) => {
    ev.preventDefault();
    cambiarEstadoAlerta(false);
    cambiarAlerta({});

    // Filtar por docuemto de Cabecera Bitacora
    const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id), where('confirmado', '==', false));
    const cabecera = await getDocs(cab);
    const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    if (existeCab.length > 0) {
      cambiarEstadoAlerta(true);
      cambiarAlerta({
        tipo: 'exito',
        mensaje: 'Proceda a generar presupuesto'
      });
      documentoId.current = existeCab[0].id;
      setMostrarAdd(true);
      setBtnAgregarItem(false);
      setBtnCab(true)
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
    console.log('id ingreso cab',id)
    // Consultar si Item se encuentra en Documento
    const item_id = itemrs.filter(it => it.id === id_item);
    // Validar Item en el documento de protocolo que se esta trabajando     
    const existePresupuesto = presupuesto.filter(doc => doc.item_id === item_id[0].id);
    // Buscar id de cabecera presupuesto
    const cabpre = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
    const cabpresu = await getDocs(cabpre);
    const existecabPresupuesto = (cabpresu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    console.log('Cab presupuesto en agregar items', existecabPresupuesto)
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
            id_cab_inst: id,
            folio: folio,
            id_cab_pre: existecabPresupuesto[0].id,
            item_id: item_id[0].id,
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
          // setConfirmar(false);
          // setBtnGuardar(true);
          // setBtnNuevo(false);
          setBtnConfirmar(false);
          return;
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
  // // Función para actualizar varios documentos por lotes
  // const actualizarDocs = async () => {
  //   cambiarEstadoAlerta(false);
  //   cambiarAlerta({});
  //   // // Filtar por docuemto de Cabecera
  //   const cab = query(collection(db, 'presupuestoscab'), where('emp_id', '==', users.emp_id), where('id_cab_inst', '==', id));
  //   const cabecera = await getDocs(cab);
  //   const existeCab = (cabecera.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

  //   if (presupuesto.length === 0) {
  //     Swal.fire('No hay Datos por confirmar en este documento');
  //   } else {
  //     // Actualizar la cabecera de protocolos
  //     try {
  //       await updateDoc(doc(db, 'presupustoscab', existeCab[0].id), {
  //         confirmado: true,
  //         generado: true,
  //         fecha_generadogenerado: fechaMod,
  //         usermod: user.email,
  //         fechamod: fechaMod
  //       });
  //       cambiarEstadoAlerta(true);
  //       cambiarAlerta({
  //         tipo: 'exito',
  //         mensaje: 'Documento confirmado exitosamente.'
  //       });
  //     } catch (error) {
  //       cambiarEstadoAlerta(true);
  //       cambiarAlerta({
  //         tipo: 'error',
  //         mensaje: 'Error al confirmar Cabecera:', error
  //       })
  //     }
  //     setFlag(!flag)
  //     setNomFamilia('');
  //     setConfirmar(false);
  //     setBtnGuardar(false);
  //     setBtnConfirmar(true);
  //     setBtnNuevo(true);
  //   }
  // }

  useEffect(() => {
    consultarIngresosDet();
    consultarPresupuesto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getItem();
    consultarPresupuesto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, setFlag])


  return (
    <ContenedorProveedor style={{ width: '80%' }}>
      <Contenedor>
        <Titulo>Crear Presupuesto</Titulo>
      </Contenedor>

      {/* Informacion Cliente */}
      <Contenedor>
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
      </Contenedor>

      {/* Informacion Equipo */}
      <Contenedor>
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
            {detalle.map((item, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell >{item.familia}</Table.Cell>
                  <Table.Cell  >{item.tipo}</Table.Cell>
                  <Table.Cell>{item.marca}</Table.Cell>
                  <Table.Cell>{item.modelo}</Table.Cell>
                  <Table.Cell>{item.serie}</Table.Cell>
                  <Table.Cell>{item.servicio}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Contenedor>

      <BotonGuardar disabled={btnCab} style={{ marginTop: '20px', backgroundColor: btnCab && '#8F8B85', cursor: btnCab && 'default' }} onClick={addCabPresupuesto}>Comenzar Presupuesto</BotonGuardar>
      {/* Listado de item agregados a presupuesto */}
      {mostrarAdd && (
        <>
          <Contenedor>
            <ContentElemenAdd>
              <Titulo>Items Agregados a Presupuesto</Titulo>
            </ContentElemenAdd>
            <ListarEquipos>
              <Table singleLine>
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
            </ListarEquipos>
            <BotonGuardar /*onClick={() => { actualizarDocs(); }}*/ disabled={btnConfirmar}>Confirmar</BotonGuardar>
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
            {/* Listo hacia abajo 04-06-2024 15:06 */}
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
      )}

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