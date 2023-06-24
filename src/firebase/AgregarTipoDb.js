
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarTipoDb = async  ({tipo, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'tipos'),{
        tipo: tipo,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarTipoDb;