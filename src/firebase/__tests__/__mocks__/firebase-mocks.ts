import { jest } from '@jest/globals';
import type { 
  DocumentReference, 
  DocumentSnapshot, 
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentData,
  Firestore 
} from '@firebase/firestore';
import type { StorageReference, UploadResult } from '@firebase/storage';
import { Mock } from 'jest-mock';

// Type definitions
export type MockDocumentReference = Omit<DocumentReference<DocumentData>, 'converter'> & {
  converter: any;
};

export type MockDocumentSnapshot = Omit<DocumentSnapshot<DocumentData>, 'exists' | 'data'> & {
  exists: () => this is QueryDocumentSnapshot<DocumentData>;
  data: () => DocumentData | null;
};

export type MockStorageReference = Omit<StorageReference, 'parent' | 'root' | 'storage'> & {
  parent: MockStorageReference | null;
  root: MockStorageReference | null;
};

export type MockUploadResult = Omit<UploadResult, 'ref'> & {
  ref: MockStorageReference;
};

// Helper functions
export const createMockDocumentRef = (id: string): MockDocumentReference => ({
  id,
  path: `collection/${id}`,
  parent: {} as CollectionReference<DocumentData>,
  firestore: {} as Firestore,
  type: 'document',
  withConverter: jest.fn()
} as MockDocumentReference);

export const createMockDocumentSnapshot = (
  exists: boolean,
  data: DocumentData | null,
  ref: MockDocumentReference
): MockDocumentSnapshot => ({
  id: ref.id,
  ref,
  metadata: {
    hasPendingWrites: false,
    fromCache: false,
    isEqual: jest.fn()
  },
  exists: function(this: DocumentSnapshot): this is QueryDocumentSnapshot<DocumentData> {
    return exists;
  },
  data: () => data,
} as MockDocumentSnapshot);

export const createMockStorageRef = (path: string): MockStorageReference => ({
  fullPath: path,
  bucket: 'test-bucket',
  name: path.split('/').pop() || '',
  parent: null,
  root: null,
  toString: () => path
} as MockStorageReference);

// Mock refs and snapshots
export const mockDocRef = createMockDocumentRef('mockDocId');
export const mockStorageRef = createMockStorageRef('test-path');

export const mockCollectionRef: Partial<CollectionReference<DocumentData>> = {
  id: 'mockCollection',
  path: 'mockCollection',
  parent: null,
  type: 'collection',
  doc: jest.fn().mockReturnValue(mockDocRef)
};

// Mock services
export const mockStorage = { ref: jest.fn().mockReturnValue(mockStorageRef) };
export const mockDb = { 
  collection: jest.fn().mockReturnValue(mockCollectionRef),
  app: {},
  type: 'firestore'
} as unknown as Firestore;

export const mockAuth = { currentUser: { uid: 'testUserId' } };

// Create mock document snapshot helper
const mockDocumentSnapshot = createMockDocumentSnapshot(false, null, mockDocRef);

// Mock Firebase functions with proper typing
export const mockFirebaseFunctions = {
  // Firestore
  collection: jest.fn().mockReturnValue(mockCollectionRef),
  doc: jest.fn().mockReturnValue(mockDocRef),
  addDoc: jest.fn().mockResolvedValue(mockDocRef),
  setDoc: jest.fn().mockImplementation(() => Promise.resolve()),
  getDoc: jest.fn().mockImplementation(() => Promise.resolve(mockDocumentSnapshot)),
  updateDoc: jest.fn().mockImplementation(() => Promise.resolve()),
  deleteDoc: jest.fn().mockImplementation(() => Promise.resolve()),
  query: jest.fn().mockReturnValue(mockCollectionRef),
  where: jest.fn().mockReturnValue({}),
  orderBy: jest.fn().mockReturnValue({}),
  writeBatch: jest.fn().mockReturnValue({
    delete: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    commit: jest.fn().mockImplementation(() => Promise.resolve())
  }),

  // Storage
  getStorage: jest.fn(() => mockStorage),
  uploadBytes: jest.fn().mockImplementation(() => Promise.resolve({ ref: mockStorageRef })),
  getDownloadURL: jest.fn().mockImplementation(() => Promise.resolve('http://example.com/photo.jpg')),
};
