import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "./config";
export interface ChordType {
  keys: string[];
  selected: boolean;
}

export interface Song {
  id?: string;
  userId: string;
  title: string;
  tempo: number;
  key: string;
  timeSignature: string;
  chords: ChordType[];
  createdAt: string;
}

export const createSong = async (song: Omit<Song, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "songs"), song);
    return docRef.id;
  } catch (error) {
    console.error("Error creating song:", error);
    throw error;
  }
};

export const getUserSongs = async (userId: string): Promise<Song[]> => {
  try {
    const q = query(
      collection(db, "songs"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const songs: Song[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Song, 'id'>;
      songs.push({ id: doc.id, ...data });
    });
    return songs.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("Error getting user songs:", error);
    throw error;
  }
};

export const getSongById = async (songId: string): Promise<Song | null> => {
  try {
    const songDoc = await getDoc(doc(db, "songs", songId));
    if (songDoc.exists()) {
      const data = songDoc.data() as Omit<Song, 'id'>;
      return { id: songDoc.id, ...data };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting song:", error);
    throw error;
  }
};

export const deleteSongById = async (songId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "songs", songId));
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

export const getAllSongs = async (): Promise<Song[]> => {
  try {
    const q = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const songs: Song[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Song, 'id'>;
      songs.push({ id: doc.id, ...data });
    });
    return songs;
  } catch (error) {
    console.error("Error getting all songs:", error);
    throw error;
  }
};

export const deleteAllUserSongs = async (userId: string): Promise<void> => {
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
  } catch (error) {
    console.error('Error deleting all user songs:', error);
    throw error;
  }
};

// Funciones para gestión de canciones por admins
export const getAllSongsWithUserInfo = async (): Promise<(Song & { userDisplayName: string })[]> => {
  try {
    const q = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const songs: (Song & { userDisplayName: string })[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as Omit<Song, 'id'>;
      const song = { id: docSnapshot.id, ...data };
      
      // Obtener información del usuario
      try {
        const userDoc = await getDoc(doc(db, "users", data.userId));
        const userDisplayName = userDoc.exists() ? userDoc.data().displayName : 'Usuario desconocido';
        songs.push({ ...song, userDisplayName });
      } catch (error) {
        console.error(`Error getting user info for song ${docSnapshot.id}:`, error);
        songs.push({ ...song, userDisplayName: 'Usuario desconocido' });
      }
    }
    
    return songs;
  } catch (error) {
    console.error("Error getting all songs with user info:", error);
    throw error;
  }
};

export const deleteSongAsAdmin = async (songId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "songs", songId));
  } catch (error) {
    console.error("Error deleting song as admin:", error);
    throw error;
  }
};
