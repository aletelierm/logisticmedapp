
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarModeloDb = async  ({modelo, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'modelos'),{
        modelo: modelo,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarModeloDb;