import React from 'react'
import styled from 'styled-components';
import * as IoIcons from 'react-icons/io';

const Modal = ({ children, estado, cambiarEstado }) => {
    return (
        <>
            {estado &&
                <Overlay>
                    <ContenedorModal>
                        <EncabezadoModal>
                            <h3>LogisticMed</h3>
                        </EncabezadoModal>
                        <BotonCerrar onClick={() => cambiarEstado(!estado)}><IoIcons.IoMdClose /></BotonCerrar>
                        {children}
                    </ContenedorModal>
                </Overlay>
            }
        </>
    )
}

export default Modal;

const Overlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top:0;
    left:0;
    background: rgba(0,0,0,.5);
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const ContenedorModal = styled.div`
    width: 500px;
    min-height: 100px;
    background: #fff;
    position: relative;
    border-radius: 5px;
    box-shadow: rgba(100,100,111,.2) 0px 7px 29px 0px;
    padding: 20px;
`
const EncabezadoModal = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

    h3 {
        font-weight: 500;
        font-size: 16px;
        color: #1766dc;
    }
`
const BotonCerrar = styled.button`
    position: absolute;
    top:20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all.3s ease all;
    border-radius: 5px;
    color: #1766DC;

    &:hover{
        background: #f2f2f2;
    }

`