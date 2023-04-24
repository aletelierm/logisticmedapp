import React from 'react';
import PiesChart from './DashboardEquipos';
import styled from 'styled-components';

const Contenedor = styled.div`
  
`

const ContenedorElementos = styled.div`
    margin-top: 20px;
    padding: 10px;
    border: 2px solid #d1d1d1;
    border-radius: 20px;
    box-shadow:  10px 10px 35px -7px rgba(0,0,0,0.75);;
`

const Equipos = () => {
    return (
        
        <Contenedor>
            <ContenedorElementos>
                <h2>Donde estan Mis Equipos</h2>
            </ContenedorElementos>
            <ContenedorElementos>
            <div style={{width:"600px", height:"400px",padding:"20px"}}>
                 <PiesChart/>
            </div>
            </ContenedorElementos>
        
            
        </Contenedor>
        
        
    );
};

export default Equipos;