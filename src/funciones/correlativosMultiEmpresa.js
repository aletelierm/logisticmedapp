import { db } from '../firebase/firebaseConfig';
import { doc, runTransaction } from 'firebase/firestore';

//documento debe ser creado en coleccion correlativos
// corresponde al ID de la empresa
//campo es el nombre del campo que contendra los folios correlativos

const generarFolioUnico = async (documento, campo) => {
  const docRef = doc(db, 'correlativos', documento);

  try {
    const nuevoFolio = await runTransaction(db, async (transaction) => {
      const documentSnapshot = await transaction.get(docRef);

      if (!documentSnapshot.exists()) {
        console.log('El documento no existe, creándolo...');
        const nuevoDocumento = {};
        nuevoDocumento[campo] = 1;
        transaction.set(docRef, nuevoDocumento);
        return 1; // Devuelve el primer folio
      }

      const documentoActual = documentSnapshot.data();
      const valorActual = documentoActual[campo];
      const nuevoFolio = valorActual + 1;

      transaction.update(docRef, { [campo]: nuevoFolio });

     /*  console.log(`Nuevo folio para ${campo}:`, nuevoFolio); */
      return nuevoFolio;
    });

    return nuevoFolio;
  } catch (error) {
    console.error('Error al generar folio', error);
  }
};

export default generarFolioUnico;
