import { type ReactNode } from "react";
import { type User } from "firebase/auth";
import type { UserProfile } from '../types/firebase';
interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithFacebook: () => Promise<void>;
    error: string | null;
    setError: (error: string | null) => void;
    updateProfileInContext: () => Promise<void>;
    refreshUserProfile: () => Promise<UserProfile | null>;
}
export declare const AuthContext: import("react").Context<AuthContextType | undefined>;
export declare function useAuth(): AuthContextType;
interface AuthProviderProps {
    children: ReactNode;
}
export declare function AuthProvider({ children }: AuthProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
