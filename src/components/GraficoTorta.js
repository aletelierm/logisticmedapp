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
          'rgb(125, 217, 235)',
          'rgb(51, 255, 224)',
          'rgb(51, 215, 255)',
          'rgb(27, 140, 240 )',
          'rgb(16, 191, 226 )',
          'rgb(51, 255, 134 )',
          'rgb(16, 191, 150 )',
          'rgb(16, 191, 100)',
          // ... más colores si tienes más datos
        ],
      },
    ],
  };
  return <Pie data={data}/>;
};

export default GraficoTorta;
