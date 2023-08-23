import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const DataMenu = [
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
      {
        title: 'Crear Equipos',
        path: 'misequipos/crearequipo',
        icon: <IoIcons.IoIosCreate />
      },
      {
        title: 'Asignar RFID',
        path: 'misequipos/asignarfid',
        icon: <IoIcons.IoIosCreate />
      }
    ]
  },
  {
    title: 'Mis Pacientes',
    path: 'clientes',
    icon: <FaIcons.FaUserNurse />,
  },
  {
    title: 'Mis Proveedores',
    path: 'proveedores',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
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
        cName: 'sub-nav'
      }

    ]
  },
  {
    title: 'Confirmados',
    path: 'confirmados',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  },
  /* {
    title: 'Pruebas',
    path: 'pruebas',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
  }, */
  {
    title: 'Reportes',
    path: 'reportes',
    icon: <IoIcons.IoIosInformationCircle />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Historial por Equipo',
        path: 'reportes/reporte1',
        icon: <IoIcons.IoIosMedkit />,
        cName: 'sub-nav'
      },
      {
        title: 'Status de Equipos',
        path: 'reportes/reporte2',
        icon: <MdIcons.MdOutput />,
        cName: 'sub-nav'
      }

    ]
  },

  {
    title: 'Servicio Tecnico',
    path: 'serviciotecnico',
    icon: <MdIcons.MdMedicalServices />,

    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
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
        title: 'Certificados',
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
