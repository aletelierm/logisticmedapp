import styled from 'styled-components';

const ContenedorProveedor = styled.div`
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        margin: auto;
        alignItems: center;
        width: auto;
        // margin: 0 1.75rem;
    }
`

const Contenedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        alignItems: center;
        width: auto;
        // margin: 0 0.75rem;
        margin: 0.5rem 1rem;
        margin-left: 19rem;
    }
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

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        alignItems: center;
        width: auto;
        padding: 10px 5px;
        margin: 1.5rem 1rem;
        margin-left: 19rem;
        
    }
`

const Titulo = styled.h2`
    // color:  #83d394;
    color:  #328AC4;
    margin: 0rem;

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        font-size: 1.2rem ;
    }
`

const Subtitulo = styled.h3`
    // color:  #83d394;
    color:  #328AC4;
    margin: 0rem;
    font-size: 1.5rem ;

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        font-size: 1.2rem ;
    }
`

const InputAdd = styled.input`
    // border: 2px solid #d1d1d1;
    border: 2px solid #328AC4;
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
    border: 2px solid #328AC4;
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

const BotonCheck = styled.button`
    width: 70px;
    padding: 5px;
    cursor: pointer;
    background-color: #a0a0a0;
    color: #fff;
    border: 1px solid #ccc;
    // border: none;
    // border-radius: 5px;
    &.activeBoton{
        background-color: #328AC4;
    }
    // &.active {
    //     background-color: #328AC4;
    //     // background-color: #16B9CF;
    // }
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
const ConfirmaModal =styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    text-align: center;
    border-radius: 5px;
`
const ConfirmaBtn = styled.div`
        margin-top: 20px;        
        display: flex;
        justify-content: space-between;
`
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

export {ContenedorProveedor, Contenedor, ContenedorElementos, ContentElemenAdd, FormularioAdd, ListarProveedor, Titulo, Subtitulo, InputAdd ,InputUpdate , Boton, BotonGuardar,BotonCheck, Boton2, ConfirmaModal, ConfirmaBtn, Overlay};