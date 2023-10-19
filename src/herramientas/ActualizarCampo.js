var admin = require("firebase-admin");

var serviceAccount = require("./logisticmedappdesa-firebase-adminsdk-9tt67-94cb85303c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://logisticmedappdesa-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

// Define la referencia al documento que deseas actualizar
const docRef = db.collection('status').doc('8MkTwSbvppOb1SzMrjGg');

// Realiza la actualización del campo
docRef.update({
  status: 'BODEGA'
})
.then(() => {
  console.log('Campo actualizado con éxito');
})
.catch(error => {
  console.error('Error al actualizar el campo:', error);
});
