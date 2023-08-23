import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


const AgregarEmpresaDb = async  ({rut,empresa,userAdd,userMod,fechaAdd, fechaMod}) => {  
    
    return await addDoc(collection(db, 'empresas'),{
        rut: rut,
        empresa: empresa,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod
        
    })
}
 
export default AgregarEmpresaDb;