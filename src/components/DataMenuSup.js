import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';
import * as GiIcons from 'react-icons/gi';


export const DataMenuSup = [
  {
    title: 'Movimientos',
    path: 'transacciones',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Entradas',
        path: 'transacciones/entradas',
        icon: <MdIcons.MdInput />,
        cName: 'sub-nav'
      },
      {
        title: 'Salidas',
        path: 'transacciones/salidas',
        icon: <MdIcons.MdOutput />,
        cName: 'sub-nav',
      },
      {
        title: 'Traspasos',
        path: 'transacciones/traspasos',
        icon: <MdIcons.MdOutput />,
        cName: 'sub-nav'
      }
    ]
  },
  {
    title: 'Reportes',
    path: 'reportes',
    icon: <IoIcons.IoIosInformationCircle />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Historial por Equipo',
        path: 'reportes/reporte1',
        icon: <MdIcons.MdHistory />,
        cName: 'sub-nav'
      },
      {
        title: 'Historial por Paciente',
        path: 'reportes/reporte3',
        icon: <IoIcons.IoIosMedkit />,
        cName: 'sub-nav'
      },
      {
        title: 'Status de Equipos',
        path: 'reportes/reporte2',
        icon: <GiIcons.GiDeerTrack />,
        cName: 'sub-nav'
      },
      {
        title: 'Movimientos',
        path: 'reportes/reporte4',
        icon: <FaIcons.FaListUl />,
        cName: 'sub-nav'
      },
      {
        title: 'Inventario Paciente',
        path: 'reportes/reporte5',
        icon: <MdIcons.MdOutlineInventory />,
        cName: 'sub-nav'
      }
    ]
  }
];
