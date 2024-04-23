
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const IngresoStCab = async ({ folio, rut, entidad, telefono, direccion, correo, date, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'cabeceras'), {
        // folio: folio,
        rut: rut,
        entidad: entidad,
        telefono: telefono,
        direccion: direccion,
        correo: correo,
        date: date,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default IngresoStCab;