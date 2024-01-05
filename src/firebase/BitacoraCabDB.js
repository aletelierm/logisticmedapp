
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const BitacoraCabDB = async ({ nombre_protocolo, cab_id_protocolo, fecha_mantencion, familia, tipo, serie, eq_id, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'bitacoracab'), {
        nombre_protocolo: nombre_protocolo,
        cab_id_protocolo: cab_id_protocolo,
        fecha_mantencion: fecha_mantencion,
        familia: familia,
        tipo: tipo,
        serie: serie,
        eq_id: eq_id,
        confirmado: confirmado,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id,
    })
}

export default BitacoraCabDB;