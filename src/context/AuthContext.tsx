import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '../firebase/env';
import type { UserProfile } from '../types/models';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  /**
   * `remember` picks the session's persistence: local survives closing the
   * browser, session does not. The login form's checkbox used to set a piece of
   * state nobody read.
   */
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  /** Sends a password-reset email. */
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
  updateProfileInContext: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/*
  Firebase is imported on demand, never at module load.

  Importing `firebase/auth` statically here put 466 kB of Firebase (109 kB
  gzipped) on the critical path of every page — including the home page and the
  player, which work with no account at all. These load it the first time
  something actually needs a session; the browser caches the chunk after that.
*/
const authModule = () => import('firebase/auth');
const firebaseConfig = () => import('../firebase/config');
const profileModule = () => import('../firebase/userService');

/** A blank profile for a user who has signed in but has no document yet. */
const blankProfile = (user: User): UserProfile => ({
  uid: user.uid,
  displayName: user.displayName || '',
  email: user.email || '',
  photoURL: user.photoURL || '',
  bio: '',
  location: '',
  website: '',
  role: 'user',
  joinDate: new Date().toISOString(),
  socialLinks: {
    instagram: '',
    twitter: '',
    soundcloud: '',
    spotify: '',
  },
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // With no credentials there is no session to watch, so nothing loads and
    // everything that needs no account keeps working.
    if (!isFirebaseConfigured) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void authModule().then(({ onAuthStateChanged }) => {
      if (cancelled) return;
      void firebaseConfig().then(({ requireAuth }) => {
        if (cancelled) return;
        unsubscribe = onAuthStateChanged(requireAuth(), (user) => {
          setCurrentUser(user);
          setLoading(false);
        });
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const { getUserProfile, createUserProfile } = await profileModule();
        let profile = await getUserProfile(currentUser.uid);
        if (!profile) {
          // No document yet: create one from what the provider gave us.
          profile = blankProfile(currentUser);
          await createUserProfile(profile);
        }
        if (!cancelled) setUserProfile(profile);
      } catch (cause) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Could not load the user profile', cause);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  /** Runs an auth action, surfacing its message and rethrowing for the caller. */
  const run = useCallback(async (action: () => Promise<void>) => {
    try {
      setError(null);
      await action();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'An unknown error occurred',
      );
      throw cause;
    }
  }, []);

  const register = useCallback(
    (email: string, password: string, name: string) =>
      run(async () => {
        const { createUserWithEmailAndPassword, updateProfile } =
          await authModule();
        const { requireAuth } = await firebaseConfig();
        const { createUserProfile } = await profileModule();
        const result = await createUserWithEmailAndPassword(
          requireAuth(),
          email,
          password,
        );
        if (!result.user) return;
        await updateProfile(result.user, { displayName: name });
        await createUserProfile({
          ...blankProfile(result.user),
          displayName: name || '',
        });
      }),
    [run],
  );

  const login = useCallback(
    (email: string, password: string, remember = true) =>
      run(async () => {
        const {
          signInWithEmailAndPassword,
          setPersistence,
          browserLocalPersistence,
          browserSessionPersistence,
        } = await authModule();
        const { requireAuth } = await firebaseConfig();
        const auth = requireAuth();
        await setPersistence(
          auth,
          remember ? browserLocalPersistence : browserSessionPersistence,
        );
        await signInWithEmailAndPassword(auth, email, password);
      }),
    [run],
  );

  const resetPassword = useCallback(
    (email: string) =>
      run(async () => {
        const { sendPasswordResetEmail } = await authModule();
        const { requireAuth } = await firebaseConfig();
        await sendPasswordResetEmail(requireAuth(), email);
      }),
    [run],
  );

  const logout = useCallback(
    () =>
      run(async () => {
        const { signOut } = await authModule();
        const { requireAuth } = await firebaseConfig();
        await signOut(requireAuth());
      }),
    [run],
  );

  /**
   * Shared by the Google and Facebook buttons. An existing profile is never
   * overwritten, so a returning user keeps their bio and their role.
   */
  const signInWithProvider = useCallback(
    (which: 'google' | 'facebook') =>
      run(async () => {
        const { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } =
          await authModule();
        const { requireAuth } = await firebaseConfig();
        const { getUserProfile, createUserProfile } = await profileModule();
        const provider =
          which === 'google'
            ? new GoogleAuthProvider()
            : new FacebookAuthProvider();
        const result = await signInWithPopup(requireAuth(), provider);
        if (!result.user) return;
        const existing = await getUserProfile(result.user.uid);
        if (!existing) await createUserProfile(blankProfile(result.user));
      }),
    [run],
  );

  const signInWithGoogle = useCallback(
    () => signInWithProvider('google'),
    [signInWithProvider],
  );

  const signInWithFacebook = useCallback(
    () => signInWithProvider('facebook'),
    [signInWithProvider],
  );

  const refreshUserProfile =
    useCallback(async (): Promise<UserProfile | null> => {
      if (!currentUser) return null;
      try {
        const { getUserProfile } = await profileModule();
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
          return profile;
        }
      } catch (cause) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Could not refresh the user profile', cause);
        }
      }
      return null;
    }, [currentUser]);

  const updateProfileInContext = useCallback(async () => {
    await refreshUserProfile();
  }, [refreshUserProfile]);

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      userProfile,
      loading,
      register,
      login,
      resetPassword,
      logout,
      signInWithGoogle,
      signInWithFacebook,
      error,
      setError,
      updateProfileInContext,
      refreshUserProfile,
    }),
    [
      currentUser,
      userProfile,
      loading,
      register,
      login,
      resetPassword,
      logout,
      signInWithGoogle,
      signInWithFacebook,
      error,
      updateProfileInContext,
      refreshUserProfile,
    ],
  );

  /*
    Children always render. This used to be `{!loading && children}`, which
    blanked the whole app — home page included — until Firebase answered, so a
    slow network showed an empty screen on pages that need no account.
    `ProtectedRoute` is what waits for the session.
  */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
