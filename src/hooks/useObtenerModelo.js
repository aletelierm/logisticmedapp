import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerModelo = (id)=>{
    const navigate = useNavigate();
    const [modelo, setModelo] = useState([]);

    useEffect(()=>{
        const obtenerModelo = async ()=>{
            const docum = await getDoc(doc(db,'modelos', id));
            if(docum.exists){
                setModelo(docum.data());
                
            }else{
                navigate('/home/misequipos/agregarmodelo')
            }
        }
        obtenerModelo();
    },[navigate, id])

    return [modelo]
}

export default useObtenerModelo;