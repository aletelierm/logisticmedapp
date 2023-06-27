import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenuSup = [
  
  {
    title: 'Movimientos',
    path: '/home/transacciones',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Entradas',
        path: '/home/transacciones/entradas',
        icon: <MdIcons.MdInput />,
        cName: 'sub-nav'
      },
      {
        title: 'Salidas',
        path: '/home/transacciones/salidas',
        icon: <MdIcons.MdOutput />,
        cName: 'sub-nav'
      }
      
    ]
  }
 
   
  
];
