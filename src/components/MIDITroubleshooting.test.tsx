import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MIDITroubleshooting from './MIDITroubleshooting';
import * as midiTest from '../utils/midiTest';

jest.mock('../utils/midiTest', () => ({
  testMIDIConnectivity: jest.fn().mockResolvedValue({ browserSupport: true, accessGranted: true, devicesFound: 1, deviceDetails: [], errors: [] }),
  getMIDIDebugInfo: jest.fn().mockReturnValue({ userAgent: 'test', midiSupport: true })
}));

describe('MIDITroubleshooting', () => {
  const onRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with no support', () => {
    render(<MIDITroubleshooting midiSupported={false} midiDevices={[]} midiError={null} onRefresh={jest.fn()} />);
    expect(screen.getByText(/browser not supported/i)).toBeInTheDocument();
  });

  it('renders with no devices and can refresh', () => {
    const onRefresh = jest.fn();
    render(<MIDITroubleshooting midiSupported={true} midiDevices={[]} midiError={null} onRefresh={onRefresh} />);
    expect(screen.getByText(/check device connection/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /refresh midi devices/i }));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('renders with devices found', () => {
    render(<MIDITroubleshooting midiSupported={true} midiDevices={[{ id: 1 }]} midiError={null} onRefresh={jest.fn()} />);
    expect(screen.getByText(/devices found/i)).toBeInTheDocument();
  });

  it('shows error', () => {
    render(<MIDITroubleshooting midiSupported={true} midiDevices={[]} midiError={'Test error'} onRefresh={jest.fn()} />);
    expect(screen.getByText(/error details/i)).toBeInTheDocument();
  });

  it('can run midi test', async () => {
    render(<MIDITroubleshooting midiSupported={true} midiDevices={[]} midiError={null} onRefresh={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /run midi test/i }));
    expect(await screen.findByText(/midi test results/i)).toBeInTheDocument();
  });

  it('muestra mensaje de dispositivos detectados', () => {
    render(
      <MIDITroubleshooting
        midiSupported={true}
        midiDevices={[{ id: 1 }]}
        midiError={null}
        onRefresh={onRefresh}
      />
    );
    expect(screen.getByText(/devices found/i)).toBeInTheDocument();
    expect(screen.getByText(/1 MIDI device/i)).toBeInTheDocument();
  });

  it('ejecuta onRefresh al hacer click en el botón', () => {
    render(
      <MIDITroubleshooting
        midiSupported={true}
        midiDevices={[]}
        midiError={null}
        onRefresh={onRefresh}
      />
    );
    fireEvent.click(screen.getByText(/refresh midi devices/i));
    expect(onRefresh).toHaveBeenCalled();
  });

  it('muestra resultados del test MIDI al hacer click en Run MIDI Test', async () => {
    jest.spyOn(midiTest, 'testMIDIConnectivity').mockResolvedValue({
      browserSupport: true,
      accessGranted: true,
      devicesFound: 2,
      deviceDetails: [{ name: 'dev1', manufacturer: 'manu', state: 'connected' }],
      errors: [],
    });
    jest.spyOn(midiTest, 'getMIDIDebugInfo').mockReturnValue({
      userAgent: '',
      platform: '',
      vendor: '',
      language: '',
      cookieEnabled: true,
      onLine: true,
      midiSupport: true,
      timestamp: ''
    });
    render(
      <MIDITroubleshooting
        midiSupported={true}
        midiDevices={[]}
        midiError={null}
        onRefresh={onRefresh}
      />
    );
    fireEvent.click(screen.getAllByText(/run midi test/i)[1]);
    expect(await screen.findByText(/MIDI Test Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Devices Found: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/dev1/i)).toBeInTheDocument();
  });

  it('muestra el error si midiError está presente', () => {
    render(
      <MIDITroubleshooting
        midiSupported={true}
        midiDevices={[]}
        midiError={'Test error'}
        onRefresh={onRefresh}
      />
    );
    expect(screen.getByText(/error details/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });
}); 