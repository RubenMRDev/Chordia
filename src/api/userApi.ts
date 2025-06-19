import { getUserProfile as getUserProfileFirebase, createUserProfile as createUserProfileFirebase, updateUserProfile as updateUserProfileFirebase, deleteUserProfile as deleteUserProfileFirebase, updateUserRole as updateUserRoleFirebase } from '../firebase/userService';
import type { UserProfile } from '../types/firebase';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getUserProfileFirebase(uid);
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  return createUserProfileFirebase(profile);
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  return updateUserProfileFirebase(uid, profile);
}

export async function deleteUserProfile(uid: string): Promise<void> {
  return deleteUserProfileFirebase(uid);
}

export async function updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
  return updateUserRoleFirebase(uid, role);
} 