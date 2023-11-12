var admin = require("firebase-admin");

<<<<<<< HEAD
var serviceAccount = require("../../../herramientasScript/logisticmedqa-firebase-adminsdk-o4bo9-48bea63cbe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://logisticmedqa-default-rtdb.firebaseio.com"
});


=======
var serviceAccount = require("../../herramientasScript/logisticmedappdesa-firebase-adminsdk-9tt67-94cb85303c.json");
/* var serviceAccount = require(process.env.SERVICE_ACCOUNT); */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://logisticmedappdesa-default-rtdb.firebaseio.com"
});

>>>>>>> master
const db = admin.firestore();
const collectionRef = db.collection('status'); // Reemplaza con tu colección específica

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
<<<<<<< HEAD
        price: "",
        tipoinout:"COMPRA"
=======
        price: "1"
>>>>>>> master
      })
      .then(() => {
        console.log(`Documento con ID ${id} actualizado con éxito.`);
      })
      .catch(error => {
        console.error(`Error al actualizar el documento con ID ${id}:`, error);
      });
    });
  })
  .catch(error => {
    console.error('Error al obtener documentos de la colección:', error);
<<<<<<< HEAD
  });
=======
  });
>>>>>>> master
