import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
/* import { useNavigate } from 'react-router-dom'; */
import { auth } from '../firebase/firebaseConfig';
import { Table } from 'semantic-ui-react';
import AgregarEmpresaDb from '../firebase/AgregarEmpresaDb';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const AgregarEmpresa = () => {

    /* const navigate = useNavigate(); */
    const user = auth.currentUser;    
    let fechaAdd = new Date();
    let fechaMod = new Date();

    const [empresa, setEmpresa] = useState('');
    const [leer, setLeer] = useState([])

    const handleChange = (e)=>{
       setEmpresa(e.target.value) ;
       
    }

    const handleSubmit = (e)=>{
            e.preventDefault();           
            if(empresa ===''){                
                alert('campo no puede estar vacio')
                
            }else{
               
                AgregarEmpresaDb({
                    empresa: empresa,
                    userAdd: user.email,
                    userMod: user.email,                
                    fechaAdd: fechaAdd,
                    fechaMod: fechaMod
                })
                .then(()=>{
                    alert('datos grabados correctamente')
                    setEmpresa('');
                })
                
            }
            
    }

   /*  const volver = () => {
        navigate('/home/volver')
    } */

    const getData = async ()=>{
        const data = await getDocs(collection(db, "empresas"));
        setLeer(data.docs.map((doc)=>({...doc.data(),id: doc.id} )))
        
    }

    useEffect(()=>{
        getData();
    },[setEmpresa,empresa])

    return (
        <ContenedorProveedor>
            <ContenedorFormulario>
                    <h2>Empresas</h2>
            </ContenedorFormulario>
            
            <ContenedorFormulario>
                <Formulario onSubmit={handleSubmit}>
                    <ContentElemen>
                        <Label>Agregar Empresa</Label>
                    </ContentElemen>
                    <ContentElemen>
                        <Input
                            type='text'
                            placeholder='Ingrese Empresa'
                            name='empresa'
                            value={empresa}
                            onChange={handleChange}
                        />
                    </ContentElemen>
                    <Boton>Agregar</Boton>
                </Formulario>
            </ContenedorFormulario>
            <ListarProveedor>
                <h2>Listado de Empresas</h2>
                <Table singleLine>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>N°</Table.HeaderCell>
                            <Table.HeaderCell>Empresa</Table.HeaderCell>
                            <Table.HeaderCell>Accion</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {leer.map((item, index)=>{
                                return(
                                    <Table.Row>
                                    <Table.Cell>{index+1}</Table.Cell>
                                    <Table.Cell>{item.empresa}</Table.Cell>
                                    <Table.Cell><Boton /* onClick={volver} */>Modif</Boton></Table.Cell>
                                    </Table.Row>
                                )
                        })}
                        
                    </Table.Body>

                </Table>
            </ListarProveedor>
        </ContenedorProveedor>
    );
};

const ContenedorProveedor = styled.div``

const ContenedorFormulario = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const ContentElemen = styled.div`
    text-align: center;
    padding: 7px;
`

const ListarProveedor = styled.div`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);
`
const Formulario = styled.form`
    display: flex;
    padding: 20px;
    text-align: center;
    align-items: center;
`

const Input = styled.input`
    border: 2px solid #d1d1d1;
    border-radius: 10px;
    padding: 5px;
    
`

const Label = styled.label`
        padding: 10px;
        font-size: 20px;
`

const Boton = styled.button`
        background-color: #83d394;
        padding: 10px;
        border-radius: 5px;
        border: none;
        margin-top: 5px;
        margin-left: 20px;
`

export default AgregarEmpresa;