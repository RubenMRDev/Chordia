import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./config"

// Interfaz para el perfil de usuario
export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  bio?: string
  location?: string
  website?: string
  joinDate: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    soundcloud?: string
    spotify?: string
  }
}

// Crear o actualizar el perfil de usuario en Firestore
export const createUserProfile = async (user: UserProfile): Promise<void> => {
  const userRef = doc(db, "users", user.uid)

  try {
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Si el usuario no existe, crear un nuevo documento
      await setDoc(userRef, {
        ...user,
        joinDate: new Date().toISOString(),
      })
    } else {
      // Si el usuario ya existe, actualizar solo los campos proporcionados
      await updateDoc(userRef, { ...user })
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error)
    throw error
  }
}

// Obtener el perfil de usuario desde Firestore
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

// Actualizar el perfil de usuario en Firestore
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, "users", uid)

  try {
    await updateDoc(userRef, { ...data })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

