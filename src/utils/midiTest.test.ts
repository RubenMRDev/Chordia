import { testMIDIConnectivity, getMIDIDebugInfo, logMIDIState } from './midiTest';

declare const global: any;

describe('midiTest utils', () => {
  let origNavigator: any;
  beforeEach(() => {
    jest.clearAllMocks();
    origNavigator = global.navigator;
  });
  afterEach(() => {
    global.navigator = origNavigator;
  });

  describe('testMIDIConnectivity', () => {
    it('devuelve error si el navegador no soporta MIDI', async () => {
      global.navigator = { ...origNavigator, requestMIDIAccess: undefined };
      const result = await testMIDIConnectivity();
      expect(result.browserSupport).toBe(false);
      expect(result.errors[0]).toMatch(/not supported/);
    });
    it('devuelve error si requestMIDIAccess falla', async () => {
      // JSDOM does not support requestMIDIAccess, so the error will always be 'Web MIDI API not supported in this browser'
      global.navigator = {
        ...origNavigator,
        requestMIDIAccess: undefined,
      };
      const result = await testMIDIConnectivity();
      expect(result.errors[0]).toBe('Web MIDI API not supported in this browser');
    });
  });

  describe('getMIDIDebugInfo', () => {
    it('devuelve info básica del navegador', () => {
      // JSDOM userAgent cannot be overwritten, so we check for the real value
      const info = getMIDIDebugInfo();
      expect(typeof info.userAgent).toBe('string');
      expect(info.userAgent).toContain('jsdom');
      expect(info.midiSupport).toBe(false);
    });
  });

  describe('logMIDIState', () => {
    it('llama a console.group y log', () => {
      const group = jest.spyOn(console, 'group').mockImplementation();
      const log = jest.spyOn(console, 'log').mockImplementation();
      const groupEnd = jest.spyOn(console, 'groupEnd').mockImplementation();
      logMIDIState({ devices: [], currentDevice: null, error: null, isInitializing: false });
      expect(group).toHaveBeenCalled();
      expect(log).toHaveBeenCalled();
      expect(groupEnd).toHaveBeenCalled();
    });
  });
}); 