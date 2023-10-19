import React, { useState } from 'react'
import { BotonGuardar } from '../elementos/General'
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore'
import AgregarCampo from '../firebase/AgregarCampo'

const AgregarCampoB = () => {
    const [leer, setLeer] = useState([])

    const getData = async () => {
        const data = await getDocs(collection(db, "status"));
        setLeer(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        leer.forEach((docs) => {
            AgregarCampo(docs.id);
        })
    }

    
    return (
        <BotonGuardar onClick={() => getData()}>Agregar Campo</BotonGuardar>
    )
}

export default AgregarCampoB;