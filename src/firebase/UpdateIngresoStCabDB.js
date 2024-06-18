
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const UpdateIngresoStCabDB = async ({ id, familia, tipo, marca, modelo, serie, servicio, observaciones, fechaMod, emp_id }) => {

    return await updateDoc(doc(db, 'ingresostcab', id), {
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        servicio: servicio,
        observaciones: observaciones,
        fechamod: fechaMod
    })
}

export default UpdateIngresoStCabDB;