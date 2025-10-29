"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, updateProfile, } from "firebase/auth";
import { auth } from "../firebase/config";
import { createUserProfile, getUserProfile } from '../firebase/userService';
export const AuthContext = createContext(undefined);
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                try {
                    let profile = await getUserProfile(currentUser.uid);
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
                            role: "user",
                            joinDate: new Date().toISOString(),
                            socialLinks: {
                                instagram: "",
                                twitter: "",
                                soundcloud: "",
                                spotify: ""
                            }
                        };
                        await createUserProfile(profile);
                    }
                    setUserProfile(profile);
                }
                catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
            else {
                setUserProfile(null);
            }
        };
        fetchUserProfile();
    }, [currentUser]);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    async function register(email, password, name) {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (result.user) {
                await updateProfile(result.user, {
                    displayName: name,
                });
                await createUserProfile({
                    uid: result.user.uid,
                    displayName: name || "",
                    email: result.user.email || "",
                    photoURL: result.user.photoURL || "",
                    bio: "",
                    location: "",
                    website: "",
                    role: "user",
                    joinDate: new Date().toISOString(),
                    socialLinks: {
                        instagram: "",
                        twitter: "",
                        soundcloud: "",
                        spotify: ""
                    }
                });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            throw error;
        }
    }
    async function login(email, password) {
        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            throw error;
        }
    }
    async function logout() {
        try {
            setError(null);
            await signOut(auth);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            throw error;
        }
    }
    async function signInWithGoogle() {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                // Verificar si el usuario ya existe
                const existingProfile = await getUserProfile(result.user.uid);
                if (!existingProfile) {
                    // Solo crear perfil si no existe
                    await createUserProfile({
                        uid: result.user.uid,
                        displayName: result.user.displayName || "",
                        email: result.user.email || "",
                        photoURL: result.user.photoURL || "",
                        bio: "",
                        location: "",
                        website: "",
                        role: "user", // Solo para usuarios nuevos
                        joinDate: new Date().toISOString(),
                        socialLinks: {
                            instagram: "",
                            twitter: "",
                            soundcloud: "",
                            spotify: ""
                        }
                    });
                }
                // Si el usuario ya existe, no sobrescribimos su perfil
            }
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            throw error;
        }
    }
    async function signInWithFacebook() {
        try {
            setError(null);
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                // Verificar si el usuario ya existe
                const existingProfile = await getUserProfile(result.user.uid);
                if (!existingProfile) {
                    // Solo crear perfil si no existe
                    await createUserProfile({
                        uid: result.user.uid,
                        displayName: result.user.displayName || "",
                        email: result.user.email || "",
                        photoURL: result.user.photoURL || "",
                        bio: "",
                        location: "",
                        website: "",
                        role: "user", // Solo para usuarios nuevos
                        joinDate: new Date().toISOString(),
                        socialLinks: {
                            instagram: "",
                            twitter: "",
                            soundcloud: "",
                            spotify: ""
                        }
                    });
                }
                // Si el usuario ya existe, no sobrescribimos su perfil
            }
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError("An unknown error occurred");
            }
            throw error;
        }
    }
    async function updateProfileInContext() {
        if (currentUser) {
            try {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setUserProfile(profile);
                    console.log('✅ Perfil actualizado en contexto:', profile.role);
                }
            }
            catch (error) {
                console.error("Error updating user profile in context:", error);
            }
        }
    }
    // Función para forzar la actualización del perfil
    const refreshUserProfile = async () => {
        if (currentUser) {
            try {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setUserProfile(profile);
                    console.log('🔄 Perfil refrescado:', profile.role);
                    return profile;
                }
            }
            catch (error) {
                console.error("Error refreshing user profile:", error);
            }
        }
        return null;
    };
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
        refreshUserProfile,
    };
    return _jsx(AuthContext.Provider, { value: value, children: !loading && children });
}
