import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';


export const DataMenuSt= [
  {
    title: 'Mis Equipos',
    path: 'misequipos',
    icon: <RiIcons.RiGridFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Agregar Familia',
        path: 'misequipos/agregarfamilia',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Tipo',
        path: 'misequipos/agregartipo',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Marca',
        path: 'misequipos/agregarmarca',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Modelo',
        path: 'misequipos/agregarmodelo',
        icon: <IoIcons.IoMdAddCircleOutline />
      }
    ]
  },
  {
    title: 'Servicio Tecnico',
    path: 'serviciotecnico',
    icon: <MdIcons.MdSettings />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Ingreso de Equipos',
        path: 'serviciotecnico/ingreso',
        icon: <MdIcons.MdInput />
      },
      {
        title: 'Asignados a Tecnico',
        path: 'serviciotecnico/asignadostecnicos',
        icon: <IoIcons.IoIosAlbums />
      }
    
    ]
  }
  
];
