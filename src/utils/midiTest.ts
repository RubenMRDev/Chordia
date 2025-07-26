export const testMIDIConnectivity = async () => {
  const results = {
    browserSupport: false,
    accessGranted: false,
    devicesFound: 0,
    deviceDetails: [] as any[],
    errors: [] as string[],
  };

  try {
    results.browserSupport = 'requestMIDIAccess' in navigator;
    console.log('Browser MIDI support:', results.browserSupport);

    if (!results.browserSupport) {
      results.errors.push('Web MIDI API not supported in this browser');
      return results;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      results.accessGranted = true;
      console.log('MIDI access granted:', access);

      access.inputs.forEach((input, _key) => {
        const deviceInfo = {
          id: input.id,
          name: input.name || 'Unknown Device',
          manufacturer: input.manufacturer || 'Unknown Manufacturer',
          state: input.state,
          connection: input.connection,
          type: input.type,
        };
        results.deviceDetails.push(deviceInfo);
        console.log('MIDI device found:', deviceInfo);
      });

      results.devicesFound = results.deviceDetails.length;

      if (results.devicesFound > 0) {
        const firstDevice = access.inputs.values().next().value;
        if (firstDevice) {
          console.log('Testing connection to first device:', firstDevice.name);
          firstDevice.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
            console.log('Test MIDI message received:', event.data);
          };
        }
      }

    } catch (accessError) {
      results.errors.push(`Failed to get MIDI access: ${accessError}`);
      console.error('MIDI access error:', accessError);
    }

  } catch (error) {
    results.errors.push(`Unexpected error: ${error}`);
    console.error('Unexpected MIDI test error:', error);
  }

  return results;
};

export const getMIDIDebugInfo = () => {
  const debugInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    midiSupport: 'requestMIDIAccess' in navigator,
    timestamp: new Date().toISOString(),
  };

  console.log('MIDI Debug Info:', debugInfo);
  return debugInfo;
};

export const logMIDIState = (state: any) => {
  console.group('MIDI State Log');
  console.log('Timestamp:', new Date().toISOString());
  console.log('State:', state);
  console.log('Devices:', state.devices);
  console.log('Current Device:', state.currentDevice);
  console.log('Error:', state.error);
  console.log('Initializing:', state.isInitializing);
  console.groupEnd();
}; 