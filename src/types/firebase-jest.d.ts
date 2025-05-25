import type { DocumentData, DocumentReference, DocumentSnapshot, QuerySnapshot, CollectionReference, Firestore, WriteBatch, Query } from '@firebase/firestore';
import type { StorageReference, UploadTaskSnapshot } from '@firebase/storage';
import type { Mock } from 'jest-mock';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
}

export interface JestMockFn<TArgs extends any[] = any[], TReturns = any> extends Mock<(...args: TArgs) => TReturns> {}

export interface FirestoreMocks {
  collection: JestMockFn<[Firestore, string], CollectionReference>;
  doc: JestMockFn<[Firestore, string, string], DocumentReference>;
  addDoc: JestMockFn<[CollectionReference, DocumentData], Promise<DocumentReference>>;
  getDoc: JestMockFn<[DocumentReference], Promise<DocumentSnapshot>>;
  getDocs: JestMockFn<[Query], Promise<QuerySnapshot>>;
  setDoc: JestMockFn<[DocumentReference, DocumentData], Promise<void>>;
  updateDoc: JestMockFn<[DocumentReference, Partial<DocumentData>], Promise<void>>;
  deleteDoc: JestMockFn<[DocumentReference], Promise<void>>;
  writeBatch: JestMockFn<[], WriteBatch>;
  query: JestMockFn<[CollectionReference, ...any[]], Query>;
  where: JestMockFn<[string, string, any], Query>;
  orderBy: JestMockFn<[string, string?], Query>;
}

export interface MockDocumentReference extends DocumentReference<DocumentData> {
  id: string;
  path: string;
}

export interface MockDocumentSnapshot extends DocumentSnapshot<DocumentData> {
  id: string;
  ref: MockDocumentReference;
  exists: jest.Mock<() => boolean>;
  data: jest.Mock<() => DocumentData | undefined>;
}

export interface MockQuerySnapshot extends QuerySnapshot<DocumentData> {
  docs: Array<MockDocumentSnapshot>;
  empty: boolean;
  size: number;
  forEach: (callback: (result: DocumentData) => void) => void;
}

export interface MockCollectionReference extends CollectionReference<DocumentData> {
  id: string;
  path: string;
}

export interface MockFirestore extends Firestore {}

export interface MockWriteBatch extends WriteBatch {
  delete: jest.Mock;
  update: jest.Mock;
  set: jest.Mock;
  commit: jest.Mock<() => Promise<void>>;
}

export interface MockStorageReference extends StorageReference {
  fullPath: string;
  bucket: string;
  name: string;
}

export interface MockUploadTaskSnapshot extends UploadTaskSnapshot {
  ref: MockStorageReference;
}
