import { 
  getAllSongs as getAllSongsFirebase, 
  getSongById as getSongByIdFirebase, 
  createSong as createSongFirebase, 
  deleteSongById as deleteSongByIdFirebase, 
  getUserSongs as getUserSongsFirebase, 
  deleteAllUserSongs as deleteAllUserSongsFirebase,
  getAllSongsWithUserInfo as getAllSongsWithUserInfoFirebase,
  deleteSongAsAdmin as deleteSongAsAdminFirebase
} from '../firebase/songService';
import type { Song } from '../types/firebase';

export async function getAllSongs(): Promise<Song[]> {
  return getAllSongsFirebase();
}

export async function getSongById(id: string): Promise<Song | null> {
  return getSongByIdFirebase(id);
}

export async function createSong(song: Omit<Song, "id">): Promise<string> {
  return createSongFirebase(song);
}

export async function deleteSongById(id: string): Promise<void> {
  return deleteSongByIdFirebase(id);
}

export async function getUserSongs(userId: string): Promise<Song[]> {
  return getUserSongsFirebase(userId);
}

export async function deleteAllUserSongs(userId: string): Promise<void> {
  return deleteAllUserSongsFirebase(userId);
}

export async function getAllSongsWithUserInfo(): Promise<(Song & { userDisplayName: string })[]> {
  return getAllSongsWithUserInfoFirebase();
}

export async function deleteSongAsAdmin(songId: string): Promise<void> {
  return deleteSongAsAdminFirebase(songId);
} 