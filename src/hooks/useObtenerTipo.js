import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerTipo = (id)=>{
    const navigate = useNavigate();
    const [tipo, setTipo] = useState([]);
    

    useEffect(()=>{
        const obtenerTipo = async ()=>{
            const docum = await getDoc(doc(db,'tipos', id));
            /* console.log(docum.data()) */
            if(docum.exists){
                setTipo(docum.data());
            }else{
                navigate('/home/misequipos/agregartipo')
            }
        }
        obtenerTipo();
    },[navigate, id])

    return [tipo]
}

export default useObtenerTipo;