import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import type { DocumentSnapshot, QueryDocumentSnapshot, DocumentData } from '@firebase/firestore';
import { TextEncoder, TextDecoder } from 'util';

// Silence console.error during tests
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

import type { 
  MockDocumentReference, 
  MockDocumentSnapshot, 
  MockQuerySnapshot, 
  MockCollectionReference,
  MockFirestore,
  MockWriteBatch,
  MockStorageReference,
  FirestoreMocks,
  JestMockFn
} from './types/firebase-jest';

// Mock refs and snapshots
export const mockDocRef = {
  id: 'mockDocId',
  path: 'songs/mockDocId',
  parent: null,
  firestore: {},
  type: 'document',
  converter: null
} as unknown as MockDocumentReference;

export const mockStorageRef = {
  fullPath: 'mockRef',
  bucket: 'test-bucket',
  name: 'test-name'
} as unknown as MockStorageReference;

export const mockCollectionRef = {
  id: 'songs',
  path: 'songs',
  parent: null,
  firestore: {},
  type: 'collection',
  doc: jest.fn()
} as unknown as MockCollectionReference;

export const mockDocumentData = {
  userId: 'testUserId',
  title: 'Test Song',
  tempo: 120,
  key: 'C',
  timeSignature: '4/4',
  chords: [],
  createdAt: '2025-05-25'
};

const createDocumentSnapshot = () => ({
  id: 'mockDocId',
  ref: mockDocRef,
  metadata: {
    hasPendingWrites: false,
    isEqual: jest.fn(),
    fromCache: false
  },
  exists: jest.fn().mockImplementation(function(this: DocumentSnapshot): this is QueryDocumentSnapshot {
    return true;
  }),
  data: jest.fn().mockReturnValue(mockDocumentData)
} as unknown as MockDocumentSnapshot);

export const mockDocumentSnapshot = createDocumentSnapshot();

const createQuerySnapshot = () => ({
  docs: [mockDocumentSnapshot],
  size: 1,
  empty: false,
  forEach: jest.fn((callback: (result: typeof mockDocumentSnapshot) => void) => {
    callback(mockDocumentSnapshot);
  })
} as unknown as MockQuerySnapshot);

export const mockQuerySnapshot = createQuerySnapshot();

export const mockBatch = {
  delete: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  commit: jest.fn().mockImplementation(() => Promise.resolve())
} as unknown as MockWriteBatch;

// Mock services
export const mockStorage = { 
  ref: jest.fn().mockReturnValue(mockStorageRef)
};

export const mockDb = {
  app: {},
  type: 'firestore',
  toJSON: jest.fn()
} as unknown as MockFirestore;

export const mockAuth = { currentUser: { uid: 'testUserId' } };

// Set up environment variables for tests
process.env.VITE_FIREBASE_API_KEY = 'test-api-key';
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id';
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
process.env.VITE_FIREBASE_APP_ID = 'test-app-id';
process.env.VITE_FIREBASE_MEASUREMENT_ID = 'test-measurement-id';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
}));

const collection = jest.fn().mockReturnValue(mockCollectionRef) as unknown as JestMockFn<[string], MockCollectionReference>;
const doc = jest.fn().mockReturnValue(mockDocRef) as unknown as JestMockFn<[MockCollectionReference, string], MockDocumentReference>;
const addDoc = jest.fn().mockImplementation(() => Promise.resolve(mockDocRef)) as unknown as JestMockFn<[MockCollectionReference, DocumentData], Promise<MockDocumentReference>>;
const setDoc = jest.fn().mockImplementation(() => Promise.resolve()) as unknown as JestMockFn<[MockDocumentReference, DocumentData], Promise<void>>;
const getDoc = jest.fn().mockImplementation(() => Promise.resolve(mockDocumentSnapshot)) as unknown as JestMockFn<[MockDocumentReference], Promise<MockDocumentSnapshot>>;
const getDocs = jest.fn().mockImplementation(() => Promise.resolve(mockQuerySnapshot)) as unknown as JestMockFn<[MockCollectionReference], Promise<MockQuerySnapshot>>;
const updateDoc = jest.fn().mockImplementation(() => Promise.resolve()) as unknown as JestMockFn<[MockDocumentReference, Partial<DocumentData>], Promise<void>>;
const deleteDoc = jest.fn().mockImplementation(() => Promise.resolve()) as unknown as JestMockFn<[MockDocumentReference], Promise<void>>;
const writeBatch = jest.fn().mockReturnValue(mockBatch) as unknown as JestMockFn<[], MockWriteBatch>;
const query = jest.fn().mockReturnValue(mockCollectionRef) as unknown as JestMockFn;
const where = jest.fn().mockReturnValue({}) as unknown as JestMockFn;
const orderBy = jest.fn().mockReturnValue({}) as unknown as JestMockFn;

const firestoreMocks = {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
};

jest.mock('firebase/firestore', () => firestoreMocks);

jest.mock('firebase/storage', () => ({
  ref: jest.fn().mockReturnValue(mockStorageRef),
  uploadBytes: jest.fn().mockImplementation(() => Promise.resolve({ ref: mockStorageRef })),
  getDownloadURL: jest.fn().mockImplementation(() => Promise.resolve('http://example.com/photo.jpg')),
  getStorage: jest.fn(() => mockStorage)
}));

jest.mock('./firebase/config', () => ({
  auth: mockAuth,
  db: mockDb,
  storage: mockStorage
}));

// Global mock setup
beforeEach(() => {
  jest.clearAllMocks();
});
