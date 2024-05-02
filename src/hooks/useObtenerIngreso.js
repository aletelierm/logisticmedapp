import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerIngreso = (id) => {
    const navigate = useNavigate();
    const [ingreso, setIngreso] = useState([]);

    useEffect(() => {
        const obtenerIngreso = async () => {
            const docum = await getDoc(doc(db, 'ingresostcab', id));
            /* console.log(docum.data()) */
            if (docum.exists) {
                setIngreso(docum.data());
            } else {
                navigate('/serviciotecnico/ingreso')
            }
        }
        obtenerIngreso();
    }, [navigate, id])

    return [ingreso]
}

export default useObtenerIngreso;