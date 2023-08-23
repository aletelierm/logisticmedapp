import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerUsuarioAlertas = (id)=>{
    const navigate = useNavigate();
    const [usuariosAlertas, setUsuariosAlertas] = useState([]);
    

    useEffect(()=>{
        const obtenerUsuario = async ()=>{
            const docum = await getDoc(doc(db,'usuariosalertas', id));
                         
            if(docum.exists){
                setUsuariosAlertas(docum.data());
                
            }else{
                navigate('/configuracion/envios')
            }
        }
        obtenerUsuario();

    },[id, navigate]);

    return [usuariosAlertas];

}

export default useObtenerUsuarioAlertas;