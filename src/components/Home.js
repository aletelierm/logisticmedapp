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

  // ingresando al home => erivas
export const Home = () => {
  return (
    <div>
    <Navbar/>  
    <SideBar>    
    <Routes>
            <Route path="/home/misequipos" element={<Equipos/>}/>
            <Route path="/entradas" element={<Entradas/>}/>
            <Route path="/salidas" element={<Salidas/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/proveedores" element={<Proveedores/>}/>
            <Route path="/usuarios" element={<Usuarios/>}/>           
    </Routes>
    </SideBar>
    
    <Footer/>
    </div>
  )
}
