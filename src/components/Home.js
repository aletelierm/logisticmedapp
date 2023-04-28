import React from 'react'
import { Routes, Route} from 'react-router-dom'


import Footer from './Footer';
import SideBar from './SideBar';

import Equipos from './Equipos';
import Entradas from './Entradas';
import Salidas from './Salidas';
import Clientes from './Clientes';
import Proveedores from './Proveedores';
/* import Usuarios from './Usuarios'; */
import AgregarFamilia from './AgregarFamilia';
import AgregarTipo from './AgregarTipo';
import AgregraMarca from './AgregarMarca';
import AgregarModelo from './AgregarModelo';
import CrearEquipo from './CrearEquipo';
import Transaccion from './Transaccion';
import ServicioTecnico from './ServicioTecnico';
import Protocolos from './Protocolos';
import Programas  from './Programas';
import Certificados from './Certificados';
import Mantenimiento from './Mantenimiento';
import Configuracion from './Configuracion';
import NavbarSesion from './NavbarSesion';
import AgregarEmpresa from './AgregarEmpresa';
import ActualizaProveedor from './ActualizaProveedor';
import AsignarRoles from './AsignarRoles';
import { RegistroUsuarios } from './RegistroUsuarios';
import ActualizaCliente from './ActualizaCliente';

  // ingresando al home => erivas
export const Home = () => {
  
  
  return (
    <div>  
    <NavbarSesion />
    <SideBar>    
    <Routes>
            <Route path="/misequipos" element={<Equipos/>}/>
            <Route path="/misequipos/agregarfamilia" element={<AgregarFamilia/>}/>
            <Route path="/misequipos/agregartipo" element={<AgregarTipo/>}/>
            <Route path="/misequipos/agregarmarca" element={<AgregraMarca/>}/>
            <Route path="/misequipos/agregarmodelo" element={<AgregarModelo/>}/>
            <Route path="/misequipos/crearequipo" element={<CrearEquipo/>}/>
            <Route path="/transacciones" element={<Transaccion/>}/>
            <Route path="/transacciones/entradas" element={<Entradas/>}/>
            <Route path="/transacciones/salidas" element={<Salidas/>}/>
            <Route path="/serviciotecnico" element={<ServicioTecnico/>}/>
            <Route path="/serviciotecnico/protocolos" element={<Protocolos/>}/>
            <Route path="/serviciotecnico/programas" element={<Programas/>}/>
            <Route path="/serviciotecnico/certificados" element={<Certificados/>}/>
            <Route path="/serviciotecnico/mantencion" element={<Mantenimiento/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/proveedores" element={<Proveedores/>}/>
            <Route path="/actualizaproveedor" element={<ActualizaProveedor/>}/>
            <Route path="/actualizacliente" element={<ActualizaCliente/>}/>
            <Route path="/configuracion" element={<Configuracion/>}/>        
            <Route path="/configuracion/registrausuarios" element={<RegistroUsuarios/>}/>
            <Route path="/configuracion/asignaroles" element={<AsignarRoles/>}/>
            <Route path="/configuracion/agregarempresa" element={<AgregarEmpresa/>}/>

    </Routes>
    </SideBar>
    
    <Footer/>
    </div>
  )
}

export default Home;