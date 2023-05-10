
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const CrearEquipoDb = async ({ familia, tipo, marca, modelo, serie, rfid, userAdd, userMod, fechaAdd, fechaMod }) => {

    return await addDoc(collection(db, 'crearequipos'), {
        familia: familia,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        rfid: rfid,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod
    })
}

export default CrearEquipoDb;