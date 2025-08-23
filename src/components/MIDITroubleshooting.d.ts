import React from 'react';
interface MIDITroubleshootingProps {
    midiSupported: boolean;
    midiDevices: any[];
    midiError: string | null;
    onRefresh: () => void;
}
declare const MIDITroubleshooting: React.FC<MIDITroubleshootingProps>;
export default MIDITroubleshooting;
