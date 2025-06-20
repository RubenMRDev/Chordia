import { renderHook, act } from '@testing-library/react';
import { useMIDI } from './useMIDI';

describe('useMIDI', () => {
  let originalNavigator: any;

  beforeEach(() => {
    originalNavigator = global.navigator;
    global.navigator = { ...originalNavigator };
  });

  afterEach(() => {
    global.navigator = originalNavigator;
    jest.clearAllMocks();
  });

  it('should handle no MIDI support', () => {
    // Simula un navegador sin requestMIDIAccess
    global.navigator = { ...originalNavigator };
    const { result } = renderHook(() => useMIDI());
    expect(result.current.isSupported).toBe(false);
  });

  it('should convert midi note to note name and back', () => {
    const { result } = renderHook(() => useMIDI());
    expect(result.current.midiNoteToNoteName(60)).toBe('C4');
    expect(result.current.noteNameToMIDINote('C4')).toBe(60);
  });

  it('should warn if no input for handler', () => {
    const { result } = renderHook(() => useMIDI());
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    result.current.setupMIDIHandler(jest.fn());
    expect(warn).toHaveBeenCalledWith('No MIDI input available for message handler');
    warn.mockRestore();
  });
}); 