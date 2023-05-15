
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const ActualizarTipoDb = async  ({id, tipo, userMod, fechaMod}) => {

    return await updateDoc(doc(db, 'tipos', id),{
        tipo: tipo,
        userMod: userMod,
        fechaMod: fechaMod
    })
}

export default ActualizarTipoDb;