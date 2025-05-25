// Mock setup must come before any imports
const mockFirebaseFunctions = {
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
};

jest.mock('firebase/firestore', () => mockFirebaseFunctions);

const mockDb = {}; // Simple mock DB

jest.mock('../config', () => ({
  db: mockDb,
  __esModule: true
}));

import { jest } from '@jest/globals';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserProfile, getUserProfile, updateUserProfile, UserProfile } from '../userService';
import { 
  createMockDocumentRef,
  createMockDocumentSnapshot 
} from './__mocks__/firebase-mocks';

describe('User Service', () => {  
  const mockDocRef = createMockDocumentRef('testUserId');
  
  const mockUser: UserProfile = {
    uid: 'testUserId',
    displayName: 'Test User',
    email: 'test@example.com',
    joinDate: '2025-05-25',
    socialLinks: {
      twitter: 'https://twitter.com/testuser'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFirebaseFunctions.doc.mockReturnValue(mockDocRef);
    mockFirebaseFunctions.getDoc.mockImplementation(() => 
      Promise.resolve(createMockDocumentSnapshot(false, null, mockDocRef))
    );
    mockFirebaseFunctions.setDoc.mockImplementation(() => Promise.resolve());
    mockFirebaseFunctions.updateDoc.mockImplementation(() => Promise.resolve());
  });

  describe('createUserProfile', () => {
    it('should create a new user profile when it does not exist', async () => {
      mockFirebaseFunctions.getDoc.mockImplementation(() =>
        Promise.resolve(createMockDocumentSnapshot(false, null, mockDocRef))
      );

      await createUserProfile(mockUser);

      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          ...mockUser,
          joinDate: expect.any(String)
        })
      );
    });

    it('should update existing user profile', async () => {
      mockFirebaseFunctions.getDoc.mockImplementation(() =>
        Promise.resolve(createMockDocumentSnapshot(true, mockUser, mockDocRef))
      );

      await createUserProfile(mockUser);

      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining(mockUser)
      );
    });

    it('should throw error when operation fails', async () => {
      mockFirebaseFunctions.setDoc.mockImplementation(() => 
        Promise.reject(new Error('Firebase error'))
      );

      await expect(createUserProfile(mockUser)).rejects.toThrow('Firebase error');
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile when it exists', async () => {
      const mockUserData = { ...mockUser };
      mockFirebaseFunctions.getDoc.mockImplementation(() =>
        Promise.resolve(createMockDocumentSnapshot(true, mockUserData, mockDocRef))
      );

      const result = await getUserProfile(mockUser.uid);

      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(result).toEqual(mockUserData);
    });

    it('should return null when user profile does not exist', async () => {
      mockFirebaseFunctions.getDoc.mockImplementation(() =>
        Promise.resolve(createMockDocumentSnapshot(false, null, mockDocRef))
      );

      const result = await getUserProfile(mockUser.uid);

      expect(result).toBeNull();
    });

    it('should throw error when operation fails', async () => {
      mockFirebaseFunctions.getDoc.mockImplementation(() => 
        Promise.reject(new Error('Firebase error'))
      );

      await expect(getUserProfile(mockUser.uid)).rejects.toThrow('Firebase error');
    });
  });

  describe('updateUserProfile', () => {
    const updateData = {
      displayName: 'Updated Name',
      bio: 'New bio'
    };

    it('should update user profile successfully', async () => {
      await updateUserProfile(mockUser.uid, updateData);

      expect(doc).toHaveBeenCalledWith(mockDb, 'users', mockUser.uid);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, updateData);
    });

    it('should throw error when operation fails', async () => {
      mockFirebaseFunctions.updateDoc.mockImplementation(() => 
        Promise.reject(new Error('Firebase error'))
      );

      await expect(updateUserProfile(mockUser.uid, updateData)).rejects.toThrow('Firebase error');
    });  });
  it('should check if user exists', async () => {
    mockFirebaseFunctions.getDoc.mockImplementation(() =>
      Promise.resolve(createMockDocumentSnapshot(true, mockUser, mockDocRef))
    );
    const result = await getUserProfile('testUserId');
    expect(result).toBeTruthy();
  });
});
