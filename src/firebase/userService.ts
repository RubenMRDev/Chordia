import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
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

