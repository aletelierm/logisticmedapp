import { db } from '../firebase/firebaseConfig';
import { doc, runTransaction } from 'firebase/firestore';

const correlativos = async (documento, campo) => {
    //Prueba generacion de folios unicos    
    const docRef = doc(db, 'correlativos', documento)
    try {
        await runTransaction(db, async (t) => {
            const f = await t.get(docRef);
            if (!f.exists()) {
                console.log('no existe document')
            } else {
                const nuevoFolio = f.data().campo + 1;
                t.update(docRef, { [campo]: nuevoFolio });
                console.log('folio es:', nuevoFolio)
                return nuevoFolio;
            }
        })
    } catch (error) {
        console.log('error de folio', error);
    }
}

export default correlativos;