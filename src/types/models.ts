/**
 * Domain models shared across the app.
 *
 * These used to live in `types/firebase.d.ts` alongside `declare module`
 * blocks that redefined `firebase/firestore`, `firebase/storage` and
 * `firebase/auth` with `any` — and typed `Auth`'s methods as `jest.Mock`,
 * leaking test doubles into the production types. Those augmentations
 * overrode the SDK's own, perfectly good types everywhere in the codebase, so
 * they are gone; the real models stayed.
 */

import type { PianoSettings } from '../features/piano/pianoSettings';

export interface ChordType {
  keys: string[];
  selected: boolean;
}

export interface Song {
  id?: string;
  userId: string;
  title: string;
  tempo: number;
  key: string;
  timeSignature: string;
  chords: ChordType[];
  createdAt: string;
}

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
  /** Rango de teclas del piano del usuario, para el modo MIDI. */
  piano?: PianoSettings;
}
