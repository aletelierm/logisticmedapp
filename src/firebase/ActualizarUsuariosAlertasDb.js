
import { db } from './firebaseConfig';
import { updateDoc, doc } from "firebase/firestore";

const ActualizaUsuariosAlertasDB = async  ({id,userMod,fechaMod,salida,rfid,confirma,tecnico}) => {

    const docum = doc(db,'usuariosalertas', id);
    return await updateDoc(docum, {       
        salida: salida,
        rfid: rfid,
        confirma: confirma,
        tecnico: tecnico,
        userMod: userMod,     
        fechaMod: fechaMod,     
    });
    
}

export default ActualizaUsuariosAlertasDB;