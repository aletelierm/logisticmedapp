import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerUsuario = (id)=>{
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    

    useEffect(()=>{
        const obtenerUsuario = async ()=>{
            const docum = await getDoc(doc(db,'usuarios', id));
             console.log('desde obtener usuario',docum.data())
            
            if(docum.exists){
                setUsuarios(docum.data());
                
            }else{
                navigate('/misequipos')
            }
        }
        obtenerUsuario();

    },[id, navigate]);

    return [usuarios];

}

export default useObtenerUsuario;