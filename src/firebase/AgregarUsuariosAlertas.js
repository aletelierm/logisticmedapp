
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarUsuariosAlertasDB = async  ({userAdd, userMod, fechaAdd, fechaMod, emp_id,empresa,nombre,correo,salida,rfid,confirma,tecnico,mantencion}) => {

    return await addDoc(collection(db, 'usuariosalertas'),{
        nombre: nombre,
        correo: correo,
        salida: salida,
        rfid: rfid,
        confirma: confirma,
        tecnico: tecnico,
        mantencion: mantencion,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id,
        empresa: empresa
    })
}

export default AgregarUsuariosAlertasDB;