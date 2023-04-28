import React from 'react'
import { useNavigate } from 'react-router-dom'

 const ActualizaCliente = () => {

  const navigate = useNavigate();
  const volver = ()=>{
      navigate('/home/clientes')
  }

  return (
    <div>
          <h2>Actualiza Cliente</h2>
          <button onClick={volver}>Volver</button>
    </div>
    
  )
}

export default ActualizaCliente;