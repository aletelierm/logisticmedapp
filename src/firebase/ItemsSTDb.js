
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ItemsSTDb = async  ({nombre, categoria, price, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'itemsst'),{
        nombre: nombre,
        categoria: categoria,
        price: price,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ItemsSTDb;