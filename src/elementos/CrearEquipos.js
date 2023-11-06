import styled from 'styled-components';
import theme from '../theme2';

const ContenedorCliente = styled.div`
width: 70%;
`

const ContentElemen = styled.div`   
    display: flex;
    justify-content: space-between;
    padding: 20px;
`

const ContentElemenUser = styled.div`   
    display: flex;
    padding: 10px;
    font-size: 15px;
    text-align: center;
    align-items: center;    
`

const ContentElemenMov = styled.div`
    display: flex;
    justify-content: space-evenly;
    padding: 5px 10px;
`

const ContentElemenSelect = styled.div`
    padding: 20px;
`

const ListarEquipos = styled.div`
    margin: 20px 0;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.40);
`

const Select = styled.select`
    border: 2px solid #328AC4;
    border-radius: 10px;
    padding: 5px;
    width: 200px;
`

const Formulario = styled.form``

const Input = styled.input`
    border: 2px solid #328AC4;
    border-radius: 10px;
    padding: 5px;
`
const Label = styled.label`
    padding: 5px;
    font-size: 20px;
`

const Contenido = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ContenedorInput = styled.div`
position: relative;

    // input {
    //     font-family: 'Work Sans', sans-serif;
    //     box-sizing: border-box;
    //     background: ${theme.grisClaro};
    //     cursor: pointer;
    //     border-radius: 0.625rem; /* 10px */
    //     width: 100%;
    //     text-align: center;
    //     outline: none;
    // }
    .rdp {
        position: absolute;
    }
    .rdp-months {
        display: flex;
        justify-content: center;
        margin-left: -1.75rem;
    }

    .rdp-month {
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 20px;
        border-radius: 10px;
    }

    @media (max-width: 60rem) {
        /* 950px */
        & > * {
            width: 100%;
        }
    }
`

export { ContenedorCliente, ContentElemen, ContentElemenUser, ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label, Contenido, ContenedorInput };