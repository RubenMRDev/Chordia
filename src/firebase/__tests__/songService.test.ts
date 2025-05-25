// Mock setup must come before any imports
const mockFirebaseFunctions = {
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  writeBatch: jest.fn(),
};

jest.mock('firebase/firestore', () => mockFirebaseFunctions);

const mockDb = {}; // Simple mock DB

jest.mock('../config', () => ({
  db: mockDb,
  __esModule: true
}));

import { jest } from '@jest/globals';
import { collection, addDoc, getDoc, doc, deleteDoc, getDocs, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { createSong, getSongById, deleteSongById, getUserSongs, getAllSongs, deleteAllUserSongs, type Song } from '../songService';
import { 
  createMockDocumentRef,
  createMockDocumentSnapshot 
} from './__mocks__/firebase-mocks';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

describe('Song Service', () => {
  const mockDocRef = createMockDocumentRef('mockDocId');
  
  const mockSongData: Omit<Song, 'id'> = {
    userId: 'testUserId',
    title: 'Test Song',
    tempo: 120,
    key: 'C',
    timeSignature: '4/4',
    chords: [],
    createdAt: '2025-05-25',
  };

  const mockSongs: Song[] = [
    { ...mockSongData, id: 'song1' },
    { ...mockSongData, id: 'song2', title: 'Test Song 2' }
  ];

  const createMockSnapshot = (song: Song) => ({
    id: song.id!,
    ref: createMockDocumentRef(song.id!),
    exists: () => true,
    data: () => {
      const { id, ...data } = song;
      return data;
    }
  });

  const mockQuerySnapshot = {
    docs: mockSongs.map(createMockSnapshot),
    size: mockSongs.length,
    empty: false,
    forEach: jest.fn((callback: (snapshot: QueryDocumentSnapshot<any>) => void) => 
      mockSongs.forEach((song) => {
        callback(createMockSnapshot(song) as unknown as QueryDocumentSnapshot<any>);
      })
    )
  };

  const mockBatch = {
    delete: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    commit: jest.fn().mockImplementation(() => Promise.resolve())
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFirebaseFunctions.collection.mockReturnValue({ id: 'songs', path: 'songs' });
    mockFirebaseFunctions.doc.mockReturnValue(mockDocRef);
    mockFirebaseFunctions.addDoc.mockImplementation(() => Promise.resolve(mockDocRef));
    mockFirebaseFunctions.getDoc.mockImplementation(() => 
      Promise.resolve(createMockDocumentSnapshot(true, mockSongData, mockDocRef))
    );
    mockFirebaseFunctions.deleteDoc.mockImplementation(() => Promise.resolve());
    mockFirebaseFunctions.getDocs.mockImplementation(() => Promise.resolve(mockQuerySnapshot));
    mockFirebaseFunctions.query.mockImplementation((_col, ...queryConstraints) => {
      // Return the queryConstraints array to verify they were passed
      return { queryConstraints };
    });
    mockFirebaseFunctions.where.mockImplementation((...args) => ({ type: 'where', args }));
    mockFirebaseFunctions.orderBy.mockImplementation((...args) => ({ type: 'orderBy', args }));
    mockFirebaseFunctions.writeBatch.mockReturnValue(mockBatch);
  });

  describe('createSong', () => {
    it('should create a song successfully', async () => {
      const result = await createSong(mockSongData);

      expect(collection).toHaveBeenCalledWith(mockDb, 'songs');
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), mockSongData);
      expect(result).toBe('mockDocId');
    });

    it('should throw an error if song creation fails', async () => {
      mockFirebaseFunctions.addDoc.mockImplementationOnce(() => 
        Promise.reject(new Error('Creation failed'))
      );

      await expect(createSong(mockSongData)).rejects.toThrow('Creation failed');
    });
  });

  describe('getSongById', () => {
    it('should return a song when it exists', async () => {
      const songWithId = { ...mockSongData, id: 'mockDocId' };
      mockFirebaseFunctions.getDoc.mockImplementationOnce(() =>
        Promise.resolve(createMockDocumentSnapshot(true, mockSongData, mockDocRef))
      );

      const result = await getSongById('mockDocId');

      expect(doc).toHaveBeenCalledWith(mockDb, 'songs', 'mockDocId');
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual(songWithId);
    });

    it('should return null when song does not exist', async () => {
      mockFirebaseFunctions.getDoc.mockImplementationOnce(() =>
        Promise.resolve(createMockDocumentSnapshot(false, null, mockDocRef))
      );

      const result = await getSongById('mockDocId');
      expect(result).toBeNull();
    });
  });

  describe('deleteSongById', () => {
    it('should delete a song successfully', async () => {
      await deleteSongById('mockDocId');

      expect(doc).toHaveBeenCalledWith(mockDb, 'songs', 'mockDocId');
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should throw an error if deletion fails', async () => {
      mockFirebaseFunctions.deleteDoc.mockImplementationOnce(() => 
        Promise.reject(new Error('Deletion failed'))
      );

      await expect(deleteSongById('mockDocId')).rejects.toThrow('Deletion failed');
    });
  });

  describe('getUserSongs', () => {
    it('should return user songs when they exist sorted by createdAt', async () => {
      const result = await getUserSongs('testUserId');

      expect(collection).toHaveBeenCalledWith(mockDb, 'songs');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'testUserId');
      expect(getDocs).toHaveBeenCalled();
      
      const sortedSongs = [...mockSongs].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      expect(result).toEqual(sortedSongs);
    });

    it('should return empty array when user has no songs', async () => {
      mockFirebaseFunctions.getDocs.mockImplementationOnce(() => 
        Promise.resolve({
          docs: [],
          size: 0,
          empty: true,
          forEach: jest.fn()
        })
      );

      const result = await getUserSongs('testUserId');
      expect(result).toEqual([]);
    });
  });

  describe('getAllSongs', () => {
    it('should return all songs sorted by created date', async () => {
      const result = await getAllSongs();

      expect(collection).toHaveBeenCalledWith(mockDb, 'songs');
      expect(query).toHaveBeenCalled();
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual(mockSongs);
    });
  });

  describe('deleteAllUserSongs', () => {
    it('should delete all user songs successfully', async () => {
      await deleteAllUserSongs('testUserId');

      expect(collection).toHaveBeenCalledWith(mockDb, 'songs');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'testUserId');
      expect(getDocs).toHaveBeenCalled();
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.delete).toHaveBeenCalledTimes(mockSongs.length);
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should not commit batch if user has no songs', async () => {
      const emptyQuerySnapshot = {
        docs: [],
        size: 0,
        empty: true,
        forEach: jest.fn()
      };

      mockFirebaseFunctions.getDocs.mockImplementationOnce(() => 
        Promise.resolve(emptyQuerySnapshot)
      );

      await deleteAllUserSongs('testUserId');

      expect(mockBatch.delete).not.toHaveBeenCalled();
      expect(mockBatch.commit).not.toHaveBeenCalled();
    });

    it('should throw an error if deletion fails', async () => {
      mockBatch.commit.mockImplementationOnce(() => 
        Promise.reject(new Error('Batch deletion failed'))
      );

      await expect(deleteAllUserSongs('testUserId')).rejects.toThrow('Batch deletion failed');
    });  });  it('should return null when song does not exist', async () => {
    mockFirebaseFunctions.getDoc.mockImplementation(() => 
      Promise.resolve(createMockDocumentSnapshot(false, null, mockDocRef))
    );

    const result = await getSongById('nonExistentSongId');
    expect(result).toBeNull();
  });
});
