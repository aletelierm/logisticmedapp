
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarUsuariosAlertasDB = async  ({userAdd, userMod, fechaAdd, fechaMod, emp_id,empresa,nombre,correo,salida,rfid,confirma}) => {

    return await addDoc(collection(db, 'usuariosalertas'),{
        nombre: nombre,
        correo: correo,
        salida: salida,
        rfid: rfid,
        confirma: confirma,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id,
        empresa: empresa
    })
}

export default AgregarUsuariosAlertasDB;