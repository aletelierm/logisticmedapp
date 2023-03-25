import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Equipos from "./components/Equipos";
import Productos from "./components/Proveedores";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Salidas from './components/Salidas';
import Entradas from './components/Entradas';
import Clientes from './components/Clientes';
import Usuarios from './components/Usuarios';

function App() {
  return (
    
    <div>
      <Navbar/>
      <BrowserRouter>
      <SideBar>
          <Routes>
           {/*  <Route path="/" element={<Dashboard/>}/> */}
            <Route path="/equipos" element={<Equipos/>}/>
            <Route path="/entradas" element={<Entradas/>}/>
            <Route path="/salidas" element={<Salidas/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/proveedores" element={<Productos/>}/>
            <Route path="/usuarios" element={<Usuarios/>}/>
            </Routes>
        </SideBar>
      </BrowserRouter>
      <Footer/>
    </div>
      
    
      
    
  );
}

export default App;
