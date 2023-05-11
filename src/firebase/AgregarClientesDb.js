import { db } from './firebaseConfig';
import { collection, setDoc, doc } from "firebase/firestore";


const AgregarClientesDb = async  ({rut,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod}) => {
  
    const clientes = collection(db,"clientes");
    return await setDoc(doc(clientes, rut),{
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        contaco: contacto,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
        
    });
}
 
export default AgregarClientesDb;