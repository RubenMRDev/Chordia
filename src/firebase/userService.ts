import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./config"
export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  location?: string
  website?: string
  joinDate: string
  role: 'user' | 'admin'
  socialLinks?: {
    instagram?: string
    twitter?: string
    soundcloud?: string
    spotify?: string
  }
}
export const createUserProfile = async (user: UserProfile): Promise<void> => {
  const userRef = doc(db, "users", user.uid)
  try {
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...user,
        role: user.role || 'user',
        joinDate: new Date().toISOString(),
      })
    } else {
      await updateDoc(userRef, { ...user })
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error)
    throw error
  }
}
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid)
  try {
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, "users", uid)
  try {
    await updateDoc(userRef, { ...data })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
export const deleteUserProfile = async (userId: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};

// Función para actualizar el rol de un usuario a admin
export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};
