import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, deleteDoc } from "firebase/firestore";
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
      songs.push({ id: doc.id, ...doc.data() } as Song);
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
      return { id: songDoc.id, ...songDoc.data() } as Song;
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
