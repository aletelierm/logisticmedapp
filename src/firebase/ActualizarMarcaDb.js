
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const ActualizarMarcaDb = async  ({id, marca, userMod, fechaMod}) => {

    return await updateDoc(doc(db, 'marcas', id),{
        marca: marca,
        userMod: userMod,
        fechaMod: fechaMod
    })
}

export default ActualizarMarcaDb;