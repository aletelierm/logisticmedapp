import { useState } from "react"
import { UserContext } from "./UserContext"


export const UserProvider = ({ children })=>{

    const [global, setGlobal]=useState('')

    return(
        <UserContext.Provider value={{global, setGlobal}}>
            { children }
        </UserContext.Provider>
    )
}