
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarMarcaDb = async  ({marca, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'marcas'),{
        marca: marca,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarMarcaDb;