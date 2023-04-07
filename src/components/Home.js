import React from 'react'
import { Routes, Route} from 'react-router-dom'

import Navbar from './Navbar';
import Footer from './Footer';
import SideBar from './SideBar';

import Equipos from './Equipos';
import Entradas from './Entradas';
import Salidas from './Salidas';
import Clientes from './Clientes';
import Proveedores from './Proveedores';
import Usuarios from './Usuarios';
import AgregarFamilia from './AgregarFamilia';
import AgregarTipo from './AgregarTipo';
import AgregraMarca from './AgregarMarca';
import AgregarModelo from './AgregarModelo';
import CrearEquipo from './CrearEquipo';

  // ingresando al home => erivas
export const Home = () => {
  return (
    <div>
    <Navbar/>  
    <SideBar>    
    <Routes>
            <Route path="/misequipos" element={<Equipos/>}/>
            <Route path="/misequipos/agregarfamilia" element={<AgregarFamilia/>}/>
            <Route path="/misequipos/agregartipo" element={<AgregarTipo/>}/>
            <Route path="/misequipos/agregarmodelo" element={<AgregarModelo/>}/>
            <Route path="/misequipos/agregarmarca" element={<AgregraMarca/>}/>
            <Route path="/misequipos/crearequipo" element={<CrearEquipo/>}/>
            <Route path="/entradas" element={<Entradas/>}/>
            <Route path="/salidas" element={<Salidas/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/proveedores" element={<Proveedores/>}/>
            <Route path="/registrarusuarios" element={<Usuarios/>}/>           
    </Routes>
    </SideBar>
    
    <Footer/>
    </div>
  )
}
