
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const SalidasDB = async ({ numDoc, tipDoc, date, tipoInOut, rut, entidad, correo, patente, cab_id, eq_id, familia, tipo, marca, modelo, serie, rfid, tipMov, url, observacion, historial, confirmado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'salidas'), {
        numdoc: numDoc,
        tipdoc: tipDoc,
        date: date, 
        tipoinout: tipoInOut,
        rut: rut,
        entidad: entidad,
        correo: correo,
        patente: patente,
        cab_id: cab_id,
        eq_id: eq_id,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        rfid: rfid,
        tipmov: tipMov,
        url: url,
        observacion: observacion,
        historial:historial,
        confirmado: confirmado,
        // status: status,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default SalidasDB;