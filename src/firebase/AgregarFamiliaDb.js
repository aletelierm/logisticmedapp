
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarFamiliaDb = async  ({familia, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'familias'),{
        familia: familia,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarFamiliaDb;