import { UserContext } from "./UserContext"
import React, { useState }  from "react";

export const UserProvider = ({ children })=>{
    const [users, setUsers] = useState();  
    
    return(
        <UserContext.Provider value={{ users,setUsers }}>
            { children }
        </UserContext.Provider>
    )
}