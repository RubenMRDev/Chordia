import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseEnv, FirebaseUnconfiguredError, isFirebaseConfigured } from './env';

/*
  This is the only module that imports the Firebase SDK, and it must only ever
  be reached through a dynamic `import()`. Importing it statically from
  application code puts the whole SDK back on the critical path of every page,
  including the ones that work with no account. Import `./env` instead when all
  you need is `isFirebaseConfigured`.
*/

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseEnv);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

/*
  Accessors rather than exported instances. Callers get a non-nullable value or
  a named error, so the Firestore call sites stay readable and no account
  feature can silently operate on null.
*/

export const requireAuth = (): Auth => {
  if (!authInstance) throw new FirebaseUnconfiguredError();
  return authInstance;
};

export const requireDb = (): Firestore => {
  if (!dbInstance) throw new FirebaseUnconfiguredError();
  return dbInstance;
};

/** For the rare read that genuinely wants to know rather than to fail. */
export const maybeAuth = (): Auth | null => authInstance;

export { FirebaseUnconfiguredError, isFirebaseConfigured };

export default app;
