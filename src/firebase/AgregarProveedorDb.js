import { db } from './firebaseConfig';
import { collection, setDoc, doc } from "firebase/firestore";


const AgregarProveedorDb = async  ({rut,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod, emp_id}) => {
  
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
        fechaMod: fechaMod,
        emp_id: emp_id
    });
}
 
export default AgregarProveedorDb;