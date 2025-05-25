import { UserCredential } from 'firebase/auth';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { UploadResult } from 'firebase/storage';

declare module 'firebase/auth' {
  interface Auth {
    signInWithEmailAndPassword: jest.Mock<Promise<UserCredential>>;
    createUserWithEmailAndPassword: jest.Mock<Promise<UserCredential>>;
    signOut: jest.Mock<Promise<void>>;
  }
}

declare module 'firebase/firestore' {
  export function collection(db: any, path: string): any;
  export function doc(db: any, path: string, ...pathSegments: string[]): DocumentReference<DocumentData>;
  export function setDoc(reference: DocumentReference<DocumentData>, data: any): Promise<void>;
  export function addDoc(reference: any, data: any): Promise<DocumentReference<DocumentData>>;
}

declare module 'firebase/storage' {
  export function ref(storage: any, path: string): any;
  export function uploadBytes(ref: any, file: File): Promise<UploadResult>;
  export function getDownloadURL(ref: any): Promise<string>;
}
