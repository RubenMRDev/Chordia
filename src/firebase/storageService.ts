import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { auth } from "./config";


const storage = getStorage();


export const uploadProfilePicture = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = auth.currentUser.uid;
  const storageRef = ref(storage, `user-profiles/${userId}/profile-picture`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};


export const uploadSongCover = async (songId: string, file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = auth.currentUser.uid;
  const storageRef = ref(storage, `songs/${userId}/${songId}/cover`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading song cover:", error);
    throw error;
  }
};
