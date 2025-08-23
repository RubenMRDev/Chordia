export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinDate: string;
    role: 'user' | 'admin';
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        soundcloud?: string;
        spotify?: string;
    };
}
export declare const createUserProfile: (user: UserProfile) => Promise<void>;
export declare const getUserProfile: (uid: string) => Promise<UserProfile | null>;
export declare const updateUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
export declare const deleteUserProfile: (userId: string) => Promise<void>;
export declare const updateUserRole: (userId: string, role: "user" | "admin") => Promise<void>;
