export interface ChordType {
    keys: string[];
    selected: boolean;
}
export interface Song {
    id?: string;
    userId: string;
    title: string;
    tempo: number;
    key: string;
    timeSignature: string;
    chords: ChordType[];
    createdAt: string;
}
export declare const createSong: (song: Omit<Song, "id">) => Promise<string>;
export declare const getUserSongs: (userId: string) => Promise<Song[]>;
export declare const getSongById: (songId: string) => Promise<Song | null>;
export declare const deleteSongById: (songId: string) => Promise<void>;
export declare const getAllSongs: () => Promise<Song[]>;
export declare const deleteAllUserSongs: (userId: string) => Promise<void>;
export declare const getAllSongsWithUserInfo: () => Promise<(Song & {
    userDisplayName: string;
})[]>;
export declare const deleteSongAsAdmin: (songId: string) => Promise<void>;
