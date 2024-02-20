
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const ProtocoloDB = async ({ nombre, familia, tipo, programa, dias, item, item_id, categoria, medida, inicial, final, cab_id, userAdd, userMod, fechaAdd, fechaMod, emp_id }) => {

    return await addDoc(collection(db, 'protocolos'), {
        nombre: nombre,
        familia: familia,
        tipo: tipo,
        programa: programa,
        dias: dias,
        item: item,
        item_id: item_id,
        categoria: categoria,
        medida: medida,
        inicial: inicial,
        final: final,
        cab_id: cab_id,
        useradd: userAdd,
        usermod: userMod,
        fechaadd: fechaAdd,
        fechamod: fechaMod,
        emp_id: emp_id
    })
}

export default ProtocoloDB;