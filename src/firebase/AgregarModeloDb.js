
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarModeloDb = async  ({modelo, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'modelos'),{
        modelo: modelo,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarModeloDb;