
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarFamiliaDb = async ({ tipDoc, numDoc, proveedor, date, tipoIn, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'entradas'), {
        
        tipDoc: tipDoc,
        numDoc: numDoc,
        proveedor: proveedor,
        date: date,
        tipoIn: tipoIn,
        userAdd: userAdd,
        userMod: userMod,
        fechaAdd: fechaAdd,
        fechaMod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarFamiliaDb;