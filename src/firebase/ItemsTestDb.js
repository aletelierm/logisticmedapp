
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ItemsTestDb = async  ({nombre, /*categoria,*/ userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'itemstest'),{
        nombre: nombre,
        // categoria:categoria,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ItemsTestDb;