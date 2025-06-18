const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Obtener todas las canciones (o solo las de un usuario si se pasa userId)
app.get('/songs', async (req, res) => {
  try {
    const { userId } = req.query;
    let snapshot;
    if (userId) {
      snapshot = await db.collection('songs').where('userId', '==', userId).get();
    } else {
      snapshot = await db.collection('songs').get();
    }
    const songs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(songs);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Obtener una canción por ID
app.get('/songs/:id', async (req, res) => {
  const doc = await db.collection('songs').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).send('Not found');
  res.json({ id: doc.id, ...doc.data() });
});

// Crear una canción
app.post('/songs', async (req, res) => {
  const data = req.body;
  const ref = await db.collection('songs').add(data);
  res.json({ id: ref.id });
});

// Actualizar una canción
app.put('/songs/:id', async (req, res) => {
  await db.collection('songs').doc(req.params.id).update(req.body);
  res.send('Updated');
});

// Eliminar una canción
app.delete('/songs/:id', async (req, res) => {
  await db.collection('songs').doc(req.params.id).delete();
  res.send('Deleted');
});

// Obtener perfil de usuario por UID
app.get('/users/:uid', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.uid).get();
    if (!doc.exists) return res.status(404).send('Not found');
    res.json({ uid: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Crear perfil de usuario
app.post('/users', async (req, res) => {
  try {
    const { uid, ...data } = req.body;
    await db.collection('users').doc(uid).set(data);
    res.json({ uid });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Actualizar perfil de usuario
app.put('/users/:uid', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.uid).update(req.body);
    res.send('Updated');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Eliminar perfil de usuario
app.delete('/users/:uid', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.uid).delete();
    res.send('Deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Eliminar todas las canciones de un usuario
app.delete('/songs/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await db.collection('songs').where('userId', '==', userId).get();
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    res.send('All user songs deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`)); 