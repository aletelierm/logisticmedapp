
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const EquipoDb = async ({ familia, tipo, marca, modelo, serie, rfid, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'equipos'), {
        fam_id: familia,
        tip_id: tipo,
        mar_id: marca,
        mod_id: modelo,
        serie: serie,
        rfid: rfid,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default EquipoDb;