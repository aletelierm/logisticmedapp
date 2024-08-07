/* eslint-disable array-callback-return */
import React, { useState, useEffect, /* useRef */ } from 'react';
import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query, /* updateDoc, doc, deleteDoc */ } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
// import * as FaIcons from 'react-icons/fa';
import { ContenedorProveedor, Contenedor, Titulo, BotonGuardar, Subtitulo, Overlay, ConfirmaModal, ConfirmaBtn, Boton2, BotonCheck } from '../elementos/General'
import { ContentElemenMov, ContentElemenSelect, Select, Label, Input } from '../elementos/CrearEquipos'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Opcion } from './TipDoc';
import moment from 'moment';
// import Swal from 'sweetalert2';

const EjecutarMantencionSt = () => {
  //fecha hoy
  // let fechaAdd = new Date();
  // let fechaMod = new Date();
  const user = auth.currentUser;
  const { users } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [ingreso] = useObtenerIngreso(id);

  const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
  const [alerta, cambiarAlerta] = useState({});
  const [itemsInst, setItemsInst] = useState([]);
  const [itemsCheck, setItemsCheck] = useState([]);
  const [itemsMedicion, setItemsMedicion] = useState([]);
  const [itemsSeg, setItemsSeg] = useState([]);
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [flag, setFlag] = useState(false);
  // const documentoId = useRef('');

  const volver = () => {
    navigate('/serviciotecnico/asignadostecnicos');
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

  // Filtar por docuemto de Protocolo
  const consultarProtocolos = async () => {
    const docInst = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('tipo', '==', tipo), where('categoria', '==', 'INSTRUMENTOS'));
    const docuInst = await getDocs(docInst);
    const documenInst = (docuInst.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setItemsInst(documenInst);

    const docCheck = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('tipo', '==', tipo), where('categoria', '==', 'CHECK'));
    const docuCheck = await getDocs(docCheck);
    const documenCheck = (docuCheck.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
    setItemsCheck(documenCheck);

    const docLlen = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('tipo', '==', tipo), where('categoria', '==', 'MEDICION'));
    const docuLlen = await getDocs(docLlen);
    const documenLlen = (docuLlen.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
    setItemsMedicion(documenLlen);

    const docSel = query(collection(db, 'protocolos'), where('emp_id', '==', users.emp_id), where('tipo', '==', tipo), where('categoria', '==', 'SEGURIDAD'));
    const docuSel = await getDocs(docSel);
    const documenSel = (docuSel.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1, valor: '' })));
    setItemsSeg(documenSel);
  }

  // Cambiar fecha
  const formatearFecha = (fecha) => {
    const dateObj = fecha.toDate();
    const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
    // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
    return formatear;
  }

  const handleButtonClick = (index, buttonId) => {
    setItemsCheck((prevItems) => {
      const nuevosElementos = [...prevItems];
      nuevosElementos[index].valor = buttonId;
      return nuevosElementos;
    });
  }
  // const handleButtonClickLlen = (e, index) => {
  //   setItemsMedicion((prevItems) => {
  //     const nuevosElementos = [...prevItems];
  //     nuevosElementos[index].valor = e.target.value;
  //     return nuevosElementos;
  //   });
  // }
  const handleButtonClickSeg = (e, index) => {
    setItemsSeg((prevItems) => {
      const nuevosElementos = [...prevItems];
      nuevosElementos[index].valor = e.target.value;
      return nuevosElementos;
    });
  }

  // const cancelDelete = () => {
  //   setShowConfirmation(false);
  // }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  useEffect(() => {
    consultarProtocolos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag, setFlag])

  return (
    <ContenedorProveedor style={{ width: '80%' }}>
      <Contenedor>
        <Titulo>Ejecutar Mantención</Titulo>
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
        <ContentElemenMov>
          {itemsInst.length === 0 ?
            ''
            :
            <ContentElemenSelect style={{ padding: '5px' }}>
              <Label>Instrumentos requeridos :</Label>
              <ul >
                {itemsInst.map((item, index) => {
                  return (
                    <li style={{ fontSize: '12px' }} key={index}>{item.item}</li>
                  )
                })}
              </ul>
            </ContentElemenSelect>
          }
        </ContentElemenMov>
        {/* <BotonGuardar style={{ marginTop: '20px', backgroundColor: btnCab && '#8F8B85', cursor: btnCab && 'default' }} onClick={addCabPresupuesto}>Siguiente</BotonGuardar> */}
        {
          isOpen &&
          <BotonGuardar onClick={() => {
            setMostrar(true);
            console.log(mostrar)
            setIsOpen(false);
            setFlag(!flag);
            // addCabBitacora();
          }}>Siguente</BotonGuardar>
        }

        {mostrar &&
          <>
            {itemsCheck.length === 0 ?
              ''
              :
              <Table singleLine>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>N°</Table.HeaderCell>
                    <Table.HeaderCell>Item</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {itemsCheck.map((item, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell >{index + 1}</Table.Cell>
                        <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                        <Table.Cell style={{ textAlign: 'center' }}>
                          <BotonCheck
                            onClick={() => handleButtonClick(index, 'pasa')}
                            className={item.valor === 'pasa' ? 'activeBoton' : ''}
                          >Pasa</BotonCheck>
                          <BotonCheck
                            onClick={() => handleButtonClick(index, 'nopasa')}
                            className={item.valor === 'nopasa' ? 'activeBoton' : ''}
                          >No Pasa</BotonCheck>
                          <BotonCheck
                            onClick={() => handleButtonClick(index, 'na')}
                            className={item.valor === 'na' ? 'activeBoton' : ''}
                          >N/A</BotonCheck>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            }
            {itemsMedicion.length === 0 ?
              ''
              :
              <>
                <Titulo style={{ fontSize: '18px' }}>Medición</Titulo>
                <Table singleLine>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>N°</Table.HeaderCell>
                      <Table.HeaderCell>Item</Table.HeaderCell>
                      <Table.HeaderCell>Referencia</Table.HeaderCell>
                      <Table.HeaderCell>Unidad Medida</Table.HeaderCell>
                      <Table.HeaderCell style={{ textAlign: 'center' }}>Pasa</Table.HeaderCell>
                      <Table.HeaderCell style={{ textAlign: 'center' }}>No Pasa</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {itemsMedicion.map((item, index) => {
                      return (
                        <Table.Row key={index} >
                          <Table.Cell >{index + 1}</Table.Cell>
                          <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                          <Table.Cell  >
                            <Input
                              type="number"
                              value={item.valor}
                            // onChange={e => handleButtonClickLlen(e, index)}
                            />
                          </Table.Cell>
                          <Table.Cell>{item.medida}</Table.Cell>
                          <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" checked={item.valor === '' ? false : item.valor >= item.inicial && item.valor <= item.final ? true : false} /></Table.Cell>
                          <Table.Cell style={{ textAlign: 'center' }}><Input type="checkbox" checked={item.valor === '' ? false : item.valor >= item.inicial && item.valor <= item.final ? false : true} /></Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              </>
            }
            {itemsSeg.length === 0 ?
              ''
              :
              <>
                <Titulo style={{ fontSize: '18px' }}>Seguridad electrica</Titulo>
                <ContentElemenMov>
                  <Table singleLine>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>N°</Table.HeaderCell>
                        <Table.HeaderCell>Item</Table.HeaderCell>
                        <Table.HeaderCell>Referencia</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {itemsSeg.map((item, index) => {
                        return (
                          <Table.Row key={index} >
                            <Table.Cell >{index + 1}</Table.Cell>
                            {item.item === 'CLASIFICACION' ?
                              <>
                                <Table.Cell >{item.item}</Table.Cell>
                                <Table.Cell >
                                  <Select key={index} value={item.valor} onChange={e => { handleButtonClickSeg(e, index) }}>
                                    <option>Seleccione Opcion: </option>
                                    {Opcion.map((o, index) => {
                                      return (
                                        <option key={index} >{o.text}</option>
                                      )
                                    })}
                                  </Select>
                                </Table.Cell>
                              </>
                              :
                              <>
                                <Table.Cell style={{ whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '12px' }}>{item.item}</Table.Cell>
                                <Table.Cell  >
                                  <Input
                                    type="text"
                                    value={item.valor}
                                  // onChange={e => handleButtonClickSeg(e, index)}
                                  />
                                </Table.Cell>
                              </>
                            }
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table>
                </ContentElemenMov>
              </>
            }

            <ContentElemenMov style={{ marginTop: '10px' }}>
              <BotonGuardar /* onClick={handleSubmit} disabled={btnGuardar}*/ >Guardar</BotonGuardar>
              <BotonGuardar /* onClick={actualizarDocs} disabled={btnConfirmar}*/ >Confirmar</BotonGuardar>
            </ContentElemenMov>
          </>
        }
      </Contenedor>

      {/* Modal para de Confirar Mantencion Preventiva*/}
      {
        showConfirmation && (
          <Overlay>
            <ConfirmaModal className="confirmation-modal">
              <h2>¿Estás seguro de que deseas terminar la Mantencion Preventiva?</h2>
              <ConfirmaBtn className="confirmation-buttons">
                <Boton2 style={{ backgroundColor: '#43A854', }} /* onClick={aceptar} */ >Aceptar</Boton2>
                <Boton2 style={{ backgroundColor: '#E34747' }} /* onClick={cancelAceptado} */ >Cancelar</Boton2>
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

export default EjecutarMantencionSt;