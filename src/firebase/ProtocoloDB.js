
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ProtocoloDB = async ({ nombre, familia, tipo, programa, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'protocolos'), {
        nombre: nombre,
        familia: familia,
        tipo: tipo,
        programa: programa,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ProtocoloDB;