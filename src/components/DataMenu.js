import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenu = [
  {
    title: 'Mis Equipos',
    path: '/misequipos',
    icon: <RiIcons.RiGridFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Agregar Familia',
        path: '/misequipos/agregarfamilia',
        icon: <IoIcons.IoMdAddCircleOutline/>
      },
      {
        title: 'Agregar Tipo',
        path: '/misequipos/agregarcategoria',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Modelo',
        path: '/misequipos/agregarmodelo',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Marca',
        path: '/misequipos/agregarmarca',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Crear Equipos',
        path: '/misequipos/productos',
        icon: <IoIcons.IoIosCreate />
      }
    ]
  },
  {
    title: 'Mis Clientes',
    path: '/clientes',
    icon: <FaIcons.FaUserNurse />,    
  },
  {
    title: 'Mis Proveedores',
    path: '/proveedores',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: 'Transacciones',
    path: '/transacciones',
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Entradas',
        path: '/entradas',
        icon: <MdIcons.MdInput />,
        cName: 'sub-nav'
      },
      {
        title: 'Salidas',
        path: '/salidas',
        icon: <MdIcons.MdOutput />,
        cName: 'sub-nav'
      }
      
    ]
  },
 
  {
    title: 'Servicio Tecnico',
    path: '/messages',
    icon: <MdIcons.MdMedicalServices />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Protocolos',
        path: '/protocolos',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Programas',
        path: '/programas',
        icon: <IoIcons.IoIosTimer />
      },
      {
        title: 'Certificados',
        path: '/certificaados',
        icon: <FaIcons.FaCertificate />
      },
      {
        title: 'Ejecutar Mant.',
        path: '/ejecutar',
        icon: <IoIcons.IoIosPlay />
      }
    ]
  },
  {
    title: 'Configuracion',
    path: '/support',
    icon: <MdIcons.MdManageAccounts />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Registrar Usuarios',
        path: '/usuarios',
        icon: <FaIcons.FaUserMd />
      },
      {
        title: 'Empresas',
        path: '/empresas',
        icon: <FaIcons.FaDeezer />
      }
    ]
  }
  
];
