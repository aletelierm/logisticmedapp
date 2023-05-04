
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarFamiliaDb = async  ({familia, userAdd, userMod, fechaAdd, fechaMod}) => {

    return await addDoc(collection(db, 'familias'),{
        familia: familia,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
    })
}

export default AgregarFamiliaDb;