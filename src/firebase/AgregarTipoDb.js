
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarTipoDb = async  ({tipo, userAdd, userMod, fechaAdd, fechaMod}) => {

    return await addDoc(collection(db, 'tipos'),{
        tipo: tipo,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
    })
}

export default AgregarTipoDb;