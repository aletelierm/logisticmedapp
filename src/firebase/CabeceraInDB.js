
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoIn, rut, entidad, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'cabeceras'), {
        tipdoc: tipDoc,
        numdoc: numDoc,
        date: date, 
        tipoin: tipoIn,
        rut: rut,
        entidad: entidad,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id
    })
}

export default CabeceraInDB;