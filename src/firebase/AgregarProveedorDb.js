import { db } from './firebaseConfig';
import { collection, setDoc, doc } from "firebase/firestore";


const AgregarProveedorDb = async  ({rut,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod}) => {
  
    const proveedores = collection(db,"proveedores");
    return await setDoc(doc(proveedores, rut),{
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
 
export default AgregarProveedorDb;