import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "./config";
export const createSong = async (song) => {
    try {
        const docRef = await addDoc(collection(db, "songs"), song);
        return docRef.id;
    }
    catch (error) {
        console.error("Error creating song:", error);
        throw error;
    }
};
export const getUserSongs = async (userId) => {
    try {
        const q = query(collection(db, "songs"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const songs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            songs.push({ id: doc.id, ...data });
        });
        return songs.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
    catch (error) {
        console.error("Error getting user songs:", error);
        throw error;
    }
};
export const getSongById = async (songId) => {
    try {
        const songDoc = await getDoc(doc(db, "songs", songId));
        if (songDoc.exists()) {
            const data = songDoc.data();
            return { id: songDoc.id, ...data };
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Error getting song:", error);
        throw error;
    }
};
export const deleteSongById = async (songId) => {
    try {
        await deleteDoc(doc(db, "songs", songId));
    }
    catch (error) {
        console.error("Error deleting song:", error);
        throw error;
    }
};
export const getAllSongs = async () => {
    try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const songs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            songs.push({ id: doc.id, ...data });
        });
        return songs;
    }
    catch (error) {
        console.error("Error getting all songs:", error);
        throw error;
    }
};
export const deleteAllUserSongs = async (userId) => {
    try {
        const songsRef = collection(db, 'songs');
        const q = query(songsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return;
        }
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
    catch (error) {
        console.error('Error deleting all user songs:', error);
        throw error;
    }
};
// Funciones para gestión de canciones por admins
export const getAllSongsWithUserInfo = async () => {
    try {
        const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const songs = [];
        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();
            const song = { id: docSnapshot.id, ...data };
            // Obtener información del usuario
            try {
                const userDoc = await getDoc(doc(db, "users", data.userId));
                const userDisplayName = userDoc.exists() ? userDoc.data().displayName : 'Usuario desconocido';
                songs.push({ ...song, userDisplayName });
            }
            catch (error) {
                console.error(`Error getting user info for song ${docSnapshot.id}:`, error);
                songs.push({ ...song, userDisplayName: 'Usuario desconocido' });
            }
        }
        return songs;
    }
    catch (error) {
        console.error("Error getting all songs with user info:", error);
        throw error;
    }
};
export const deleteSongAsAdmin = async (songId) => {
    try {
        await deleteDoc(doc(db, "songs", songId));
    }
    catch (error) {
        console.error("Error deleting song as admin:", error);
        throw error;
    }
};
