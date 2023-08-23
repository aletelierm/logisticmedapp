import { db } from "./firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";

const EditarCliente = async ({id,nombre,direccion,telefono,correo,nomrsf,dirrsf,telrsf,userMod,fechaMod})=>{
    
    const docum = doc(db,'clientes', id);
    return await updateDoc(docum, { 
        nomrsf: nomrsf,
        dirrsf:dirrsf,
        telrsf:telrsf,
        correo: correo,
        direccion: direccion,
        telefono: telefono,
        nombre:nombre,
        usermod: userMod,
        fechamod: fechaMod
    })
}

export default EditarCliente;