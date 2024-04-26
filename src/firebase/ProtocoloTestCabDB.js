
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ProtocoloTestCabDB = async ({ nombre, familia, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'protocolostestcab'), {
        nombre: nombre,
        familia: familia,
        confirmado: confirmado,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ProtocoloTestCabDB;