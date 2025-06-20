jest.mock('tone');
import 'jest';
import * as Tone from 'tone';
import pianoService from './pianoService';

describe('pianoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle playNote without initialization', () => {
    expect(() => pianoService.playNote('C4')).not.toThrow();
  });

  it('should handle stopNote without initialization', () => {
    expect(() => pianoService.stopNote('C4')).not.toThrow();
  });

  it('should handle playChord without initialization', () => {
    expect(() => pianoService.playChord(['C4', 'E4'])).not.toThrow();
  });

  it('should handle stopChord without initialization', () => {
    expect(() => pianoService.stopChord(['C4', 'E4'])).not.toThrow();
  });

  it('should handle setVolume without initialization', () => {
    expect(() => pianoService.setVolume(-5)).not.toThrow();
  });

  it('should handle setInstrument without initialization', () => {
    expect(() => pianoService.setInstrument('acoustic_grand_piano')).not.toThrow();
  });
}); 