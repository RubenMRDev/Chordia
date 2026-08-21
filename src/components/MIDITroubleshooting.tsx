import React, { useState } from 'react';
import { FaKeyboard, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaBug } from 'react-icons/fa';
import { useT } from '@/i18n';
import {
  testMIDIConnectivity,
  getMIDIDebugInfo,
  type MIDIConnectivityResult,
} from '../utils/midiTest';

/** Un dispositivo tal y como lo entrega `navigator.requestMIDIAccess`. */
interface MIDIDeviceLike {
  id: string;
  name?: string | null;
  manufacturer?: string | null;
  state?: string;
  connection?: string;
}

interface MIDITroubleshootingProps {
  midiSupported: boolean;
  midiDevices: MIDIDeviceLike[];
  midiError: string | null;
  onRefresh: () => void;
}

const MIDITroubleshooting: React.FC<MIDITroubleshootingProps> = ({
  midiSupported,
  midiDevices,
  midiError,
  onRefresh,
}) => {
  const { t } = useT();

  /**
   * El resultado del diagnostico, mas la informacion del navegador, o el
   * mensaje si el propio test ha fallado.
   */
  type TestState =
    | (MIDIConnectivityResult & {
        debugInfo: ReturnType<typeof getMIDIDebugInfo>;
        error?: never;
      })
    | { error: string };

  const [testResults, setTestResults] = useState<TestState | null>(null);
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
        icon: <FaExclamationTriangle className="text-[var(--color-felt-ink)]" />,
        title: "Browser Not Supported",
        description: "Your browser doesn't support Web MIDI API. Try Chrome, Edge, or Opera.",
        action: null,
      });
    } else if (midiDevices.length === 0) {
      steps.push(
        {
          icon: <FaInfoCircle className="text-hand-left" />,
          title: "Check Device Connection",
          description: "Make sure your MIDI device is properly connected via USB.",
          action: null,
        },
        {
          icon: <FaInfoCircle className="text-hand-left" />,
          title: "Install Drivers",
          description: "Install the latest drivers for your MIDI device from the manufacturer's website.",
          action: null,
        },
        {
          icon: <FaInfoCircle className="text-hand-left" />,
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
              className="px-4 py-2 bg-[var(--color-hand-right)] text-black rounded font-bold hover:bg-[var(--color-hand-right-deep)] transition-colors"
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
    <div className="w-full p-4 bg-[var(--color-ground-2)] border border-[var(--color-ink-mid)] rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <FaKeyboard className="text-[var(--color-hand-right)]" />
        <h3 className="text-lg font-bold text-[var(--color-hand-right)]">{t('midi.troubleshootTitle')}</h3>
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-[var(--color-ground-3)] rounded">
            <div className="mt-1">{step.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-white mb-1">{step.title}</div>
              <div className="text-sm text-[var(--color-ink-mid)]">{step.description}</div>
              {step.action && <div className="mt-2">{step.action}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="mt-4 p-3 bg-[var(--color-ground-3)] border border-[var(--color-ink-mid)] rounded">
          <div className="font-bold text-white mb-2">MIDI Test Results:</div>
          <div className="text-sm space-y-1">
            <div>• Browser Support: {'browserSupport' in testResults && testResults.browserSupport ? '✅ Yes' : '❌ No'}</div>
            <div>• Access Granted: {'accessGranted' in testResults && testResults.accessGranted ? '✅ Yes' : '❌ No'}</div>
            <div>• Devices Found: {'devicesFound' in testResults ? testResults.devicesFound : 0}</div>
            {'deviceDetails' in testResults && testResults.deviceDetails.length > 0 && (
              <div className="mt-2">
                <div className="font-medium text-white">Device Details:</div>
                {testResults.deviceDetails.map((device, index) => (
                  <div key={index} className="ml-2 text-xs text-[var(--color-ink-mid)]">
                    • {device.name} ({device.manufacturer}) - {device.state}
                  </div>
                ))}
              </div>
            )}
            {'errors' in testResults && testResults.errors.length > 0 && (
              <div className="mt-2">
                <div className="font-medium text-[var(--color-felt-ink)]">Errors:</div>
                {testResults.errors.map((error, index) => (
                  <div key={index} className="ml-2 text-xs text-[var(--color-felt-ink)]">
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
          <div className="font-bold text-[var(--color-felt-ink)] mb-1">Error Details:</div>
          <div className="text-sm text-[var(--color-felt-ink)]">{midiError}</div>
        </div>
      )}

      <div className="mt-4 p-3 bg-[color-mix(in_srgb,var(--color-hand-left)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-hand-left)_45%,transparent)] rounded">
        <div className="font-bold text-hand-left mb-2">Quick Tips:</div>
        <ul className="text-sm text-hand-left space-y-1">
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