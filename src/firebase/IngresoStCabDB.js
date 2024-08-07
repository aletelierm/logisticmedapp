
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const IngresoStCabDB = async ({ folio, rut, entidad, telefono, direccion, correo, date, confirmado, estado, fecha_out, familia, tipo, marca, modelo, serie, servicio, observaciones, horamaquina, tecnico, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'ingresostcab'), {
        folio: folio,
        rut: rut,
        entidad: entidad,
        telefono: telefono,
        direccion: direccion,
        correo: correo,
        date: date,
        confirmado: confirmado,
        estado: estado,
        fecha_out: fecha_out,
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        servicio: servicio,
        observaciones: observaciones,
        horamaquina: horamaquina,
        tecnico: tecnico,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default IngresoStCabDB;