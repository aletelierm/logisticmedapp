/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import Alerta from '../components/Alertas';
import { ContentElemen, Input } from '../elementos/CrearEquipos'
import { ContenedorProveedor, Contenedor, Titulo } from '../elementos/General';
import { Table } from 'semantic-ui-react'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query,doc, getDoc } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import * as FaIcons from 'react-icons/fa';
import moment from 'moment';

const Reporte1 = () => {
    const { users } = useContext(UserContext);
    const [alerta, cambiarAlerta] = useState({});
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [serie, setSerie] = useState('');
    const [merges, setMerges] = useState([]);
    const merge = useRef([]);
    const ent = useRef([]);
    const sal = useRef([]);

    const detectarEquipo = async (e) => {
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        if (e.key === 'Enter' || e.key === 'Tab') {
            if(serie !==''){
                //leer por serie
                const dato = query(collection(db, 'equipos'), where('emp_id', '==', users.emp_id), where('serie', '==', serie));
                const data = await getDocs(dato);
                //leer por id            
                const dataid = await getDoc(doc(db, 'equipos', serie));                  
            if (data.docs.length === 1) {
                //leer entradas por id
                const datoE = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', data.docs[0].id));
                const dataE = await getDocs(datoE);
                ent.current = dataE.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }));              
                //leer salidas por id
                const datoS = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', data.docs[0].id));
                const dataS = await getDocs(datoS);
                sal.current = dataS.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }));  
                merge.current = [...ent.current, ...sal.current].sort((a, b) => a.date - b.date);
                const movimientos = merge.current.filter(mov => mov.tipmov !==0)                
                setMerges(movimientos);
            } else if(dataid.exists()){                
                //leer entradas por id
                const datoE = query(collection(db, 'entradas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', serie));
                const dataE = await getDocs(datoE);
                ent.current = dataE.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }));            
                //leer salidas por id
                const datoS = query(collection(db, 'salidas'), where('emp_id', '==', users.emp_id), where('eq_id', '==', serie));
                const dataS = await getDocs(datoS);
                sal.current = dataS.docs.map((doc, index) => ({ ...doc.data(), id: doc.id, id2: index + 1 }));                               
                merge.current = [...ent.current, ...sal.current].sort((a, b) => a.date - b.date);
                setMerges(merge.current);                
            }else{
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'Numero de serie o Id incorrectos !!!'
                })
                return;
                }
            }else{
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'No a ingresado ningun valor !!!'
                })
                return;
            }
        }
    }

    const handleChange = (e) => {
        setSerie(e.target.value);
    }

    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm');
        return formatear;
    }

    return (
        <ContenedorProveedor>
            <Contenedor>
                <Titulo>Historial por Equipo</Titulo>
            </Contenedor>
            <Contenedor>
                <ContentElemen>
                    <FaIcons.FaSearch style={{ fontSize: '30px', color: '#328AC4', padding: '5px' }} />
                    <Input style={{ width: '100%' }}
                        type='text'
                        placeholder='Buscar x Serie o Id del equipo'
                        value={serie}
                        onChange={handleChange}
                        onKeyDown={detectarEquipo}
                    />
                    {/*  <FaIcons.FaFileExcel  style={{ fontSize: '20px', color: '#328AC4', marginLeft: '20px' }} title='Exportar Clientes a Excel' /> */}
                </ContentElemen>
            </Contenedor>
            <Contenedor>
                {
                    merge.current.length > 0 ?
                        <Titulo style={{ fontSize: '17px' }}>Equipo :{"  "+merge.current[0].tipo + " " + merge.current[0].marca + " " + merge.current[0].modelo+"   N.Serie : "+ merge.current[0].serie}</Titulo>
                        :
                        <Titulo>Equipo:</Titulo>
                }

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Fecha</Table.HeaderCell>
                            <Table.HeaderCell>N.Doc</Table.HeaderCell>
                            <Table.HeaderCell>T.Doc</Table.HeaderCell>
                            <Table.HeaderCell>Entrada</Table.HeaderCell>
                            <Table.HeaderCell>Salida</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Mov.</Table.HeaderCell>
                            <Table.HeaderCell>Rut</Table.HeaderCell>
                            <Table.HeaderCell>Entidad</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {/* {console.log('merge jsx:', merge.current)} */}
                        {
                            merges.map((item, index) => {
                                return (
                                    <Table.Row key={index + 1}>
                                        <Table.Cell>{item.id2}</Table.Cell>
                                        <Table.Cell>{formatearFecha(item.date)}</Table.Cell>
                                        <Table.Cell>{item.numdoc}</Table.Cell>
                                        <Table.Cell>{item.tipdoc}</Table.Cell>
                                        <Table.Cell>{item.tipmov === 1 ? '1' : '0'}</Table.Cell>
                                        <Table.Cell>{item.tipmov === 1 ? "0" : "1"}</Table.Cell>
                                        <Table.Cell>{item.tipoinout}</Table.Cell>
                                        <Table.Cell>{item.rut}</Table.Cell>
                                        <Table.Cell>{item.entidad}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </Contenedor>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </ContenedorProveedor>
    );
};

export default Reporte1;

