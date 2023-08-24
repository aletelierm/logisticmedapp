
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const EntradasDB = async ({ numDoc, tipDoc, date, tipoInOut, rut, entidad, price, cab_id, eq_id, familia, tipo, marca, modelo, serie, rfid, observacion,  tipMov, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'entradas'), {
        numdoc: numDoc,
        tipdoc: tipDoc,
        date: date, 
        tipoinout: tipoInOut,
        rut: rut,
        entidad: entidad,
        cab_id: cab_id,
        eq_id: eq_id,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        rfid: rfid,
        price: price,
        tipmov: tipMov,
        observacion: observacion,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default EntradasDB;