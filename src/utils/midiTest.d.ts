export declare const testMIDIConnectivity: () => Promise<{
    browserSupport: boolean;
    accessGranted: boolean;
    devicesFound: number;
    deviceDetails: any[];
    errors: string[];
}>;
export declare const getMIDIDebugInfo: () => {
    userAgent: string;
    platform: string;
    vendor: string;
    language: string;
    cookieEnabled: boolean;
    onLine: boolean;
    midiSupport: boolean;
    timestamp: string;
};
export declare const logMIDIState: (state: any) => void;
