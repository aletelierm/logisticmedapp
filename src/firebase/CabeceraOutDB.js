
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const CabeceraInDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, correo, patente, tipMov, confirmado, entregado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'cabecerasout'), {
        tipdoc: tipDoc,
        numdoc: numDoc,
        date: date, 
        tipoinout: tipoInOut,
        rut: rut,
        entidad: entidad,
        correo: correo,
        patente: patente,
        tipmov: tipMov,
        confirmado: confirmado,
        entregado: entregado,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default CabeceraInDB;