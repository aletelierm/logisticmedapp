
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ProtocoloCabDB = async ({ nombre, familia, tipo, programa, dias, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'protocoloscab'), {
        nombre: nombre,
        familia: familia,
        tipo: tipo,
        programa: programa,
        dias: dias,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ProtocoloCabDB;