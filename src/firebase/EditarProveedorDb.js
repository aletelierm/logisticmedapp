import { db } from "./firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const EditarProveedor = async ({id,nombre,direccion,telefono,correo, contacto,userMod,fechaMod})=>{
    
    const docum = doc(db,'proveedores', id);
    return await updateDoc(docum, { 
        contacto: contacto,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        nombre:nombre,
        usermod: userMod,
        fechamod: fechaMod

    })

}

export default EditarProveedor;