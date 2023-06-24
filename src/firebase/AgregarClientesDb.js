import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


const AgregarClientesDb = async  ({rut,emp_id,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod}) => {
  
    return await addDoc(collection(db,"clientes"),{
        rut:rut,
        emp_id: emp_id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        contaco: contacto,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
        
    })
}
 
export default AgregarClientesDb;