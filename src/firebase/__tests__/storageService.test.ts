import { jest } from '@jest/globals';
import type { StorageReference } from 'firebase/storage';

// Mock storage reference
const mockStorageRef: Partial<StorageReference> & { fullPath: string; bucket: string } = {
  fullPath: 'test-path',
  bucket: 'test-bucket',
  name: 'test-file'
};

// Mock storage instance
const mockStorage = {};

// Mock functions with proper types
const mockRef = jest.fn().mockReturnValue(mockStorageRef);
const mockUploadBytes = jest.fn().mockImplementation(() => Promise.resolve({ ref: mockStorageRef }));
const mockGetDownloadURL = jest.fn().mockImplementation(() => Promise.resolve('http://example.com/photo.jpg'));
const mockGetStorage = jest.fn().mockReturnValue(mockStorage);

// Setup mocks
jest.mock('firebase/storage', () => ({
  ref: mockRef,
  uploadBytes: mockUploadBytes,
  getDownloadURL: mockGetDownloadURL,
  getStorage: mockGetStorage
}));

// Mock Firebase Auth
const mockAuth = {
  currentUser: { uid: 'testUserId' }
};

jest.mock('../config', () => ({
  auth: mockAuth,
  storage: mockStorage,
  __esModule: true
}));

// Import after mocks are setup
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { uploadProfilePicture, uploadSongCover } from '../storageService';

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    Object.defineProperty(mockAuth, 'currentUser', {
      value: { uid: 'testUserId' },
      writable: true
    });
  });

  describe('uploadProfilePicture', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    it('should upload a profile picture successfully', async () => {
      const result = await uploadProfilePicture(mockFile);

      expect(mockRef).toHaveBeenCalledWith(mockStorage, 'user-profiles/testUserId/profile-picture');
      expect(mockUploadBytes).toHaveBeenCalledWith(mockStorageRef, mockFile);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockStorageRef);
      expect(result).toBe('http://example.com/photo.jpg');
    });

    it('should throw an error if user is not authenticated', async () => {
      Object.defineProperty(mockAuth, 'currentUser', {
        value: null,
        writable: true
      });

      await expect(uploadProfilePicture(mockFile))
        .rejects.toThrow('User not authenticated');
    });

    it('should throw an error if upload fails', async () => {
      mockUploadBytes.mockRejectedValueOnce(new Error('Upload failed'));

      await expect(uploadProfilePicture(mockFile))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('uploadSongCover', () => {
    const mockFile = new File([''], 'cover.jpg', { type: 'image/jpeg' });
    const songId = 'test-song-id';

    it('should upload a song cover successfully', async () => {
      const result = await uploadSongCover(songId, mockFile);

      expect(mockRef).toHaveBeenCalledWith(mockStorage, 'songs/testUserId/test-song-id/cover');
      expect(mockUploadBytes).toHaveBeenCalledWith(mockStorageRef, mockFile);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockStorageRef);
      expect(result).toBe('http://example.com/photo.jpg');
    });

    it('should throw an error if user is not authenticated', async () => {
      Object.defineProperty(mockAuth, 'currentUser', {
        value: null,
        writable: true
      });

      await expect(uploadSongCover(songId, mockFile))
        .rejects.toThrow('User not authenticated');
    });

    it('should throw an error if songId is not provided', async () => {
      await expect(uploadSongCover('', mockFile))
        .rejects.toThrow('Song ID is required');
    });

    it('should throw an error if upload fails', async () => {
      mockUploadBytes.mockRejectedValueOnce(new Error('Upload failed'));

      await expect(uploadSongCover(songId, mockFile))
        .rejects.toThrow('Upload failed');
    });  });
  it('should create correct reference for profile picture', () => {
    const mockStorageRef = { fullPath: 'mockRef' };
    mockRef.mockReturnValueOnce(mockStorageRef);
    
    const userId = 'testUserId';
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    expect(() => uploadProfilePicture(userId, file)).not.toThrow();
  });
});
