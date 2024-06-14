
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const PresupuestoCabDB = async ({ id_cab_inst, confirmado, estado, generado, fecha_generado, enviado, fecha_enviado, aceptado, fecha_aceptado, rechazado, fecha_rechazado, correctivo, fecha_correctivo, cerrado, fecha_cerrado, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'presupuestoscab'), {
        id_cab_inst: id_cab_inst,
        confirmado: confirmado,
        estado: estado,
        generado: generado,
        fecha_generado: fecha_generado,
        enviado: enviado,
        fecha_enviado: fecha_enviado,
        aceptado: aceptado,
        fecha_aceptado: fecha_aceptado,
        rechazado: rechazado,
        fecha_rechazado: fecha_rechazado,
        correctivo: correctivo,
        fecha_correctivo: fecha_correctivo,
        cerrado: cerrado,
        fecha_cerrado: fecha_cerrado,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id

    })
}

export default PresupuestoCabDB;