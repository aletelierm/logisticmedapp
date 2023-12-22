import React from 'react';
import { ListarProveedor, Titulo } from '../elementos/General';
import { Table } from 'semantic-ui-react'
import * as MdIcons from 'react-icons/md';
import Swal from 'sweetalert2';

const Mantenimiento = () => {

    const ordenado = [
        {  equipo:'VENTILADOR MECANICO', serie: '1234567', protocolo: 'PAUTA MANTENCION ANUAL', finicio: '01/01/2023', fprox: '01/01/2024'},
        {  equipo:'VENTILADOR MECANICO', serie: '7654321', protocolo: 'PAUTA MANTENCION SEMESTRAL', finicio: '01/01/2023', fprox: '01/06/2023'},
        {  equipo:'VENTILADOR MECANICO', serie: '1357909', protocolo: 'PAUTA MANTENCION MENSUAL', finicio: '01/01/2023', fprox: '31/01/2023'},
        {  equipo:'VENTILADOR MECANICO', serie: 'afgtr56', protocolo: 'PAUTA MANTENCION ANUAL', finicio: '01/01/2023', fprox: '01/01/2024'},
        {  equipo:'VENTILADOR MECANICO', serie: 'XXXXXXX', protocolo: 'PAUTA MANTENCION ANUAL', finicio: '01/01/2023', fprox: '01/01/2024'},
        {  equipo:'VENTILADOR MECANICO', serie: 'ZZZZZZZ', protocolo: 'PAUTA MANTENCION ANUAL', finicio: '01/01/2023', fprox: '01/01/2024'},

    ]

    const ejecutar = ()=>{
        Swal.fire('Check list de mantención');
    }

    return (
        <div>
                <ListarProveedor>
                <Titulo>Mantenciones</Titulo>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Equipo</Table.HeaderCell>
                            <Table.HeaderCell>Serie</Table.HeaderCell>
                            <Table.HeaderCell>Protocolo</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Inicio</Table.HeaderCell>
                            <Table.HeaderCell>F.Prox.Mantenión</Table.HeaderCell>
                            <Table.HeaderCell>Ejecutar</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {ordenado.map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell >{index + 1}</Table.Cell>
                                    <Table.Cell>{item.equipo}</Table.Cell>
                                    <Table.Cell>{item.serie}</Table.Cell>
                                    <Table.Cell>{item.protocolo}</Table.Cell>
                                    <Table.Cell>{item.finicio}</Table.Cell>
                                    <Table.Cell>{item.fprox}</Table.Cell>                                  
                                    <Table.Cell onClick={()=>ejecutar()} title="Ejecutar Mantención"><MdIcons.MdPlayCircle style={{ fontSize: '20px', color: '#328AC4', cursor:'pointer' }} /></Table.Cell>                                  
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </ListarProveedor>
        </div>
    );
};

export default Mantenimiento;