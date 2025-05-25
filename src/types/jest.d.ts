/// <reference types="jest" />

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      mockResolvedValue: (value: any) => jest.Mock<Promise<T>>;
      mockResolvedValueOnce: (value: any) => jest.Mock<Promise<T>>;
      mockImplementation: (fn: (...args: Y) => T) => jest.Mock<T, Y>;
      mockImplementationOnce: (fn: (...args: Y) => T) => jest.Mock<T, Y>;
      mockReturnValue: (value: T) => jest.Mock<T, Y>;
      mockReturnValueOnce: (value: T) => jest.Mock<T, Y>;
    }
  }
}

declare module 'firebase/firestore' {
  interface DocumentReference {
    id: string;
  }

  interface DocumentSnapshot {
    exists(): boolean;
    data(): any;
    ref: DocumentReference;
  }
}

declare module 'firebase/storage' {
  interface StorageReference {
    fullPath: string;
  }

  interface UploadResult {
    ref: StorageReference;
  }
}

export {};
