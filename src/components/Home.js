import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SideBar from './SideBar';
import Entradas from './Entradas';
import Salidas from './Salidas';
import Clientes from './Clientes';
import Proveedores from './Proveedores';
import AgregarFamilia from './AgregarFamilia';
import AgregarTipo from './AgregarTipo';
import AgregraMarca from './AgregarMarca';
import AgregarModelo from './AgregarModelo';
import CrearEquipo from './CrearEquipo';
import Transaccion from './Transaccion';
import ServicioTecnico from './ServicioTecnico';
import Protocolos from './Protocolos';
// import Programas from './Programas';
// import Certificados from './Certificados';
import Mantenimiento from './Mantenimiento';
import Configuracion from './Configuracion';
import NavbarSesion from './NavbarSesion';
import AgregarEmpresa from './AgregarEmpresa';
import ActualizaProveedor from './ActualizaProveedor';
import { RegistroUsuarios } from './RegistroUsuarios';
import ActualizaCliente from './ActualizaCliente';
import ActualizaFamilia from './ActualizaFamilia';
import ActualizaTipo from './ActualizaTipo';
import ActualizaMarca from './ActualizaMarca';
import ActualizaModelo from './ActualizaModelo';
import ActualizaEmpresa from './ActualizaEmpresa';
import DashboardEq from './DashboardEq';
import AsignarRfid from './AsignarRfid';
import ReporteHistoriaEquipo from './ReporteHistoriaEquipo';
import ReporteHistoriaCliente from './ReporteHistoriaCliente';
import ReporteStatus from './ReporteStatus';
import ReporteMovimientos from './ReporteMovimientosES';
import ReporteInvCliente from './ReporteInvCliente';
import { Reportes } from './Reportes';
import Confirmados from './Confirmados';
import UsuariosEnvios from './UsuariosAlertas';
import ActualizaUsuariosAlertas from './ActualizaUsuariosAlertas';
import AgregarItems from './AgregarItems';
import EjecutarMantencion from './EjecutarMantencion';
import Bitacoras from './Bitacoras';
import Traspasos from './Traspasos';
import CheckMantoPDF from './CheckMantoPDF';
import IngresoEquiposST from './IngresoEquiposST';
// import TestIngreso from './TestIngreso';
import ItemsST from './ItemsST';
import ProtocolosTest from './ProtocolosTest';
import IngresoEquiposSTPDF from './IngresoEquiposSTPDF';
import Asignar from './Asignar';
import AsignadosTecnicos from './AsignadosTecnicos';
import EjecutarPresupuesto from './EjecutarPresupuesto';
import ProgramaMant from './ProgramaMant';
import ListadoMant from './ListadoMant';
// import ItemsRepuestosServicios from './ItemsRepuestosServicios';

export const Home = () => {
  return (
    <div>    
    <NavbarSesion />
    <SideBar>     
    <Routes>
            <Route path="home" element={<DashboardEq/>}/>
            <Route path="misequipos" element={<DashboardEq/>}/>
            <Route path="misequipos/agregarfamilia" element={<AgregarFamilia/>}/>
            <Route path="actualizafamilia/:id" element={<ActualizaFamilia/>}/>
            <Route path="misequipos/agregartipo" element={<AgregarTipo/>}/>
            <Route path="actualizatipo/:id" element={<ActualizaTipo/>}/>
            <Route path="misequipos/agregarmarca" element={<AgregraMarca/>}/>
            <Route path="actualizamarca/:id" element={<ActualizaMarca/>}/>
            <Route path="misequipos/agregarmodelo" element={<AgregarModelo/>}/>
            <Route path="actualizamodelo/:id" element={<ActualizaModelo/>}/>
            <Route path="misequipos/crearequipo" element={<CrearEquipo/>}/>
            <Route path="misequipos/asignarfid" element={<AsignarRfid/>}/>
            <Route path="transacciones" element={<Transaccion/>}/>
            <Route path="transacciones/entradas" element={<Entradas/>}/>
            <Route path="transacciones/salidas" element={<Salidas/>}/>
            <Route path="transacciones/traspasos" element={<Traspasos/>}/>
            <Route path="reportes" element={<Reportes/>}/>
            <Route path="reportes/reporte1" element={<ReporteHistoriaEquipo/>}/>
            <Route path="reportes/reporte2" element={<ReporteStatus/>}/>
            <Route path="reportes/reporte3" element={<ReporteHistoriaCliente/>}/>
            <Route path="reportes/reporte4" element={<ReporteMovimientos/>}/>
            <Route path="reportes/reporte5" element={<ReporteInvCliente/>}/>
            <Route path="serviciotecnico" element={<ServicioTecnico/>}/>
            <Route path="serviciotecnico/items" element={<AgregarItems/>}/>            
            <Route path="alertamantencion/programa" element={<ProgramaMant/>}/>          
            <Route path="alertamantencion/listadomant" element={<ListadoMant/>}/>          
            <Route path="serviciotecnico/protocolos" element={<Protocolos/>}/>            
            {/* <Route path="serviciotecnico/programas" element={<Programas/>}/> */}
            {/* <Route path="serviciotecnico/certificados" element={<Certificados/>}/> */}
            <Route path="serviciotecnico/mantencion" element={<Mantenimiento/>}/>
            <Route path="ejecutarmantencion/:id" element={<EjecutarMantencion/>}/>
            <Route path="serviciotecnico/bitacora" element={<Bitacoras/>}/>
            <Route path="checkmantencion/:id" element={<CheckMantoPDF/>}/>
            <Route path="clientes" element={<Clientes/>}/>
            <Route path="proveedores" element={<Proveedores/>}/>
            <Route path="actualizaproveedor/:id" element={<ActualizaProveedor/>}/>
            <Route path="actualizacliente/:id" element={<ActualizaCliente/>}/>
            <Route path="serviciotecnico" element={<ServicioTecnico/>}/>        
            <Route path="serviciotecnico/ingreso" element={<IngresoEquiposST/>}/> 
            <Route path="ingresopdf/:id/:ruta" element={<IngresoEquiposSTPDF/>}/>       
            {/* <Route path="serviciotecnico/testingreso" element={<TestIngreso/>}/>         */}
            <Route path="serviciotecnico/itemsst" element={<ItemsST/>}/>        
            <Route path="serviciotecnico/protocolotest" element={<ProtocolosTest/>}/>       
            <Route path="serviciotecnico/asignar" element={<Asignar/>}/>       
            <Route path="serviciotecnico/asignadostecnicos" element={<AsignadosTecnicos/>}/>  
            <Route path="ejecutarpresupuesto/:id" element={<EjecutarPresupuesto/>}/>
            {/* <Route path="serviciotecnico/itemsrepuestosyservicios" element={<ItemsRepuestosServicios/>}/>        */}
            <Route path="configuracion" element={<Configuracion/>}/>        
            <Route path="configuracion/registrausuarios" element={<RegistroUsuarios/>}/>
            <Route path="configuracion/agregarempresa" element={<AgregarEmpresa/>}/>
            <Route path="configuracion/actualizaempresa/:id" element={<ActualizaEmpresa/>}/>
            <Route path="configuracion/envios" element={<UsuariosEnvios/>}/>
            <Route path="configuracion/actualizaalerta/:id" element={<ActualizaUsuariosAlertas/>}/>
            <Route path="confirmados" element={<Confirmados/>}/>
            <Route path="/" element={<Navigate to="/login"/>}/>
    </Routes>    
    </SideBar>   
    {/* <Footer/> */}
    </div>
  )
}

export default Home;