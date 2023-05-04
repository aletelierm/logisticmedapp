
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarMarcaDb = async  ({marca, userAdd, userMod, fechaAdd, fechaMod}) => {

    return await addDoc(collection(db, 'marcas'),{
        marca: marca,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
    })
}

export default AgregarMarcaDb;