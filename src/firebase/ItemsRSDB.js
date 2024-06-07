
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ItemsRSDb = async  ({nombre, price, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'itemsrs'),{
        nombre: nombre,
        price: price,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ItemsRSDb;