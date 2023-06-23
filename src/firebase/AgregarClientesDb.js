import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


const AgregarClientesDb = async  ({rut,empresa,nombre,direccion,telefono,correo,contacto,userAdd,userMod,fechaAdd, fechaMod, emp_id}) => {
  
    return await addDoc(collection(db,"clientes"),{
        rut:rut,
        emp_id:empresa,
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
        
    })
}
 
export default AgregarClientesDb;