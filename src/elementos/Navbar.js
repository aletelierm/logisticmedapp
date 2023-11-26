import styled from 'styled-components';

const Nav = styled.div`
    background-color: #D9D9D9;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    padding: 5px 30px;

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        padding: 5px 15px;
    }
`

const NavSesion = styled.div`
    background-color: #D9D9D9;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 70px;
    align-items: center;
    padding: 5px 30px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        display: flex;
        align-items: center;
        padding: 5px 10px;
    }
`

const ContenedorImagen = styled.div`
    width: 200px;
    height: 70px;
    margin-right: 20px;
    img{
        width: 100%;
        height: 70px;
    }
`
const ContenedorImagenSesion = styled.div`
    width: 150px;
    height: 60px;
    margin-right: 20px;
    img{
        width: 100%;
        height: 60px;
    }
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        width: 120px;
        margin-right: 10px;
        img{
            width: 100%;
            height: 60px;
        }
    }
`
const ContenedorImagenSesion2 = styled.div`
    width: 100px;
    height: 60px;
    margin-right: 20px;
    img{
        width: 100%;
        height: 60px;
    }
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        width: 100px;
        margin-right: 10px;
        img{
            width: 100%;
            height: 60px;
        }
    }
`

const User = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 20px;
    margin: 10px 10px;
`

const UserSesion = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    font-size: 25px;
    margin-right: 10px;
    
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        margin-right: 5px;
        margin: 10px 0px;
    }
`

const Texto = styled.div`
    margin-right: 10px;
    font-weight: 300;
    font-size: 25px;
    color: #ffffff;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        margin-right: 0px;
        font-size: 15px;
    }
`

const TextoNavSesion = styled.div`
    margin-right: 10px;
    font-weight: 300;
    font-size: 18px;
    color: #000000;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        font-size: 7px;
    }
`
const Boton = styled.div`
    width: 64px;
    height: 64px;
    color: #16B9CF;
    cursor: pointer;
`
const BotonSesion = styled.div`
    width: 64px;
    height: 64px;
    color: #16B9CF;
    cursor: pointer;
    text-align: center;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        width: 32px;
        height: 32px;
        svg {
            width: 32px;
            height: 32px;
        }
    }
`

const BotonSesion2 = styled.div`
    width: 32px;
    height: 32px;
    color: #16B9CF;
    cursor: pointer;
    text-align: center;
    // margin-right: 7px;
    // margin-top: 10px;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        width: 32px;
        height: 32px;
        svg {
            width: 16px;
            height: 16px;
        }
    }
`


export { Nav, NavSesion, ContenedorImagen, ContenedorImagenSesion, ContenedorImagenSesion2, User, UserSesion, Texto, TextoNavSesion, Boton, BotonSesion, BotonSesion2 };