import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type FirebaseStorage,
} from 'firebase/storage';
import { requireAuth } from './config';
import { FirebaseUnconfiguredError } from './env';

/*
  `getStorage()` used to run at module load, which throws when there is no
  default Firebase app — so merely importing this file crashed an unconfigured
  checkout, including on pages that never upload anything. It is resolved on
  first use instead.
*/
let storage: FirebaseStorage | null = null;

const requireStorage = (): FirebaseStorage => {
  if (!storage) storage = getStorage();
  return storage;
};

/** The signed-in user's id, or a thrown error naming why there is not one. */
const currentUserId = (): string => {
  const user = requireAuth().currentUser;
  if (!user) throw new FirebaseUnconfiguredError();
  return user.uid;
};

const upload = async (path: string, file: File): Promise<string> => {
  const storageRef = ref(requireStorage(), path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const uploadProfilePicture = async (file: File): Promise<string> =>
  upload(`user-profiles/${currentUserId()}/profile-picture`, file);

export const uploadSongCover = async (
  songId: string,
  file: File,
): Promise<string> => {
  if (!songId) throw new Error('Song ID is required');
  return upload(`songs/${currentUserId()}/${songId}/cover`, file);
};
