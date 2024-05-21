import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';


export const DataMenuSt= [
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
