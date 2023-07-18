import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend }  from 'chart.js';
import { Pie }  from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

var options = {
    responsive : true,
    maintainAspectRatio: false
};
const labels=['BODEGA','PACIENTE','SERVICIO', 'BAJA','OTRO']
const datas=[35,20,10,15]
var data = {
    labels: labels,
    datasets: [
        {
            label: 'Equipos',
            data: datas,
            backgroundColor: [
                'rgba(63,191,131,0.2',
                'rgba(63,191,86,0.2',
                'rgba(63,191,235,0.2',
                'rgba(63,191,192,0.2',
                'rgba(63,191,255,0.2',
            ],
            borderColor: [
                'rgba(63,191,131,0.2',
                'rgba(63,191,86,0.2',
                'rgba(63,191,235,0.2',
                'rgba(63,191,192,0.2',
                'rgba(63,191,255,0.2',
            ],
            borderWidth: 1,
        },
        
    ],
};


export default function Equipos(){
    return <Pie data={data} options={options}/>
};