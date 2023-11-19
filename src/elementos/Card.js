import styled from 'styled-components';

const CardList = styled.div`   
    align-items: center;
    text-align: center;
    justify-content: space-around;
    padding: 20px 0;
    display: flex;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        display: flex;
        justify-content: space-evenly;
    }
`

const Tarjeta = styled.div`   
    width: 200px;
    heigth: 400px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 20px;
    border-radius: 7px;
    text-align: center;
    align-items: center;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        display: flex;
        flex - direction: row;
        align - items: center;
        width: 150px;
        height: 320px;
        margin: 40px 0;
    }
`

const Texto = styled.div`   
    font - size: 20px;
    width: 70 %;
    /* Media query para pantallas aún más pequeñas */
    @media screen and (max-width: 576px) {
        width: 100 %;
        font - size: 18px;
    }
`
export { CardList, Tarjeta, Texto };