
import { db } from './firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";

const ActualizarEmpresaDb = async  ({id, empresa, userMod, fechaMod}) => {

    return await updateDoc(doc(db, 'empresas', id),{
        empresa: empresa,
        userMod: userMod,
        fechaMod: fechaMod
    })
}

export default ActualizarEmpresaDb;