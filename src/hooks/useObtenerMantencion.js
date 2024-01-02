import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerMantencion = (id) => {
    const navigate = useNavigate();
    const [manto, setManto] = useState([]);

    useEffect(() => {
        const obtenerManto = async () => {
            const docum = await getDoc(doc(db, 'mantenciones', id));
            /* console.log(docum.data()) */
            if (docum.exists) {
                setManto(docum.data());
            } else {
                navigate('/serviciotecnico/mantencion')
            }
        }
        obtenerManto();
    }, [navigate, id])

    return [manto]
}

export default useObtenerMantencion;