
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const ActualizarModeloDb = async  ({id, modelo, userMod, fechaMod}) => {

    return await updateDoc(doc(db, 'modelos', id),{
        modelo: modelo,
        userMod: userMod,
        fechaMod: fechaMod
    })
}

export default ActualizarModeloDb;