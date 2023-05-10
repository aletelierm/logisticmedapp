import React from 'react'
import { Route, Routes, Navigate} from 'react-router-dom'

import Landing from '../components/Landing'
import {Home} from '../components/Home'
import Login from '../components/Login'
import Recover from '../components/ForgotPasswordForm'

export const AppRouter = () => {
  return (
    <>
    <Routes>  
        <Route path="/home/*" element={<Home/>}/>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="/*" element={<Navigate to="/login"/>}/>
    </Routes>    
    </>
    
      )
}

 


