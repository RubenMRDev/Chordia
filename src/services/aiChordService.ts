declare const puter: any;

export interface AIChordRequest {
  style: string;
  mood: string;
  key: string;
  length: number;
  complexity: 'simple' | 'medium' | 'complex';
  description?: string;
}

export interface AIChordResponse {
  chords: string[];
  progression: string[];
  explanation: string;
}

const chordToKeys: { [key: string]: string[] } = {
  "C": ["C4", "E4", "G4"],
  "Cm": ["C4", "Eb4", "G4"],
  "D": ["D4", "F#4", "A4"],
  "Dm": ["D4", "F4", "A4"],
  "E": ["E4", "G#4", "B4"],
  "Em": ["E4", "G4", "B4"],
  "F": ["F4", "A4", "C5"],
  "Fm": ["F4", "Ab4", "C5"],
  "G": ["G4", "B4", "D5"],
  "Gm": ["G4", "Bb4", "D5"],
  "A": ["A4", "C#5", "E5"],
  "Am": ["A4", "C5", "E5"],
  "B": ["B4", "D#5", "F#5"],
  "Bm": ["B4", "D5", "F#5"],
  "C#": ["C#4", "E#4", "G#4"],
  "C#m": ["C#4", "E4", "G#4"],
  "Db": ["Db4", "F4", "Ab4"],
  "Dbm": ["Db4", "Fb4", "Ab4"],
  "D#": ["D#4", "F##4", "A#4"],
  "D#m": ["D#4", "F#4", "A#4"],
  "Eb": ["Eb4", "G4", "Bb4"],
  "Ebm": ["Eb4", "Gb4", "Bb4"],
  "F#": ["F#4", "A#4", "C#5"],
  "F#m": ["F#4", "A4", "C#5"],
  "Gb": ["Gb4", "Bb4", "Db5"],
  "Gbm": ["Gb4", "Bbb4", "Db5"],
  "G#": ["G#4", "B#4", "D#5"],
  "G#m": ["G#4", "B4", "D#5"],
  "Ab": ["Ab4", "C5", "Eb5"],
  "Abm": ["Ab4", "Cb5", "Eb5"],
  "A#": ["A#4", "C##5", "F5"],
  "A#m": ["A#4", "C#5", "F5"],
  "Bb": ["Bb4", "D5", "F5"],
  "Bbm": ["Bb4", "Db5", "F5"],
  "Cmaj7": ["C4", "E4", "G4", "B4"],
  "Dmaj7": ["D4", "F#4", "A4", "C#5"],
  "Emaj7": ["E4", "G#4", "B4", "D#5"],
  "Fmaj7": ["F4", "A4", "C5", "E5"],
  "Gmaj7": ["G4", "B4", "D5", "F#5"],
  "Amaj7": ["A4", "C#5", "E5", "G#5"],
  "Bmaj7": ["B4", "D#5", "F#5", "A#5"],
  "Bbmaj7": ["Bb4", "D5", "F5", "A5"],
  "Ebmaj7": ["Eb4", "G4", "Bb4", "D5"],
  "Abmaj7": ["Ab4", "C5", "Eb5", "G5"],
  "Dbmaj7": ["Db4", "F4", "Ab4", "C5"],
  "F#maj7": ["F#4", "A#4", "C#5", "E#5"],
  "C#maj7": ["C#4", "E#4", "G#4", "B#4"],
  "G#maj7": ["G#4", "B#4", "D#5", "F##5"],
  "Cm7": ["C4", "Eb4", "G4", "Bb4"],
  "Dm7": ["D4", "F4", "A4", "C5"],
  "Em7": ["E4", "G4", "B4", "D5"],
  "Fm7": ["F4", "Ab4", "C5", "Eb5"],
  "Gm7": ["G4", "Bb4", "D5", "F5"],
  "Am7": ["A4", "C5", "E5", "G5"],
  "Bm7": ["B4", "D5", "F#5", "A5"],
  "Bbm7": ["Bb4", "Db5", "F5", "Ab5"],
  "Ebm7": ["Eb4", "Gb4", "Bb4", "Db5"],
  "Abm7": ["Ab4", "Cb5", "Eb5", "Gb5"],
  "Dbm7": ["Db4", "Fb4", "Ab4", "Cb5"],
  "F#m7": ["F#4", "A4", "C#5", "E5"],
  "C#m7": ["C#4", "E4", "G#4", "B4"],
  "G#m7": ["G#4", "B4", "D#5", "F#5"],
  "C7": ["C4", "E4", "G4", "Bb4"],
  "D7": ["D4", "F#4", "A4", "C5"],
  "E7": ["E4", "G#4", "B4", "D5"],
  "F7": ["F4", "A4", "C5", "Eb5"],
  "G7": ["G4", "B4", "D5", "F5"],
  "A7": ["A4", "C#5", "E5", "G5"],
  "B7": ["B4", "D#5", "F#5", "A5"],
  "Bb7": ["Bb4", "D5", "F5", "Ab5"],
  "Eb7": ["Eb4", "G4", "Bb4", "Db5"],
  "Ab7": ["Ab4", "C5", "Eb5", "Gb5"],
  "Db7": ["Db4", "F4", "Ab4", "Cb5"],
  "F#7": ["F#4", "A#4", "C#5", "E5"],
  "C#7": ["C#4", "E#4", "G#4", "B4"],
  "G#7": ["G#4", "B#4", "D#5", "F#5"],
  "Gb7": ["Gb4", "Bb4", "Db5", "Fb5"],
  "D#7": ["D#4", "F##4", "A#4", "C#5"],
  "A#7": ["A#4", "C##5", "F5", "G#5"],
  "Gbm7": ["Gb4", "Bbb4", "Db5", "Fb5"],
  "D#m7": ["D#4", "F#4", "A#4", "C#5"],
  "A#m7": ["A#4", "C#5", "F5", "G#5"],
  "A7sus4": ["A4", "D5", "E5", "G5"],
  "D7sus4": ["D4", "G4", "A4", "C5"],
  "G7sus4": ["G4", "C5", "D5", "F5"],
  "C7sus4": ["C4", "F4", "G4", "Bb4"],
  "E7sus4": ["E4", "A4", "B4", "D5"],
  "F7sus4": ["F4", "Bb4", "C5", "Eb5"],
  "B7sus4": ["B4", "E5", "F#5", "A5"],
  "Bb7sus4": ["Bb4", "Eb5", "F5", "Ab5"],
  "Gsus4": ["G4", "C5", "D5"],
  "Dsus4": ["D4", "G4", "A4"],
  "Asus4": ["A4", "D5", "E5"],
  "Esus4": ["E4", "A4", "B4"],
  "Bsus4": ["B4", "E5", "F#5"],
  "Csus4": ["C4", "F4", "G4"],
  "F#sus4": ["F#4", "B4", "C#5"],
  "G#sus4": ["G#4", "C#5", "D#5"],
  "C9": ["C4", "E4", "G4", "Bb4", "D5"],
  "D9": ["D4", "F#4", "A4", "C5", "E5"],
  "E9": ["E4", "G#4", "B4", "D5", "F#5"],
  "F9": ["F4", "A4", "C5", "Eb5", "G5"],
  "G9": ["G4", "B4", "D5", "F5", "A5"],
  "A9": ["A4", "C#5", "E5", "G5", "B5"],
  "B9": ["B4", "D#5", "F#5", "A5", "C#6"],
  "Ab9": ["Ab4", "C5", "Eb5", "Gb5", "Bb5"],
  "Bb9": ["Bb4", "D5", "F5", "Ab5", "C6"],
  "Eb9": ["Eb4", "G4", "Bb4", "Db5", "F5"],
  "Db9": ["Db4", "F4", "Ab4", "Cb5", "Eb5"],
  "F#9": ["F#4", "A#4", "C#5", "E5", "G#5"],
  "C#9": ["C#4", "E#4", "G#4", "B4", "D#5"],
  "G#9": ["G#4", "B#4", "D#5", "F#5", "A#5"],
  "Gb9": ["Gb4", "Bb4", "Db5", "Fb5", "Ab5"],
  "D#9": ["D#4", "F##4", "A#4", "C#5", "F5"],
  "A#9": ["A#4", "C##5", "F5", "G#5", "C6"],
  "C11": ["C4", "E4", "G4", "Bb4", "D5", "F5"],
  "G11": ["G4", "B4", "D5", "F5", "A5", "C6"],
  "D11": ["D4", "F#4", "A4", "C5", "E5", "G5"],
  "E11": ["E4", "G#4", "B4", "D5", "F#5", "A5"],
  "F11": ["F4", "A4", "C5", "Eb5", "G5", "Bb5"],
  "A11": ["A4", "C#5", "E5", "G5", "B5", "D6"],
  "B11": ["B4", "D#5", "F#5", "A5", "C#6", "E6"],
  "Bb11": ["Bb4", "D5", "F5", "Ab5", "C6", "Eb6"],
  "Eb11": ["Eb4", "G4", "Bb4", "Db5", "F5", "Ab5"],
  "Ab11": ["Ab4", "C5", "Eb5", "Gb5", "Bb5", "Db6"],
  "C13": ["C4", "E4", "G4", "Bb4", "D5", "A5"],
  "G13": ["G4", "B4", "D5", "F5", "A5", "E6"],
  "D13": ["D4", "F#4", "A4", "C5", "E5", "B5"],
  "E13": ["E4", "G#4", "B4", "D5", "F#5", "C#6"],
  "F13": ["F4", "A4", "C5", "Eb5", "G5", "D6"],
  "A13": ["A4", "C#5", "E5", "G5", "B5", "F#6"],
  "B13": ["B4", "D#5", "F#5", "A5", "C#6", "G#6"],
  "Bb13": ["Bb4", "D5", "F5", "A5", "C6", "G6"],
  "Eb13": ["Eb4", "G4", "Bb4", "Db5", "F5", "C6"],
  "Ab13": ["Ab4", "C5", "Eb5", "Gb5", "Bb5", "F6"],
  "Gb13": ["Gb4", "Bb4", "Db5", "Fb5", "Ab5", "Eb6"],
  "Db13": ["Db4", "F4", "Ab4", "Cb5", "Eb5", "Bb5"],
  "F#13": ["F#4", "A#4", "C#5", "E5", "G#5", "D#6"],
  "C#13": ["C#4", "E#4", "G#4", "B4", "D#5", "A#5"],
  "G#13": ["G#4", "B#4", "D#5", "F#5", "A#5", "F6"],
  "D#13": ["D#4", "F##4", "A#4", "C#5", "F5", "C6"],
  "A#13": ["A#4", "C##5", "F5", "G#5", "C6", "G#6"],
  "Bm9": ["B4", "D5", "F#5", "A5", "C#6"],
  "Bm11": ["B4", "D5", "F#5", "A5", "C#6", "E6"],
  "Bm13": ["B4", "D5", "F#5", "A5", "C#6", "E6", "G#6"],
  "Cm9": ["C4", "Eb4", "G4", "Bb4", "D5"],
  "Cm11": ["C4", "Eb4", "G4", "Bb4", "D5", "F5"],
  "Cm13": ["C4", "Eb4", "G4", "Bb4", "D5", "A5"],
  "Am9": ["A4", "C5", "E5", "G5", "B5"],
  "Am11": ["A4", "C5", "E5", "G5", "B5", "D6"],
  "Am13": ["A4", "C5", "E5", "G5", "B5", "D6", "F#6"],
  "Dm9": ["D4", "F4", "A4", "C5", "E5"],
  "Dm11": ["D4", "F4", "A4", "C5", "E5", "G5"],
  "Dm13": ["D4", "F4", "A4", "C5", "E5", "B5"],
  "Em9": ["E4", "G4", "B4", "D5", "F#5"],
  "Em11": ["E4", "G4", "B4", "D5", "F#5", "A5"],
  "Em13": ["E4", "G4", "B4", "D5", "F#5", "C#6"],
  "Fm9": ["F4", "Ab4", "C5", "Eb5", "G5"],
  "Fm11": ["F4", "Ab4", "C5", "Eb5", "G5", "Bb5"],
  "Fm13": ["F4", "Ab4", "C5", "Eb5", "G5", "D6"],
  "Gm9": ["G4", "Bb4", "D5", "F5", "A5"],
  "Gm11": ["G4", "Bb4", "D5", "F5", "A5", "C6"],
  "Gm13": ["G4", "Bb4", "D5", "F5", "A5", "E6"],
  "Bbm9": ["Bb4", "Db5", "F5", "Ab5", "C6"],
  "Bbm11": ["Bb4", "Db5", "F5", "Ab5", "C6", "Eb6"],
  "Bbm13": ["Bb4", "Db5", "F5", "Ab5", "C6", "G6"],
  "Ebm9": ["Eb4", "Gb4", "Bb4", "Db5", "F5"],
  "Ebm11": ["Eb4", "Gb4", "Bb4", "Db5", "F5", "Ab5"],
  "Ebm13": ["Eb4", "Gb4", "Bb4", "Db5", "F5", "C6"],
  "Abm9": ["Ab4", "Cb5", "Eb5", "Gb5", "Bb5"],
  "Abm11": ["Ab4", "Cb5", "Eb5", "Gb5", "Bb5", "Db6"],
  "Abm13": ["Ab4", "Cb5", "Eb5", "Gb5", "Bb5", "F6"],
  "Dbm9": ["Db4", "Fb4", "Ab4", "Cb5", "Eb5"],
  "Dbm11": ["Db4", "Fb4", "Ab4", "Cb5", "Eb5", "Gb5"],
  "Dbm13": ["Db4", "Fb4", "Ab4", "Cb5", "Eb5", "Bb5"],
  "F#m9": ["F#4", "A4", "C#5", "E5", "G#5"],
  "F#m11": ["F#4", "A4", "C#5", "E5", "G#5", "B5"],
  "F#m13": ["F#4", "A4", "C#5", "E5", "G#5", "D#6"],
  "C#m9": ["C#4", "E4", "G#4", "B4", "D#5"],
  "C#m11": ["C#4", "E4", "G#4", "B4", "D#5", "F#5"],
  "C#m13": ["C#4", "E4", "G#4", "B4", "D#5", "A#5"],
  "G#m9": ["G#4", "B4", "D#5", "F#5", "A#5"],
  "G#m11": ["G#4", "B4", "D#5", "F#5", "A#5", "C#6"],
  "G#m13": ["G#4", "B4", "D#5", "F#5", "A#5", "F6"],
  "Gbm9": ["Gb4", "Bbb4", "Db5", "Fb5", "Ab5"],
  "Gbm11": ["Gb4", "Bbb4", "Db5", "Fb5", "Ab5", "Cb6"],
  "Gbm13": ["Gb4", "Bbb4", "Db5", "Fb5", "Ab5", "Eb6"],
  "D#m9": ["D#4", "F#4", "A#4", "C#5", "F5"],
  "D#m11": ["D#4", "F#4", "A#4", "C#5", "F5", "G#5"],
  "D#m13": ["D#4", "F#4", "A#4", "C#5", "F5", "C6"],
  "A#m9": ["A#4", "C#5", "F5", "G#5", "C6"],
  "A#m11": ["A#4", "C#5", "F5", "G#5", "C6", "D#6"],
  "A#m13": ["A#4", "C#5", "F5", "G#5", "C6", "G#6"],
  "Cmaj9": ["C4", "E4", "G4", "B4", "D5"],
  "Dmaj9": ["D4", "F#4", "A4", "C#5", "E5"],
  "Fmaj9": ["F4", "A4", "C5", "E5", "G5"],
  "Gmaj9": ["G4", "B4", "D5", "F#5", "A5"],
  "Amaj9": ["A4", "C#5", "E5", "G#5", "B5"],
  "Bmaj9": ["B4", "D#5", "F#5", "A#5", "C#6"],
  "Bbmaj9": ["Bb4", "D5", "F5", "A5", "C6"],
  "Ebmaj9": ["Eb4", "G4", "Bb4", "D5", "F5"],
  "Abmaj9": ["Ab4", "C5", "Eb5", "G5", "Bb5"],
  "Dbmaj9": ["Db4", "F4", "Ab4", "C5", "Eb5"],
  "F#maj9": ["F#4", "A#4", "C#5", "E#5", "G#5"],
  "C#maj9": ["C#4", "E#4", "G#4", "B#4", "D#5"],
  "G#maj9": ["G#4", "B#4", "D#5", "F##5", "A#5"],
  "Gbmaj9": ["Gb4", "Bb4", "Db5", "F5", "Ab5"],
  "D#maj9": ["D#4", "F##4", "A#4", "C##5", "F5"],
  "A#maj9": ["A#4", "C##5", "F5", "G##5", "C6"],
  "Cmaj11": ["C4", "E4", "G4", "B4", "D5", "F5"],
  "Fmaj11": ["F4", "A4", "C5", "E5", "G5", "Bb5"],
  "Dmaj11": ["D4", "F#4", "A4", "C#5", "E5", "G5"],
  "Emaj11": ["E4", "G#4", "B4", "D#5", "F#5", "A5"],
  "Gmaj11": ["G4", "B4", "D5", "F#5", "A5", "C6"],
  "Amaj11": ["A4", "C#5", "E5", "G#5", "B5", "D6"],
  "Bmaj11": ["B4", "D#5", "F#5", "A#5", "C#6", "E6"],
  "Bbmaj11": ["Bb4", "D5", "F5", "A5", "C6", "Eb6"],
  "Ebmaj11": ["Eb4", "G4", "Bb4", "D5", "F5", "Ab5"],
  "Abmaj11": ["Ab4", "C5", "Eb5", "G5", "Bb5", "Db6"],
  "Dbmaj11": ["Db4", "F4", "Ab4", "C5", "Eb5", "Gb5"],
  "F#maj11": ["F#4", "A#4", "C#5", "E#5", "G#5", "B5"],
  "C#maj11": ["C#4", "E#4", "G#4", "B#4", "D#5", "F#5"],
  "G#maj11": ["G#4", "B#4", "D#5", "F##5", "A#5", "C#6"],
  "Gbmaj11": ["Gb4", "Bb4", "Db5", "F5", "Ab5", "Cb6"],
  "D#maj11": ["D#4", "F##4", "A#4", "C##5", "F5", "G#5"],
  "A#maj11": ["A#4", "C##5", "F5", "G##5", "C6", "D#6"],
  "Cmaj13": ["C4", "E4", "G4", "B4", "D5", "A5"],
  "Fmaj13": ["F4", "A4", "C5", "E5", "G5", "D6"],
  "Dmaj13": ["D4", "F#4", "A4", "C#5", "E5", "B5"],
  "Emaj13": ["E4", "G#4", "B4", "D#5", "F#5", "C#6"],
  "Gmaj13": ["G4", "B4", "D5", "F#5", "A5", "E6"],
  "Amaj13": ["A4", "C#5", "E5", "G#5", "B5", "F#6"],
  "Bmaj13": ["B4", "D#5", "F#5", "A#5", "C#6", "G#6"],
  "Bbmaj13": ["Bb4", "D5", "F5", "A5", "C6", "G6"],
  "Ebmaj13": ["Eb4", "G4", "Bb4", "D5", "F5", "C6"],
  "Abmaj13": ["Ab4", "C5", "Eb5", "G5", "Bb5", "F6"],
  "Dbmaj13": ["Db4", "F4", "Ab4", "C5", "Eb5", "Bb5"],
  "F#maj13": ["F#4", "A#4", "C#5", "E#5", "G#5", "D#6"],
  "C#maj13": ["C#4", "E#4", "G#4", "B#4", "D#5", "A#5"],
  "G#maj13": ["G#4", "B#4", "D#5", "F##5", "A#5", "F6"],
  "Gbmaj13": ["Gb4", "Bb4", "Db5", "F5", "Ab5", "Eb6"],
  "D#maj13": ["D#4", "F##4", "A#4", "C##5", "F5", "C6"],
  "A#maj13": ["A#4", "C##5", "F5", "G##5", "C6", "G#6"],
  "Cdim": ["C4", "Eb4", "Gb4"],
  "Cdim7": ["C4", "Eb4", "Gb4", "Bbb4"],
  "C#dim": ["C#4", "E4", "G4"],
  "C#dim7": ["C#4", "E4", "G4", "Bb4"],
  "Dbdim": ["Db4", "E4", "G4"],
  "Dbdim7": ["Db4", "E4", "G4", "Bbb4"],
  "Ddim": ["D4", "F4", "Ab4"],
  "Ddim7": ["D4", "F4", "Ab4", "Cb5"],
  "D#dim": ["D#4", "F#4", "A4"],
  "D#dim7": ["D#4", "F#4", "A4", "C5"],
  "Ebdim": ["Eb4", "Gb4", "A4"],
  "Ebdim7": ["Eb4", "Gb4", "A4", "Cb5"],
  "Edim": ["E4", "G4", "Bb4"],
  "Edim7": ["E4", "G4", "Bb4", "Db5"],
  "Fdim": ["F4", "Ab4", "B4"],
  "Fdim7": ["F4", "Ab4", "B4", "D4"],
  "F#dim": ["F#4", "A4", "C5"],
  "F#dim7": ["F#4", "A4", "C5", "Eb5"],
  "Gbdim": ["Gb4", "A4", "C5"],
  "Gbdim7": ["Gb4", "A4", "C5", "Ebb5"],
  "Gdim": ["G4", "Bb4", "Db5"],
  "Gdim7": ["G4", "Bb4", "Db5", "E5"],
  "G#dim": ["G#4", "B4", "D5"],
  "G#dim7": ["G#4", "B4", "D5", "F5"],
  "Abdim": ["Ab4", "B4", "D5"],
  "Abdim7": ["Ab4", "B4", "D5", "F5"],
  "Adim": ["A4", "C5", "Eb5"],
  "Adim7": ["A4", "C5", "Eb5", "Gb5"],
  "A#dim": ["A#4", "C#5", "E5"],
  "A#dim7": ["A#4", "C#5", "E5", "G5"],
  "Bbdim": ["Bb4", "Db5", "E5"],
  "Bbdim7": ["Bb4", "Db5", "E5", "G5"],
  "Bdim": ["B4", "D5", "F5"],
  "Bdim7": ["B4", "D5", "F5", "Ab5"],
  "Caug": ["C4", "E4", "G#4"],
  "C#aug": ["C#4", "E#4", "A4"],
  "Dbaug": ["Db4", "F4", "A4"],
  "Daug": ["D4", "F#4", "A#4"],
  "D#aug": ["D#4", "F##4", "B4"],
  "Ebaug": ["Eb4", "G4", "B4"],
  "Eaug": ["E4", "G#4", "B#4"],
  "Faug": ["F4", "A4", "C#5"],
  "F#aug": ["F#4", "A#4", "C##5"],
  "Gbaug": ["Gb4", "Bb4", "D5"],
  "Gaug": ["G4", "B4", "D#5"],
  "G#aug": ["G#4", "B#4", "E5"],
  "Abaug": ["Ab4", "C5", "E5"],
  "Aaug": ["A4", "C#5", "E#5"],
  "A#aug": ["A#4", "C##5", "F#5"],
  "Bbaug": ["Bb4", "D5", "F#5"],
  "Baug": ["B4", "D#5", "F##5"],
  "Csus2": ["C4", "D4", "G4"],
  "C#sus2": ["C#4", "D#4", "G#4"],
  "Dbsus2": ["Db4", "Eb4", "Ab4"],
  "Dsus2": ["D4", "E4", "A4"],
  "D#sus2": ["D#4", "E#4", "A#4"],
  "Ebsus2": ["Eb4", "F4", "Bb4"],
  "Esus2": ["E4", "F#4", "B4"],
  "Fsus2": ["F4", "G4", "C5"],
  "F#sus2": ["F#4", "G#4", "C#5"],
  "Gbsus2": ["Gb4", "Ab4", "Db5"],
  "Gsus2": ["G4", "A4", "D5"],
  "G#sus2": ["G#4", "A#4", "D#5"],
  "Absus2": ["Ab4", "Bb4", "Eb5"],
  "Asus2": ["A4", "B4", "E5"],
  "A#sus2": ["A#4", "B#4", "F5"],
  "Bbsus2": ["Bb4", "C5", "F5"],
  "Bsus2": ["B4", "C#5", "F#5"],
  "Cadd9": ["C4", "E4", "G4", "D5"],
  "Dadd9": ["D4", "F#4", "A4", "E5"],
  "Eadd9": ["E4", "G#4", "B4", "F#5"],
  "Fadd9": ["F4", "A4", "C5", "G5"],
  "Gadd9": ["G4", "B4", "D5", "A5"],
  "Aadd9": ["A4", "C#5", "E5", "B5"],
  "Badd9": ["B4", "D#5", "F#5", "C#6"],
  "Cadd11": ["C4", "E4", "G4", "F5"],
  "Dadd11": ["D4", "F#4", "A4", "G5"],
  "Eadd11": ["E4", "G#4", "B4", "A5"],
  "Fadd11": ["F4", "A4", "C5", "Bb5"],
  "Gadd11": ["G4", "B4", "D5", "C6"],
  "Aadd11": ["A4", "C#5", "E5", "D6"],
  "Badd11": ["B4", "D#5", "F#5", "E6"],
  "C6": ["C4", "E4", "G4", "A4"],
  "D6": ["D4", "F#4", "A4", "B4"],
  "E6": ["E4", "G#4", "B4", "C#5"],
  "F6": ["F4", "A4", "C5", "D5"],
  "G6": ["G4", "B4", "D5", "E5"],
  "A6": ["A4", "C#5", "E5", "F#5"],
  "B6": ["B4", "D#5", "F#5", "G#5"],
  "Cm6": ["C4", "Eb4", "G4", "A4"],
  "Dm6": ["D4", "F4", "A4", "B4"],
  "Em6": ["E4", "G4", "B4", "C#5"],
  "Fm6": ["F4", "Ab4", "C5", "D5"],
  "Gm6": ["G4", "Bb4", "D5", "E5"],
  "Am6": ["A4", "C5", "E5", "F#5"],
  "Bm6": ["B4", "D5", "F#5", "G#5"],
};

class AIChordService {
  private static instance: AIChordService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AIChordService {
    if (!AIChordService.instance) {
      AIChordService.instance = new AIChordService();
    }
    return AIChordService.instance;
  }

  private async initialize() {
    if (!this.isInitialized) {
      try {
        if (typeof puter?.init === 'function') {
          await puter.init();
        }
        this.isInitialized = true;
      } catch (error) {
        console.error('Error initializing Puter:', error);
        throw new Error('Failed to initialize AI service');
      }
    }
  }

  public async generateChordProgression(request: AIChordRequest): Promise<AIChordResponse> {
    await this.initialize();

    const prompt = this.buildPrompt(request);
    
    try {
      const response = await puter.ai.chat(prompt);

      if (!response) {
        throw new Error('No response from AI');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (parseError) {
        console.warn('AI response was not valid JSON, creating basic response');
        parsedResponse = {
          chords: ['C', 'F', 'G', 'Am'],
          progression: ['C', 'F', 'G', 'Am'],
          explanation: 'Generated progression: ' + response
        };
      }
      
      if (
        parsedResponse.progression &&
        parsedResponse.chords &&
        parsedResponse.progression.length === parsedResponse.chords.length &&
        parsedResponse.progression.some((p: string) => /^[IViv]+$/.test(p))
      ) {
        parsedResponse.progression = [...parsedResponse.chords];
      }
      return {
        chords: parsedResponse.chords || [],
        progression: parsedResponse.chords || [],
        explanation: parsedResponse.explanation || 'Generated progression'
      };

    } catch (error) {
      console.error('Error generating chord progression:', error);
      throw new Error('Failed to generate chord progression');
    }
  }

  private buildPrompt(request: AIChordRequest): string {
    const { style, mood, key, length, complexity, description } = request;
    
    return `You are a music theory expert. Generate a ${length}-chord progression in the key of ${key} that is ${complexity} complexity.

Style: ${style}
Mood: ${mood}
${description ? `Additional description: ${description}` : ''}

Requirements:
- Use only chords that work well in ${key}
- Make it ${complexity} complexity (${this.getComplexityDescription(complexity)})
- Ensure the progression flows naturally
- Consider the ${mood} mood and ${style} style

Respond with ONLY a JSON object in this exact format:
{
  "chords": ["chord1", "chord2", "chord3", "chord4"],
  "progression": ["I", "IV", "V", "vi"],
  "explanation": "brief explanation of the progression"
}

Use only standard chord notation (C, Cm, F, G, Am, etc.).`;
  }

  private getComplexityDescription(complexity: string): string {
    switch (complexity) {
      case 'simple':
        return 'basic major and minor chords only';
      case 'medium':
        return 'include some 7th chords and more variety';
      case 'complex':
        return 'include extended chords, modulations, and advanced harmony';
      default:
        return 'balanced mix of chord types';
    }
  }

  private normalizeChordName(chord: string): string {
    if (!chord) return "C";
    let c = chord.trim()
      .replace(/\u266f/g, "#")
      .replace(/\u266d/g, "b")
      .replace(/min7$/i, "m7")
      .replace(/min$/i, "m")
      .replace(/dim7$/i, "dim7")
      .replace(/dim$/i, "dim")
      .replace(/maj7$/i, "maj7")
      .replace(/maj9$/i, "maj9")
      .replace(/maj11$/i, "maj11")
      .replace(/maj13$/i, "maj13")
      .replace(/maj$/i, "maj")
      .replace(/M7$/i, "maj7")
      .replace(/M9$/i, "maj9")
      .replace(/M11$/i, "maj11")
      .replace(/M13$/i, "maj13")
      .replace(/ /g, "")
      .replace(/\u2013/g, "-")
      .replace(/([A-G])b/, (m, p1) => p1 + "b")
      .replace(/([A-G])#/, (m, p1) => p1 + "#");
    c = c.charAt(0).toUpperCase() + c.slice(1);
    c = c.replace(/([A-G][#b]?)(m|maj|dim|aug|sus[24]?|6|7|9|11|13)$/, (m, root, qual) => root + qual);
    if (/^[A-G][#b]?minor$/i.test(c)) c = c[0].toUpperCase() + (c[1] || "") + "m";
    if (/^[A-G][#b]?major$/i.test(c)) c = c[0].toUpperCase() + (c[1] || "");
    return c;
  }

  public convertChordsToPianoKeys(chords: string[]): string[][] {
    return chords.map(chord => {
      const norm = this.normalizeChordName(chord);
      const keys = chordToKeys[norm];
      if (!keys) {
        console.warn(`Unknown chord: ${chord} (normalized: ${norm}), using C major as fallback`);
        return chordToKeys["C"] || ["C4", "E4", "G4"];
      }
      return keys;
    });
  }

  public getAvailableChords(): string[] {
    return Object.keys(chordToKeys);
  }
}

export default AIChordService.getInstance(); 