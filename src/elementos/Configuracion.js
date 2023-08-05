import styled from 'styled-components';


const ContenedorUser = styled.div`
    width: 700px;
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
    font-size: 15px;
`
const ContentElemenUser = styled.div`   
    display: flex;
    padding: 10px;
    font-size: 15px;
    text-align: center;
    align-items: center;    
`

const ContentElemenEmp = styled.div`
    display: flex;
    text-align: center;
    padding: 7px;
    margin-right: 30px;
    align-items: center;
    justify-content: space-between;
`

const InputUser = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 100%;
`

const InputEmp = styled.input`
    border: 2px solid  #328AC4;
    border-radius: 10px;
    padding: 5px;
    margin-left: 5%;
`

const LabelUser = styled.label`
        font-size: 15px;
        padding: 5px;
`

const SelectUser = styled.select`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    width: 100%;
`


export {ContenedorUser, ContentElemenUser, ContentElemenEmp, InputUser, InputEmp, LabelUser, SelectUser};