import React from 'react'
import { Tarjeta, Texto } from '../elementos/Card'
import { Boton} from '../elementos/General'
import moment from 'moment';
import * as FaIcons from 'react-icons/fa';

const Card = ({item,setCab_id, isOpen, setIsOpen, setIsOpenR, flag, setFlag}) => {
    // Cambiar fecha
    const formatearFecha = (fecha) => {
        const dateObj = fecha.toDate();
        const formatear = moment(dateObj).format('DD/MM/YYYY HH:mm:ss');
        return formatear;
    }
    return (
        <Tarjeta>
            <Texto>Tipo Documento: {item.tipdoc}</Texto>
            <Texto>N° Documento: {item.numdoc}</Texto>
            {/* <Texto>Fecha: {formatearFecha(item.date)}</Texto> */}
            <Texto>Paciente: {item.tipoinout}</Texto>
            <Texto>Rut: {item.rut}</Texto>
            <Texto>Nombre: {item.entidad}</Texto>
            <Boton onClick={() => {
                setCab_id(item.id)
                setIsOpen(!isOpen)
                setIsOpenR(false)
                setFlag(!flag)
            }}>
                <FaIcons.FaArrowCircleDown style={{ fontSize: '20px', color: '#328AC4' }} />
            </Boton>
        </Tarjeta>
    )
}

export default Card;