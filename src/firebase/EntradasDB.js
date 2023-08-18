
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const EntradasDB = async ({ tipDoc, numDoc, date, tipoInOut, rut, entidad, eq_id, familia, tipo, marca, modelo, serie, rfid, price, cab_id, tipMov, userAdd, userMod, fechaAdd, fechaMod, emp_id, observacion }) => {

    return await addDoc(collection(db, 'entradas'), {
        tipdoc: tipDoc,
        numdoc: numDoc,
        date: date, 
        tipoinout: tipoInOut,
        rut: rut,
        entidad: entidad,
        eq_id: eq_id,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        rfid: rfid,
        price: price,
        cab_id: cab_id,
        tipmov: tipMov,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id,
        observacion: observacion
    })
}

export default EntradasDB;