import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenuJadmin = [
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
      },
    ]
  },
  {
    title: 'Mis Pacientes',
    path: 'clientes',
    icon: <FaIcons.FaUserNurse />,
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
        title: 'Items Servicio Tecnico',
        path: 'serviciotecnico/itemsst',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Protocolo Test Ingreso',
        path: 'serviciotecnico/protocolotest',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Asignar',
        path: 'serviciotecnico/asignar',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Asignados a Tecnico',
        path: 'serviciotecnico/asignadostecnicos',
        icon: <IoIcons.IoIosAlbums />
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
