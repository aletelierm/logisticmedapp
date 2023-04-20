import React from 'react'
import { useNavigate } from 'react-router-dom'

 const ActualizaProveedor = () => {

  const navigate = useNavigate();
  const volver = ()=>{
      navigate('/home/proveedores')
  }

  return (
    <div>
          <h2>Actualiza Proveedor</h2>
          <button onClick={volver}>Volver</button>
    </div>
    
  )
}

export default ActualizaProveedor;