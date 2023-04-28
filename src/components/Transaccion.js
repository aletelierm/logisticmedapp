import React from 'react';
import { Table } from 'semantic-ui-react'
import styled from 'styled-components';

const Transaccion = () =>{
    return (
        <div>
            <h2>Ultimas Transacciones</h2>
            <ListarProveedor>
                <h2>Listado Entradas</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N° Documento</Table.HeaderCell>
                            <Table.HeaderCell>Tipo Documento</Table.HeaderCell>
                            <Table.HeaderCell>Proveedor</Table.HeaderCell>
                            <Table.HeaderCell>Fecha Ingreso</Table.HeaderCell>
                           
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>0012984572</Table.Cell>
                            <Table.Cell>FACTURA</Table.Cell>
                            <Table.Cell>Bomy CHILE</Table.Cell>
                            <Table.Cell>23-04-2023</Table.Cell>
                           
                        </Table.Row>
                    </Table.Body>

                </Table>
            </ListarProveedor>
        </div>
    );
};

export default Transaccion;

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`
const Boton = styled.button`
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
`