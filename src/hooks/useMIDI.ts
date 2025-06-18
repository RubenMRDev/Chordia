import { useState, useEffect, useRef } from 'react';

interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
  connection: string;
}

interface MIDIState {
  isSupported: boolean;
  devices: MIDIDevice[];
  isConnected: boolean;
  currentDevice: MIDIDevice | null;
  error: string | null;
  isInitializing: boolean;
}

export const useMIDI = () => {
  const [midiState, setMidiState] = useState<MIDIState>({
    isSupported: false,
    devices: [],
    isConnected: false,
    currentDevice: null,
    error: null,
    isInitializing: false,
  });
  
  const midiAccessRef = useRef<WebMidi.MIDIAccess | null>(null);
  const midiInputRef = useRef<WebMidi.MIDIInput | null>(null);

  // Check if Web MIDI API is supported
  useEffect(() => {
    const isSupported = 'requestMIDIAccess' in navigator;
    console.log('MIDI Support Check:', { isSupported, navigator: typeof navigator });
    setMidiState(prev => ({ ...prev, isSupported }));
  }, []);

  // Helper function to get device info
  const getDeviceInfo = (input: WebMidi.MIDIInput): MIDIDevice => {
    return {
      id: input.id,
      name: input.name || `MIDI Device ${input.id}`,
      manufacturer: input.manufacturer || 'Unknown Manufacturer',
      state: input.state,
      connection: input.connection,
    };
  };

  // Helper function to update devices list
  const updateDevicesList = (access: WebMidi.MIDIAccess) => {
    const devices: MIDIDevice[] = [];
    
    console.log('Updating MIDI devices list...');
    console.log('Total inputs:', access.inputs.size);
    
    access.inputs.forEach((input, key) => {
      const device = getDeviceInfo(input);
      devices.push(device);
      console.log('Found MIDI device:', device);
    });

    console.log('Updated devices list:', devices);
    
    setMidiState(prev => ({
      ...prev,
      devices,
      isConnected: devices.length > 0,
      error: null,
    }));
  };

  // Request MIDI access and set up event listeners
  const requestMIDIAccess = async () => {
    console.log('Requesting MIDI access...');
    
    if (!midiState.isSupported) {
      const error = 'Web MIDI API is not supported in this browser';
      console.warn(error);
      setMidiState(prev => ({ ...prev, error }));
      return false;
    }

    setMidiState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      console.log('Calling navigator.requestMIDIAccess()...');
      const access = await navigator.requestMIDIAccess();
      console.log('MIDI access granted:', access);
      
      midiAccessRef.current = access;
      
      // Initial device scan
      updateDevicesList(access);

      // Set up connection/disconnection listeners
      access.onstatechange = (event) => {
        console.log('MIDI state change event:', event);
        
        // Small delay to ensure the port state is updated
        setTimeout(() => {
          if (midiAccessRef.current) {
            updateDevicesList(midiAccessRef.current);
          }
        }, 100);
      };

      setMidiState(prev => ({ ...prev, isInitializing: false }));
      return true;
    } catch (error) {
      console.error('Failed to request MIDI access:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMidiState(prev => ({ 
        ...prev, 
        error: `Failed to access MIDI: ${errorMessage}`,
        isInitializing: false 
      }));
      return false;
    }
  };

  // Refresh MIDI devices (useful for manual refresh)
  const refreshDevices = async () => {
    console.log('Manually refreshing MIDI devices...');
    if (midiAccessRef.current) {
      updateDevicesList(midiAccessRef.current);
    } else {
      await requestMIDIAccess();
    }
  };

  // Connect to a specific MIDI device
  const connectToDevice = (deviceId: string) => {
    console.log('Attempting to connect to device:', deviceId);
    
    if (!midiAccessRef.current) {
      console.error('No MIDI access available');
      return false;
    }

    const input = midiAccessRef.current.inputs.get(deviceId);
    if (!input) {
      console.error('Device not found:', deviceId);
      return false;
    }

    console.log('Found input device:', input);

    // Disconnect previous device if any
    if (midiInputRef.current) {
      console.log('Disconnecting previous device');
      midiInputRef.current.onmidimessage = null;
    }

    midiInputRef.current = input;
    const device = midiState.devices.find(d => d.id === deviceId);
    
    console.log('Connected to device:', device);
    
    setMidiState(prev => ({
      ...prev,
      currentDevice: device || null,
      error: null,
    }));

    return true;
  };

  // Set up MIDI message handler
  const setupMIDIHandler = (onMIDIMessage: (message: WebMidi.MIDIMessageEvent) => void) => {
    if (midiInputRef.current) {
      console.log('Setting up MIDI message handler');
      midiInputRef.current.onmidimessage = (event) => {
        console.log('MIDI message received:', event.data);
        onMIDIMessage(event);
      };
    } else {
      console.warn('No MIDI input available for message handler');
    }
  };

  // Disconnect current device
  const disconnectDevice = () => {
    console.log('Disconnecting MIDI device');
    if (midiInputRef.current) {
      midiInputRef.current.onmidimessage = null;
      midiInputRef.current = null;
    }
    
    setMidiState(prev => ({
      ...prev,
      currentDevice: null,
    }));
  };

  // Convert MIDI note number to note name
  const midiNoteToNoteName = (midiNote: number): string => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return `${noteNames[noteIndex]}${octave}`;
  };

  // Convert note name to MIDI note number
  const noteNameToMIDINote = (noteName: string): number => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = noteName.replace(/\d/g, '');
    const octave = parseInt(noteName.replace(/\D/g, ''));
    const noteIndex = noteNames.indexOf(note);
    return noteIndex + (octave + 1) * 12;
  };

  return {
    ...midiState,
    requestMIDIAccess,
    connectToDevice,
    setupMIDIHandler,
    disconnectDevice,
    refreshDevices,
    midiNoteToNoteName,
    noteNameToMIDINote,
  };
}; 