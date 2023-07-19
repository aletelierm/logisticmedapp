import React from 'react';
import { Pie} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend }  from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


const GraficoTorta = ({ datos }) => {
  // Define los datos del gráfico de torta
  const data = {
    labels: datos.map(dato => dato.label),
    datasets: [
      {
        data: datos.map(dato => dato.valor),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          // ... más colores si tienes más datos
        ],
      },
    ],
  };

  return <Pie data={data}/>;
};

export default GraficoTorta;
