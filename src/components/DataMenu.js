import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenu = [
  {
    title: 'Mis Equipos',
    path: '/home/misequipos',
    icon: <RiIcons.RiGridFill />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Agregar Familia',
        path: '/home/misequipos/agregarfamilia',
        icon: <IoIcons.IoMdAddCircleOutline/>
      },
      {
        title: 'Agregar Tipo',
        path: '/home/misequipos/agregartipo',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Marca',
        path: '/home/misequipos/agregarmarca',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Agregar Modelo',
        path: '/home/misequipos/agregarmodelo',
        icon: <IoIcons.IoMdAddCircleOutline />
      },
      {
        title: 'Crear Equipos',
        path: '/home/misequipos/crearequipo',
        icon: <IoIcons.IoIosCreate />
      }
    ]
  },
  {
    title: 'Mis Clientes',
    path: '/home/clientes',
    icon: <FaIcons.FaUserNurse />,    
  },
  {
    title: 'Mis Proveedores',
    path: '/home/proveedores',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  {
    title: 'Transacciones',
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
  },
 
  {
    title: 'Servicio Tecnico',
    path: '/home/serviciotecnico',
    icon: <MdIcons.MdMedicalServices />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Protocolos',
        path: '/home/serviciotecnico/protocolos',
        icon: <IoIcons.IoIosAlbums />
      },
      {
        title: 'Programas',
        path: '/home/serviciotecnico/programas',
        icon: <IoIcons.IoIosTimer />
      },
      {
        title: 'Certificados',
        path: '/home/serviciotecnico/certificados',
        icon: <FaIcons.FaCertificate />
      },
      {
        title: 'Ejecutar Mant.',
        path: '/home/serviciotecnico/mantencion',
        icon: <IoIcons.IoIosPlay />
      }
    ]
  },
  {
    title: 'Configuracion',
    path: '/home/configuracion',
    icon: <MdIcons.MdManageAccounts />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Registrar Usuarios',
        path: '/home/configuracion/registrausuarios',
        icon: <FaIcons.FaUserMd />
      },
      {
        title: 'Agrgar Empresa',
        path: '/home/configuracion/agregarempresa',
        icon: <FaIcons.FaDeezer />
      }
    ]
  }
  
];
