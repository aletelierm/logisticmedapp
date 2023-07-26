
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const SalidasDB = async ({ tipDoc, numDoc, date, tipoOut, rut, entidad, eq_id, familia, tipo, marca, modelo, serie, rfid, cab_id, status, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'salidas'), {
        tipdoc: tipDoc,
        numdoc: numDoc,
        date: date, 
        tipoout: tipoOut,
        rut: rut,
        entidad: entidad,
        eq_id: eq_id,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        rfid: rfid,
        // price: price,
        cab_id: cab_id,
        // tipmov: tipMov,
        status: status,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default SalidasDB;