interface MIDIDevice {
    id: string;
    name: string;
    manufacturer: string;
    state: string;
    connection: string;
}
export declare const useMIDI: () => {
    requestMIDIAccess: () => Promise<boolean>;
    connectToDevice: (deviceId: string) => boolean;
    setupMIDIHandler: (onMIDIMessage: (message: WebMidi.MIDIMessageEvent) => void) => void;
    disconnectDevice: () => void;
    refreshDevices: () => Promise<void>;
    midiNoteToNoteName: (midiNote: number) => string;
    noteNameToMIDINote: (noteName: string) => number;
    isSupported: boolean;
    devices: MIDIDevice[];
    isConnected: boolean;
    currentDevice: MIDIDevice | null;
    error: string | null;
    isInitializing: boolean;
};
export {};
