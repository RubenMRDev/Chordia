const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // Debes descargar este archivo desde Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chordia-12345.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db }; 