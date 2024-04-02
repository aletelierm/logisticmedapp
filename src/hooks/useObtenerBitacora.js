import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerBitacora = (id) => {
    const navigate = useNavigate();
    const [bitacora, setBitacora] = useState([]);

    useEffect(() => {
        const obtenerBitacora = async () => {
            const docum = await getDoc(doc(db, 'bitacoracab', id));
            /* console.log(docum.data()) */
            if (docum.exists) {
                setBitacora(docum.data());
            } else {
                navigate('/serviciotecnico/bitacora')
            }
        }
        obtenerBitacora();
    }, [navigate, id])

    return [bitacora]
}

export default useObtenerBitacora;