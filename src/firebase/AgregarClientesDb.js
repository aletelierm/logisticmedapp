import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


const AgregarClientesDb = async  ({rut,emp_id,nombre,direccion,telefono,correo,nomrsf,dirrsf,telrsf,userAdd,userMod,fechaAdd, fechaMod}) => {
  
    return await addDoc(collection(db,"clientes"),{
        rut:rut,
        emp_id: emp_id,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        nomrsf: nomrsf,
        dirrsf: dirrsf,
        telrsf: telrsf,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod        
        
    })
}
 
export default AgregarClientesDb;