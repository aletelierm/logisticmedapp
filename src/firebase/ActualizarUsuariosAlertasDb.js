
import { db } from './firebaseConfig';
import { updateDoc, doc } from "firebase/firestore";

const ActualizaUsuariosAlertasDB = async  ({id,userMod,fechaMod,salida,rfid,confirma}) => {

    const docum = doc(db,'usuariosalertas', id);
    return await updateDoc(docum, {       
        salida: salida,
        rfid: rfid,
        confirma: confirma,
        userMod: userMod,     
        fechaMod: fechaMod,     
    });
    
}

export default ActualizaUsuariosAlertasDB;