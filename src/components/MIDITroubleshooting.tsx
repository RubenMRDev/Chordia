import React, { useState } from 'react';
import { FaKeyboard, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaBug } from 'react-icons/fa';
import { testMIDIConnectivity, getMIDIDebugInfo } from '../utils/midiTest';

interface MIDITroubleshootingProps {
  midiSupported: boolean;
  midiDevices: any[];
  midiError: string | null;
  onRefresh: () => void;
}

const MIDITroubleshooting: React.FC<MIDITroubleshootingProps> = ({
  midiSupported,
  midiDevices,
  midiError,
  onRefresh,
}) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runMIDITest = async () => {
    setIsTesting(true);
    try {
      const results = await testMIDIConnectivity();
      const debugInfo = getMIDIDebugInfo();
      setTestResults({ ...results, debugInfo });
    } catch (error) {
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsTesting(false);
    }
  };

  const getTroubleshootingSteps = () => {
    const steps = [];

    if (!midiSupported) {
      steps.push({
        icon: <FaExclamationTriangle className="text-red-500" />,
        title: "Browser Not Supported",
        description: "Your browser doesn't support Web MIDI API. Try Chrome, Edge, or Opera.",
        action: null,
      });
    } else if (midiDevices.length === 0) {
      steps.push(
        {
          icon: <FaInfoCircle className="text-blue-500" />,
          title: "Check Device Connection",
          description: "Make sure your MIDI device is properly connected via USB.",
          action: null,
        },
        {
          icon: <FaInfoCircle className="text-blue-500" />,
          title: "Install Drivers",
          description: "Install the latest drivers for your MIDI device from the manufacturer's website.",
          action: null,
        },
        {
          icon: <FaInfoCircle className="text-blue-500" />,
          title: "Check Device Manager",
          description: "Verify your device appears in Windows Device Manager or macOS System Information.",
          action: null,
        },
        {
          icon: <FaCheckCircle className="text-green-500" />,
          title: "Refresh Devices",
          description: "Click the button below to refresh the MIDI device list.",
          action: (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-[#00E676] text-black rounded font-bold hover:bg-[#00D666] transition-colors"
            >
              Refresh MIDI Devices
            </button>
          ),
        },
        {
          icon: <FaBug className="text-yellow-500" />,
          title: "Run MIDI Test",
          description: "Run a comprehensive test to diagnose MIDI connectivity issues.",
          action: (
            <button
              onClick={runMIDITest}
              disabled={isTesting}
              className="px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Run MIDI Test'}
            </button>
          ),
        }
      );
    } else {
      steps.push({
        icon: <FaCheckCircle className="text-green-500" />,
        title: "Devices Found",
        description: `${midiDevices.length} MIDI device(s) detected. You should be able to use Play Yourself mode.`,
        action: null,
      });
    }

    return steps;
  };

  const steps = getTroubleshootingSteps();

  return (
    <div className="w-full p-4 bg-[#0f1624] border border-[#a0aec0] rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <FaKeyboard className="text-[#00E676]" />
        <h3 className="text-lg font-bold text-[#00E676]">MIDI Troubleshooting</h3>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-[#1a2332] rounded">
            <div className="mt-1">{step.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-white mb-1">{step.title}</div>
              <div className="text-sm text-[#a0aec0]">{step.description}</div>
              {step.action && <div className="mt-2">{step.action}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="mt-4 p-3 bg-[#1a2332] border border-[#a0aec0] rounded">
          <div className="font-bold text-white mb-2">MIDI Test Results:</div>
          <div className="text-sm space-y-1">
            <div>• Browser Support: {testResults.browserSupport ? '✅ Yes' : '❌ No'}</div>
            <div>• Access Granted: {testResults.accessGranted ? '✅ Yes' : '❌ No'}</div>
            <div>• Devices Found: {testResults.devicesFound}</div>
            {testResults.deviceDetails && testResults.deviceDetails.length > 0 && (
              <div className="mt-2">
                <div className="font-medium text-white">Device Details:</div>
                {testResults.deviceDetails.map((device: any, index: number) => (
                  <div key={index} className="ml-2 text-xs text-[#a0aec0]">
                    • {device.name} ({device.manufacturer}) - {device.state}
                  </div>
                ))}
              </div>
            )}
            {testResults.errors && testResults.errors.length > 0 && (
              <div className="mt-2">
                <div className="font-medium text-red-300">Errors:</div>
                {testResults.errors.map((error: string, index: number) => (
                  <div key={index} className="ml-2 text-xs text-red-300">
                    • {error}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {midiError && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500 rounded">
          <div className="font-bold text-red-300 mb-1">Error Details:</div>
          <div className="text-sm text-red-300">{midiError}</div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded">
        <div className="font-bold text-blue-300 mb-2">Quick Tips:</div>
        <ul className="text-sm text-blue-300 space-y-1">
          <li>• Try disconnecting and reconnecting your MIDI device</li>
          <li>• Restart your browser after connecting the device</li>
          <li>• Make sure no other application is using the MIDI device</li>
          <li>• Check if your device requires specific software to be running</li>
          <li>• Open browser console (F12) to see detailed MIDI logs</li>
        </ul>
      </div>
    </div>
  );
};

export default MIDITroubleshooting; 