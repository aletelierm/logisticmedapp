
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AgregarItemsDb = async  ({nombre, categoria, medida, inicial, final, userAdd, userMod, fechaAdd, fechaMod, emp_id}) => {

    return await addDoc(collection(db, 'items'),{
        nombre: nombre,
        categoria:categoria,
        medida: medida,
        inicial: inicial,
        final: final,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default AgregarItemsDb;