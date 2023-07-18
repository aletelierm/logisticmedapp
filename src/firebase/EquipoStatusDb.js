
import { db } from './firebaseConfig';
import { doc,setDoc } from "firebase/firestore";

const EquipoStatusDb = async ({id,emp_id,familia, tipo,status,nomEntidad,userAdd,userMod,fechaAdd,fechaMod }) => {

    return await setDoc(doc(db, 'status',id), {
        emp_id: emp_id,
        familia: familia,
        tipo: tipo,
        status: status,
        entidad: nomEntidad,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        
    });
    
}

export default EquipoStatusDb;