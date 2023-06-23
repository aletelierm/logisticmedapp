import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, useLocation } from "react-router-dom";


export const PrivateRoutes = ({ children }) => {

    const { users } = useContext(UserContext);
    const { pathname, search} = useLocation();
    const lastPath = pathname + search;
    localStorage.setItem('lastPath', lastPath)

  return (users)
             ? children 
             : <Navigate to='/login'/>
}
