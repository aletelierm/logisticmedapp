import { UserContext } from "./UserContext"
import React, { useState} from "react";


export const UserProvider = ({ children })=>{

   /*  const usuario = {
        id: 1234,
        name: 'Andres Letelier',
        email: 'alm@gmail.com'
    } */
     const [usuario, setUsuario] = useState();
    
    return(
        <UserContext.Provider value={{ usuario, setUsuario }}>
            { children }
        </UserContext.Provider>
    )
}