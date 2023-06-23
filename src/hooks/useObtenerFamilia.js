import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerFamilia = (id)=>{
    const navigate = useNavigate();
    const [familia, setFamilia] = useState([]);
    

    useEffect(()=>{
        const obtenerFamilia = async ()=>{
            const docum = await getDoc(doc(db,'familias', id));
            /* console.log(docum.data()) */
            
            if(docum.exists){
                setFamilia(docum.data());
                
            }else{
                navigate('/home/misequipos/agregarfamilia')
            }
        }
        obtenerFamilia();

    },[navigate, id])

    return [familia]

}

export default useObtenerFamilia;