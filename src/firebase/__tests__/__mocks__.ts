export const mockDb = {
  collection: jest.fn(),
  doc: jest.fn(),
};

export const mockStorage = {
  ref: jest.fn(),
};

export const mockAuth = {
  currentUser: {
    uid: 'testUserId',
  },
};

export const mockStorageRef = {
  fullPath: 'mockRef',
};

export const mockCollectionRef = {
  doc: jest.fn(),
};

export const mockDocRef = {
  id: 'mockDocId',
};

export const mockDocumentSnapshot = {
  exists: jest.fn(() => false),
  data: jest.fn(() => null),
  ref: mockDocRef,
};

// Export as named exports for individual mocking
export { mockDb as db, mockStorage as storage, mockAuth as auth };
