import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";
export const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            await setDoc(userRef, {
                ...user,
                role: user.role || 'user',
                joinDate: new Date().toISOString(),
            });
        }
        else {
            await updateDoc(userRef, { ...user });
        }
    }
    catch (error) {
        console.error("Error creating/updating user profile:", error);
        throw error;
    }
};
export const getUserProfile = async (uid) => {
    const userRef = doc(db, "users", uid);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data();
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};
export const updateUserProfile = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    try {
        await updateDoc(userRef, { ...data });
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};
export const deleteUserProfile = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
    }
    catch (error) {
        console.error('Error deleting user profile:', error);
        throw error;
    }
};
// Función para actualizar el rol de un usuario a admin
export const updateUserRole = async (userId, role) => {
    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, { role });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};
