import { db } from "./firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const EditarCliente = async ({id,nombre,direccion,telefono,correo, contacto,userMod,fechaMod})=>{
    
    const docum = doc(db,'clientes', id);
    return await updateDoc(docum, { 
        contaco: contacto,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        nombre:nombre,
        userMod: userMod,
        fechaMod: fechaMod

    })

}

export default EditarCliente;