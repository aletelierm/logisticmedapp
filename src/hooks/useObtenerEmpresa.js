import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerEmpresa = (id)=>{
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    useEffect(()=>{
        const obtenerEmpresa = async ()=>{
            const docum = await getDoc(doc(db,'empresas', id));                        
            if(docum.exists){
                setEmpresas(docum.data());                
            }else{
                navigate('/home/configuracion/agregarempresa')
            }
        }
        obtenerEmpresa();
    },[navigate, id])
    return [empresas]
}
export default useObtenerEmpresa;