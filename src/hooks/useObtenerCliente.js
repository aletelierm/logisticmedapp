import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const useObtenerCliente = (id) => {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState([]);

    useEffect(() => {
        const obtenerCliente = async () => {
            const docum = await getDoc(doc(db, 'clientes', id));
            /* console.log(docum.data()) */
            if (docum.exists) {
                setCliente(docum.data());
            } else {
                navigate('/home/clientes')
            }
        }
        obtenerCliente();
    }, [navigate, id])

    return [cliente]
}

export default useObtenerCliente;