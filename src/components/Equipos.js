import React from 'react';
import PiesChart from './DashboardEquipos';

const Equipos = () => {
    return (
        <div>
            <h2>Donde estan Mis Equipos</h2>
            <div style={{width:"600px", height:"400px"}}>
                 <PiesChart/>
            </div>
            
        </div>
    );
};

export default Equipos;