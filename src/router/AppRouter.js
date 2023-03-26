import React from 'react'
import { Route, Routes} from 'react-router-dom'

import Landing from '../components/Landing'
import {Home} from '../components/Home'


export const AppRouter = () => {
  return (
    <>
    <Routes>  
            <Route path="/home/*" element={<Home/>}/>
            <Route path="/" element={<Landing/>}/>
    </Routes>    
    </>
    
      )
}

 


