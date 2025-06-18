"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  updateProfile,
  type User,
} from "firebase/auth"
import { auth } from "../firebase/config"
import { createUserProfile, getUserProfile } from '../api/userApi'
import type { UserProfile } from '../types/firebase'

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  register: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithFacebook: () => Promise<void>
  error: string | null
  setError: (error: string | null) => void
  updateProfileInContext: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          let profile = await getUserProfile(currentUser.uid)
          if (!profile) {
            // Si no existe perfil, creamos uno con valores vacíos excepto displayName y email
            profile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || "",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || "",
              bio: "",
              location: "",
              website: "",
              joinDate: new Date().toISOString(),
              socialLinks: {
                instagram: "",
                twitter: "",
                soundcloud: "",
                spotify: ""
              }
            }
            await createUserProfile(profile)
          }
          setUserProfile(profile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      } else {
        setUserProfile(null)
      }
    }

    fetchUserProfile()
  }, [currentUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function register(email: string, password: string, name: string) {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (result.user) {
        await updateProfile(result.user, {
          displayName: name,
        })
        await createUserProfile({
          uid: result.user.uid,
          displayName: name || "",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          bio: "",
          location: "",
          website: "",
          joinDate: new Date().toISOString(),
          socialLinks: {
            instagram: "",
            twitter: "",
            soundcloud: "",
            spotify: ""
          }
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      throw error
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      throw error
    }
  }

  async function logout() {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      throw error
    }
  }

  async function signInWithGoogle() {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        await createUserProfile({
          uid: result.user.uid,
          displayName: result.user.displayName || "",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          bio: "",
          location: "",
          website: "",
          joinDate: new Date().toISOString(),
          socialLinks: {
            instagram: "",
            twitter: "",
            soundcloud: "",
            spotify: ""
          }
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      throw error
    }
  }

  async function signInWithFacebook() {
    try {
      setError(null)
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        await createUserProfile({
          uid: result.user.uid,
          displayName: result.user.displayName || "",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          bio: "",
          location: "",
          website: "",
          joinDate: new Date().toISOString(),
          socialLinks: {
            instagram: "",
            twitter: "",
            soundcloud: "",
            spotify: ""
          }
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      throw error
    }
  }

  async function updateProfileInContext() {
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error updating user profile in context:", error);
      }
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    signInWithGoogle,
    signInWithFacebook,
    error,
    setError,
    updateProfileInContext,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

