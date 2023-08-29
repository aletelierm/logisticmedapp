import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerProveedor = (id)=>{
    const navigate = useNavigate();
    const [proveedor, setProveedor] = useState([]);

    useEffect(()=>{
        const obtenerProveedor = async ()=>{
            const docum = await getDoc(doc(db,'proveedores', id));
            /* console.log(docum.data()) */
            if(docum.exists){
                setProveedor(docum.data());
                
            }else{
                navigate('/home/proveedores')
            }
        }
        obtenerProveedor();
    },[navigate, id])

    return [proveedor]
}

export default useObtenerProveedor;