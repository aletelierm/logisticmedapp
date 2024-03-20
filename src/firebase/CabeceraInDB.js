
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, descripcion, tipMov, url, confirmado, observacion, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'cabeceras'), {
        numdoc: numDoc,
        tipdoc: tipDoc,
        date: date, 
        tipoinout: tipoInOut,
        rut: rut,
        entidad: entidad,
        descripcion: descripcion,
        tipmov: tipMov,
        url: url,
        confirmado: confirmado,
        observacion: observacion,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default CabeceraInDB;