import { db } from './firebaseConfig';
import { collection, addDoc} from "firebase/firestore";


const AgregarProveedorDb = async  ({emp_id,rut,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod}) => {  
    
    return await addDoc(collection(db,"proveedores"),{
        emp_id: emp_id,
        rut: rut,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        contacto: contacto,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod        
    });
}
 
export default AgregarProveedorDb;