// Mock user for authentication
const mockUser = {
  uid: 'testUserId',
  email: 'test@example.com',
};

// Mock auth service
export const auth = {
  currentUser: {
    uid: 'testUserId',
  },
};

// Mock storage service
export const mockStorageRef = { fullPath: 'mockRef' };
export const storage = {
  ref: jest.fn(() => mockStorageRef),
};

// Mock firestore service
export const mockDocRef = { id: 'mockDocRef' };
export const mockCollectionRef = { id: 'mockCollectionRef' };
export const db = {
  collection: jest.fn(() => mockCollectionRef),
  doc: jest.fn(() => mockDocRef),
};

const mockDocumentSnapshot = {
  exists: jest.fn(() => false),
  data: jest.fn(() => null),
  get: jest.fn(),
  id: 'mockDocId',
};

export const mockFirestore = {
  doc: jest.fn(() => mockDocRef),
  getDoc: jest.fn(() => Promise.resolve(mockDocumentSnapshot)),
  setDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mockId' })),
};

export default {
  auth,
  storage,
  db,
  mockFirestore,
};
