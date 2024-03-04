import { db } from '../firebase/firebaseConfig';
import { doc, runTransaction } from 'firebase/firestore';


const generarFolioMulti = async (documento, campo) => {
    const folioRef = doc(db, 'correlativos', documento);

    try {
      // Obtener el documento existente
      const docSnapshot = await folioRef.get();
  
      // Definir el contadorCampo fuera de la transacción
      let contadorCampo;
  
      // Verificar si el documento ya existe
      if (docSnapshot.exists()) {
        // El documento ya existe, incrementar el contador del campo específico
        await runTransaction(db, async (transaction) => {
          const documentoData = await transaction.get(folioRef);
          contadorCampo = documentoData.get(campo) || 0;
          transaction.update(folioRef, { [campo]: contadorCampo + 1 });
        });
      } else {
        // El documento no existe, crearlo con el contador del campo específico en 1
        await folioRef.set({ [campo]: 1 });
        contadorCampo = 1; // Establecer el contadorCampo en 1
      }
  
      // Obtener el folio único después de la actualización o creación
      const folio = `${documento.toUpperCase()}-${campo.toUpperCase()}-${contadorCampo}`;
      console.log('Folio generado:', folio);
      return folio;
    } catch (error) {
      console.error('Error al generar folio:', error);
    }
  
}
export default generarFolioMulti;