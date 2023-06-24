import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerMarca = (id)=>{
    const navigate = useNavigate();
    const [marca, setMarca] = useState([]);
    

    useEffect(()=>{
        const obtenerMarca = async ()=>{
            const docum = await getDoc(doc(db,'marcas', id));
            /* console.log(docum.data()) */
            
            if(docum.exists){
                setMarca(docum.data());
                
            }else{
                navigate('/home/misequipos/agregarmarca')
            }
        }
        obtenerMarca();

    },[navigate, id])

    return [marca]

}

export default useObtenerMarca;