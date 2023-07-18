import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend }  from 'chart.js';
import { Pie }  from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

const datos = [
    { label: 'BODEGA', valor: 30},
    { label: 'PACIENTE', valor: 15},
    { label: 'SERVICIO', valor: 10}
    /* { label: 'BAJA', valor: 15},
    { label: 'OTRO', valor: 5}, */
]

var options = {
    responsive : true,
    maintainAspectRatio: false
};
/* const labels=['BODEGA','PACIENTE','SERVICIO', 'BAJA','OTRO']
const datas=[35,20,10,15] */
var data = {
    labels: datos.map(datos => datos.label),
    datasets: [
        {
            label: 'Equipos',
            data: datos.map(dato => dato.valor),
            backgroundColor: [
                'rgba(255, 99, 132,0.2',
                'rgba(54, 162, 235,0.2',
                'rgba(255, 205, 86,0.2',
                'rgba(63,191,192,0.2',
                'rgba(63,191,255,0.2',
            ],
            borderColor: [
                'rgba(255, 99, 132,0.2',
                'rgba(255, 99, 132,0.2',
                'rgba(255, 205, 86,0.2',
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