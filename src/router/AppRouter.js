import React from 'react'
import { Route, Routes} from 'react-router-dom'

import Landing from '../components/Landing'
import {Home} from '../components/Home'
import Error404 from '../components/Error404'

export const AppRouter = () => {
  return (
    <>
    <Routes>          
            <Route path='*' element={<Error404/>}/>
            <Route path="/home/*" element={<Home/>}/>
            <Route path="/" element={<Landing/>}/>
    </Routes>
    {/* <Routes>
            <Route path="/equipos" element={<Equipos/>}/>
            <Route path="/entradas" element={<Entradas/>}/>
            <Route path="/salidas" element={<Salidas/>}/>
            <Route path="/clientes" element={<Clientes/>}/>
            <Route path="/proveedores" element={<Proveedores/>}/>
            <Route path="/usuarios" element={<Usuarios/>}/>
    </Routes> */}
    </>
    
      )
}

 


