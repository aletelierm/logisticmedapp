
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarEmpresaDb = async  ({empresa,userAdd,userMod,fechaAdd, fechaMod}) => {
    
    
    return await addDoc(collection(db, 'empresas'),{
        empresa: empresa,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod
        /* fechaMod: fechaMod,
        useradd: userAdd,
        userMod: userMod */
    })
}
 
export default AgregarEmpresaDb;