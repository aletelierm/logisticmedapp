import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

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
            cName: 'sub-nav'
          }
          
        ]
      }
      
    ]
  }
];
