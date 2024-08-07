var admin = require("firebase-admin");

var serviceAccount = require("../../herramientasScript/logisticmedappdesa-firebase-adminsdk-9tt67-94cb85303c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://logisticmedappdesa-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const collectionRef = db.collection('ingresostcab'); // Reemplaza con tu colección específica

// Realiza una consulta para obtener los documentos
collectionRef.get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No se encontraron documentos en la colección.');
      return;
    }

    // Itera a través de los documentos y actualiza el campo en cada uno
    snapshot.forEach(doc => {
      const id = doc.id;
      const docRef = collectionRef.doc(id);

      // Actualiza el campo en cada documento
      docRef.update({
        horamaquina: 0       
      })
      .then(() => {
        console.log(`Documento con ID ${id} Actulizado con éxito.`);
      })
      .catch(error => {
        console.error(`Error al actualizar el documento con ID ${id}:`, error);
      });
    });
  })
  .catch(error => {
    console.error('Error al obtener documentos de la colección:', error);
  });