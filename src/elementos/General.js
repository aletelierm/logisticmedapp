import styled from 'styled-components';

const ContenedorProveedor = styled.div``

const Contenedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`

const ContenedorElementos = styled.div`
    display: flex;
    margin-top: 20px;
    padding: 10px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
    justify-content: center;
    align-items: center;    
`

const ContentElemenAdd = styled.div`
    display: flex;
    text-align: center;
    padding: 7px;
    align-items: center;
    justify-content: space-around;
`

const FormularioAdd = styled.form`
    display: flex;
    padding: 0px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`

const Titulo = styled.h2`
    // color:  #83d394;
    color:  #328AC4;
`

const InputAdd = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px 30px;
    font-size: 16px;
    text-align: center;
    width: 100%;

    &:focus{
        border: 3px solid #83d394;
    }
`

const InputUpdate = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 6px;
    padding: 5px;
    transition: all.3s ease all;
    &:focus{
        border: 3px solid #83d394;
    }
`

const Boton = styled.button`
    background-color: #ffffff;
    color: #83d394;
    padding: 10px;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    cursor: pointer;
`
const BotonGuardar = styled.button`
    // background-color: #83d394;
    background-color: #328AC4;
    color: #ffffff;
    border-radius: 5px;
    border: none;
    margin: 0 10px;
    padding: 10px;
    cursor: pointer;
    &:hover{
        // background-color: #83d310;
        background-color: #16B9CF;
    }
`
const Boton2 = styled.button`
	display: block;
	padding: 10px 30px;
	border-radius: 100px;
	color: #fff;
	border: none;
	background: #1766DC;
	cursor: pointer;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	transition: .3s ease all;

	&:hover {
		background: #0066FF;
	}
`

export {ContenedorProveedor, Contenedor, ContenedorElementos, ContentElemenAdd, FormularioAdd, ListarProveedor, Titulo, InputAdd ,InputUpdate , Boton, BotonGuardar, Boton2};