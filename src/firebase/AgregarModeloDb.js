
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarModeloDb = async  ({modelo, userAdd, userMod, fechaAdd, fechaMod}) => {

    return await addDoc(collection(db, 'modelos'),{
        modelo: modelo,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
    })
}

export default AgregarModeloDb;