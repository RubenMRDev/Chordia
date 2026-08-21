import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, deleteDoc, writeBatch } from "firebase/firestore";
import { requireDb } from "./config";
import type { ChordType, Song } from "../types/models";

/*
  `Song` and `ChordType` used to be declared here as well as in
  `types/models.ts`, so the same shape had two definitions that could drift.
  They are re-exported for the call sites that import them from this module.
*/
export type { ChordType, Song };

export const createSong = async (song: Omit<Song, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(requireDb(), "songs"), song);
    return docRef.id;
  } catch (error) {
    console.error("Error creating song:", error);
    throw error;
  }
};

export const getUserSongs = async (userId: string): Promise<Song[]> => {
  try {
    const q = query(
      collection(requireDb(), "songs"),
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
    const songDoc = await getDoc(doc(requireDb(), "songs", songId));
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
    await deleteDoc(doc(requireDb(), "songs", songId));
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

export const getAllSongs = async (): Promise<Song[]> => {
  try {
    const q = query(
      collection(requireDb(), "songs"),
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
    const songsRef = collection(requireDb(), 'songs');
    const q = query(songsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return;
    }

    const batch = writeBatch(requireDb());
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting all user songs:', error);
    throw error;
  }
};

/** A song plus the display name of whoever wrote it. */
export type SongWithAuthor = Song & { authorName: string | null };

/**
 * Every song, with its author's display name resolved.
 *
 * Author names are fetched once per *user*, not once per song: Discover used to
 * issue one Firestore read for every song on the page, so fifty songs by five
 * people cost fifty reads instead of five.
 */
export const getAllSongsWithAuthors = async (): Promise<SongWithAuthor[]> => {
  const songs = await getAllSongs();
  const userIds = [...new Set(songs.map((song) => song.userId).filter(Boolean))];

  const entries = await Promise.all(
    userIds.map(async (userId) => {
      try {
        const snapshot = await getDoc(doc(requireDb(), "users", userId));
        const data = snapshot.exists() ? snapshot.data() : null;
        const name =
          (data?.displayName as string | undefined) ||
          (data?.username as string | undefined) ||
          null;
        return [userId, name] as const;
      } catch {
        // A missing or unreadable profile must not lose the song.
        return [userId, null] as const;
      }
    }),
  );

  const names = new Map(entries);
  return songs.map((song) => ({
    ...song,
    authorName: names.get(song.userId) ?? null,
  }));
};

// Funciones para gestión de canciones por admins
export const getAllSongsWithUserInfo = async (): Promise<(Song & { userDisplayName: string })[]> => {
  try {
    const q = query(
      collection(requireDb(), "songs"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const songs: (Song & { userDisplayName: string })[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as Omit<Song, 'id'>;
      const song = { id: docSnapshot.id, ...data };
      
      // Obtener información del usuario
      try {
        const userDoc = await getDoc(doc(requireDb(), "users", data.userId));
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
    await deleteDoc(doc(requireDb(), "songs", songId));
  } catch (error) {
    console.error("Error deleting song as admin:", error);
    throw error;
  }
};
