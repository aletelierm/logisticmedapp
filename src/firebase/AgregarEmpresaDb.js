import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


const AgregarEmpresaDb = async  ({rut,empresa,userAdd,userMod,fechaAdd, fechaMod}) => {  
    
    return await addDoc(collection(db, 'empresas'),{
        rut: rut,
        empresa: empresa,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
        
    })
}
 
export default AgregarEmpresaDb;