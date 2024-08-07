
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const PresupuestoDB = async ({id_cab_pre, item_id, item, categoria, price, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'presupuestos'), {
        id_cab_pre: id_cab_pre,
        item_id: item_id,
        item: item,
        categoria: categoria,
        price: price,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default PresupuestoDB;