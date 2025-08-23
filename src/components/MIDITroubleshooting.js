import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaKeyboard, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaBug } from 'react-icons/fa';
import { testMIDIConnectivity, getMIDIDebugInfo } from '../utils/midiTest';
const MIDITroubleshooting = ({ midiSupported, midiDevices, midiError, onRefresh, }) => {
    const [testResults, setTestResults] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const runMIDITest = async () => {
        setIsTesting(true);
        try {
            const results = await testMIDIConnectivity();
            const debugInfo = getMIDIDebugInfo();
            setTestResults({ ...results, debugInfo });
        }
        catch (error) {
            setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
        finally {
            setIsTesting(false);
        }
    };
    const getTroubleshootingSteps = () => {
        const steps = [];
        if (!midiSupported) {
            steps.push({
                icon: _jsx(FaExclamationTriangle, { className: "text-red-500" }),
                title: "Browser Not Supported",
                description: "Your browser doesn't support Web MIDI API. Try Chrome, Edge, or Opera.",
                action: null,
            });
        }
        else if (midiDevices.length === 0) {
            steps.push({
                icon: _jsx(FaInfoCircle, { className: "text-blue-500" }),
                title: "Check Device Connection",
                description: "Make sure your MIDI device is properly connected via USB.",
                action: null,
            }, {
                icon: _jsx(FaInfoCircle, { className: "text-blue-500" }),
                title: "Install Drivers",
                description: "Install the latest drivers for your MIDI device from the manufacturer's website.",
                action: null,
            }, {
                icon: _jsx(FaInfoCircle, { className: "text-blue-500" }),
                title: "Check Device Manager",
                description: "Verify your device appears in Windows Device Manager or macOS System Information.",
                action: null,
            }, {
                icon: _jsx(FaCheckCircle, { className: "text-green-500" }),
                title: "Refresh Devices",
                description: "Click the button below to refresh the MIDI device list.",
                action: (_jsx("button", { onClick: onRefresh, className: "px-4 py-2 bg-[#00E676] text-black rounded font-bold hover:bg-[#00D666] transition-colors", children: "Refresh MIDI Devices" })),
            }, {
                icon: _jsx(FaBug, { className: "text-yellow-500" }),
                title: "Run MIDI Test",
                description: "Run a comprehensive test to diagnose MIDI connectivity issues.",
                action: (_jsx("button", { onClick: runMIDITest, disabled: isTesting, className: "px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-700 transition-colors disabled:opacity-50", children: isTesting ? 'Testing...' : 'Run MIDI Test' })),
            });
        }
        else {
            steps.push({
                icon: _jsx(FaCheckCircle, { className: "text-green-500" }),
                title: "Devices Found",
                description: `${midiDevices.length} MIDI device(s) detected. You should be able to use Play Yourself mode.`,
                action: null,
            });
        }
        return steps;
    };
    const steps = getTroubleshootingSteps();
    return (_jsxs("div", { className: "w-full p-4 bg-[#0f1624] border border-[#a0aec0] rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(FaKeyboard, { className: "text-[#00E676]" }), _jsx("h3", { className: "text-lg font-bold text-[#00E676]", children: "MIDI Troubleshooting" })] }), _jsx("div", { className: "space-y-3", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-[#1a2332] rounded", children: [_jsx("div", { className: "mt-1", children: step.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-white mb-1", children: step.title }), _jsx("div", { className: "text-sm text-[#a0aec0]", children: step.description }), step.action && _jsx("div", { className: "mt-2", children: step.action })] })] }, index))) }), testResults && (_jsxs("div", { className: "mt-4 p-3 bg-[#1a2332] border border-[#a0aec0] rounded", children: [_jsx("div", { className: "font-bold text-white mb-2", children: "MIDI Test Results:" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: ["\u2022 Browser Support: ", testResults.browserSupport ? '✅ Yes' : '❌ No'] }), _jsxs("div", { children: ["\u2022 Access Granted: ", testResults.accessGranted ? '✅ Yes' : '❌ No'] }), _jsxs("div", { children: ["\u2022 Devices Found: ", testResults.devicesFound] }), testResults.deviceDetails && testResults.deviceDetails.length > 0 && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "font-medium text-white", children: "Device Details:" }), testResults.deviceDetails.map((device, index) => (_jsxs("div", { className: "ml-2 text-xs text-[#a0aec0]", children: ["\u2022 ", device.name, " (", device.manufacturer, ") - ", device.state] }, index)))] })), testResults.errors && testResults.errors.length > 0 && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "font-medium text-red-300", children: "Errors:" }), testResults.errors.map((error, index) => (_jsxs("div", { className: "ml-2 text-xs text-red-300", children: ["\u2022 ", error] }, index)))] }))] })] })), midiError && (_jsxs("div", { className: "mt-4 p-3 bg-red-900/20 border border-red-500 rounded", children: [_jsx("div", { className: "font-bold text-red-300 mb-1", children: "Error Details:" }), _jsx("div", { className: "text-sm text-red-300", children: midiError })] })), _jsxs("div", { className: "mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded", children: [_jsx("div", { className: "font-bold text-blue-300 mb-2", children: "Quick Tips:" }), _jsxs("ul", { className: "text-sm text-blue-300 space-y-1", children: [_jsx("li", { children: "\u2022 Try disconnecting and reconnecting your MIDI device" }), _jsx("li", { children: "\u2022 Restart your browser after connecting the device" }), _jsx("li", { children: "\u2022 Make sure no other application is using the MIDI device" }), _jsx("li", { children: "\u2022 Check if your device requires specific software to be running" }), _jsx("li", { children: "\u2022 Open browser console (F12) to see detailed MIDI logs" })] })] })] }));
};
export default MIDITroubleshooting;
