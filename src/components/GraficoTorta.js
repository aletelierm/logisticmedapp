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
          'rgb(255, 199, 51)',
          'rgb(51, 255, 224)',
          'rgb(51, 200, 255)',
          'rgb(128, 51, 255 )',
          'rgb(51, 255, 134 )',
          'rgb(236, 255, 51 )',
          'rgb(255, 128, 51)',
          // ... más colores si tienes más datos
        ],
      },
    ],
  };
  return <Pie data={data}/>;
};

export default GraficoTorta;
