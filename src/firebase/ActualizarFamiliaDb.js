
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const ActualizarFamiliaDb = async  ({id, familia, userMod, fechaMod}) => {

    return await updateDoc(doc(db, 'familias', id),{
        familia: familia,
        usermod: userMod,
        fechamod: fechaMod
    })
}

export default ActualizarFamiliaDb;