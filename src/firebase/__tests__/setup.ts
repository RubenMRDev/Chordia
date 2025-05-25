// Mock values
export const mockDocRef = {
  id: 'mockDocId',
};

export const mockDocumentSnapshot = {
  exists: jest.fn(() => false),
  data: jest.fn(() => null),
  ref: mockDocRef,
};

export const mockCollectionRef = {
  doc: jest.fn().mockReturnValue(mockDocRef),
};

export const mockStorageRef = {
  fullPath: 'mockRef',
};

// Mock implementations
export const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollectionRef),
  doc: jest.fn().mockReturnValue(mockDocRef),
};

export const mockStorage = {
  ref: jest.fn().mockReturnValue(mockStorageRef),
};

export const mockAuth = {
  currentUser: {
    uid: 'testUserId',
  },
};
