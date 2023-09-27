import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenuJadmin = [

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
        title: 'Programas',
        path: 'serviciotecnico/programas',
        icon: <IoIcons.IoIosTimer />
      },
      {
        title: 'Reportes',
        path: 'serviciotecnico/certificados',
        icon: <FaIcons.FaCertificate />
      },
      {
        title: 'Ejecutar Mant.',
        path: 'serviciotecnico/mantencion',
        icon: <IoIcons.IoIosPlay />
      }
    ]
  },
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
