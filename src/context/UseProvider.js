import { UserContext } from "./UserContext"


export const UserProvider = ({ children })=>{

    const usuario = {
        id: 1234,
        name: 'Andres Letelier',
        email: 'alm@gmail.com'
    }

    
    return(
        <UserContext.Provider value={{ usuario }}>
            { children }
        </UserContext.Provider>
    )
}