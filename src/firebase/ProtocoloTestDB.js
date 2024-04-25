
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ProtocoloTestDB = async ({ nombre, familia, item, item_id, categoria, medida, inicial, final, cab_id, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'protocolostest'), {
        nombre: nombre,
        familia: familia,
        item: item,
        item_id: item_id,
        cab_id: cab_id,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ProtocoloTestDB;