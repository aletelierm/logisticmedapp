import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenuTec = [
  {
    title: 'Mantenciones',
    path: 'serviciotecnico',
    icon: <MdIcons.MdMedicalServices />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Items',
        path: 'serviciotecnico/items',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Protocolos',
        path: 'serviciotecnico/protocolos',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Ejecutar Mant.',
        path: 'serviciotecnico/mantencion',
        icon: <IoIcons.IoIosPlay />
      },
      {
        title: 'Bitacora.',
        path: 'serviciotecnico/bitacora',
        icon: <MdIcons.MdOutlineWorkHistory />
      }
    ]
  },
];
