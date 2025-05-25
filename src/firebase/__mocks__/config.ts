export const mockDocRef = { id: 'mockDocId' };
export const mockCollectionRef = { doc: jest.fn(() => mockDocRef) };
export const mockStorageRef = { fullPath: 'mockRef' };

export const mockDb = {
  collection: jest.fn(() => mockCollectionRef),
  doc: jest.fn(() => mockDocRef)
};

export const mockStorage = {
  ref: jest.fn(() => mockStorageRef)
};

export const mockAuth = {
  currentUser: {
    uid: 'testUserId'
  }
};

export default {
  db: mockDb,
  storage: mockStorage,
  auth: mockAuth
};
