
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoIn, rut, entidad, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'cabeceras'), {
        tipdoc: tipDoc,
        numdoc: numDoc,
        date: date, 
        tipoin: tipoIn,
        rut: rut,
        entidad: entidad,
        confirmado: confirmado,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default CabeceraInDB;