/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from 'react';
import Alertas from './Alertas';
import { Table } from 'semantic-ui-react';
import { auth, db } from '../firebase/firebaseConfig';
// import { getDocs, collection, where, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useObtenerIngreso from '../hooks/useObtenerIngreso';
import * as FaIcons from 'react-icons/fa';
import { ContenedorProveedor, Contenedor, Titulo, BotonGuardar, Subtitulo, Overlay, ConfirmaModal, ConfirmaBtn, Boton2 } from '../elementos/General'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import moment from 'moment';
import Swal from 'sweetalert2';

const EjecutarMantencionSt = () => {
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
  const [flag, setFlag] = useState(false);
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


  // Cambiar fecha
  const formatearFecha = (fecha) => {
    const dateObj = fecha.toDate();
    const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
    // const fechaHoyF = moment(fechaHoy).format('DD/MM/YYYY HH:mm');
    return formatear;
  }

  // const cancelDelete = () => {
  //   setShowConfirmation(false);
  // }

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [flag, setFlag])

  return (
    <ContenedorProveedor style={{ width: '80%' }}>
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
        <BotonGuardar /* style={{ marginTop: '20px', backgroundColor: btnCab && '#8F8B85', cursor: btnCab && 'default' }} onClick={addCabPresupuesto} */ >Siguiente</BotonGuardar>
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