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
          'rgb(51, 255, 70)',
          'rgb(51, 255, 224)',
          'rgb(51, 215, 255)',
          'rgb(187, 255, 51)',
          'rgb(25, 188, 20)',

          // ... más colores si tienes más datos
        ],
      },
    ],
  };

  return <Pie data={data}/>;
};

export default GraficoTorta;
