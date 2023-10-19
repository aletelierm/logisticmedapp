import { db } from './firebaseConfig';
import { updateDoc,doc } from "firebase/firestore";

const AgregarCampo = async  (id) => {

    return await updateDoc(doc(db, 'entradas', id),{
        confirmado: false
    })
}

export default AgregarCampo;