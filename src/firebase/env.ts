/**
 * Firebase configuration read from the environment.
 *
 * Deliberately free of any `firebase/*` import. Anything that only needs to
 * know *whether* Firebase is available imports this file, so asking the
 * question does not drag 535 kB of SDK onto the page. `config.ts` is the one
 * module that touches the SDK, and it is only ever reached through a dynamic
 * import.
 */
export const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Whether this copy of Chordia has usable credentials.
 *
 * The catalogue, the importer and the piano are all meant to work without an
 * account, so a checkout with no `.env` must still boot and play.
 */
export const isFirebaseConfigured = Boolean(
  firebaseEnv.apiKey && firebaseEnv.projectId,
);

/** Thrown when an account feature is reached in an unconfigured checkout. */
export class FirebaseUnconfiguredError extends Error {
  constructor() {
    super('Firebase is not configured in this build');
    this.name = 'FirebaseUnconfiguredError';
  }
}
