
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const IngresoStDetDB = async ({ id_cab_inst, folio, rut, date, id_test, familia, tipo, marca, modelo, serie, servicio, obs, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'ingresostdet'), {
        id_cab_inst: id_cab_inst,
        folio: folio,
        rut: rut,
        date: date,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        servicio: servicio,
        id_test: id_test,
        obs:obs,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default IngresoStDetDB;