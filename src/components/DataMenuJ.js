import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenuJadmin = [

   {
    title: 'Configuracion',
    path: 'configuracion',
    icon: <MdIcons.MdManageAccounts />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Usuarios y Roles',
        path: 'configuracion/registrausuarios',
        icon: <FaIcons.FaUserMd />
      },
      /* {
        title: 'Asignar Roles',
        path: 'configuracion/asignaroles',
        icon: <RiIcons.RiProfileFill />
      }, */
      {
        title: 'Registrar Empresa',
        path: 'configuracion/agregarempresa',
        icon: <FaIcons.FaDeezer />
      },
      {
        title: 'Usuarios y Envios',
        path: 'configuracion/envios',
        icon: <MdIcons.MdEmail />
      } 
    ]
  }
];
