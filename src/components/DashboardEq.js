import React, { useEffect, useState } from 'react';
import GraficoTorta from './GraficoTorta';
import styled from 'styled-components';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const App = () => {

    const { users } = useContext(UserContext);

    const [estado, setEstado] = useState([])
    const [datos, setDatos] = useState([])
    
  

    //Leer Datos de status
   const getStatus = async () => {
        const traerStatus = collection(db, 'status');
        const dato = query(traerStatus, where('emp_id', '==', users.emp_id));
        const data = await getDocs(dato)
        setEstado(data.docs.map((doc, index) => ({ ...doc.data(), id: doc.id })));
   }

    //Funcion agrupar datos y contar
    const agrupar = (datos)=>{
      const contador = datos.reduce((acc, obj)=>{
        const { status } = obj;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },{});
      return Object.entries(contador).map(([status, cantidad])=>({label: status,valor: cantidad}));
    };




    useEffect(()=>{
        getStatus();   
        console.log('dentro del de useefect', estado)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
 
    useEffect(()=>{
        const resultado= agrupar(estado);
        console.log('resultado nuevo arreglo',resultado)
        setDatos(resultado);
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[estado, setEstado])
  

  return (
    <Contenedor>
    <ContenedorElementos>
        <Titulo>Donde estan Mis Equipos</Titulo>
    </ContenedorElementos>
    
    <ContenedorElementos >
      <div style={{width:"600px", height:"400px",padding:"20px",marginLeft:"100px"}}>
          <GraficoTorta datos={datos} />
      </div>       
         
    </ContenedorElementos>
        
    
</Contenedor>
   /*  <div>
      <h1>Donde estan mis equipos</h1>
      <GraficoTorta datos={datos} />
    </div> */
  );
};

export default App;
const Contenedor = styled.div`

  
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
const Titulo = styled.h2`
    color:  #83d394;
`