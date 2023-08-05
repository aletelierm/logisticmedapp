import styled from 'styled-components';


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
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 200px;
`

const Formulario = styled.form``

const Input = styled.input`
    border: 2px solid #d1d1d1;
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


export {ContenedorCliente, ContentElemen, ContentElemenUser, ContentElemenMov, ContentElemenSelect, ListarEquipos, Select, Formulario, Input, Label, Contenido};