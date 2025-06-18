declare namespace WebMidi {
  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((this: MIDIAccess, ev: Event) => any) | null;
  }

  interface MIDIInputMap {
    size: number;
    get(key: string): MIDIInput | undefined;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIInput>;
    entries(): IterableIterator<[string, MIDIInput]>;
    forEach(callbackfn: (value: MIDIInput, key: string, parent: MIDIInputMap) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<[string, MIDIInput]>;
  }

  interface MIDIOutputMap {
    size: number;
    get(key: string): MIDIOutput | undefined;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<MIDIOutput>;
    entries(): IterableIterator<[string, MIDIOutput]>;
    forEach(callbackfn: (value: MIDIOutput, key: string, parent: MIDIOutputMap) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<[string, MIDIOutput]>;
  }

  interface MIDIPort extends EventTarget {
    id: string;
    manufacturer?: string;
    name?: string;
    type: MIDIPortType;
    version?: string;
    state: MIDIPortDeviceState;
    connection: MIDIPortConnectionState;
    onstatechange: ((this: MIDIPort, ev: Event) => any) | null;
  }

  interface MIDIInput extends MIDIPort {
    onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
  }

  interface MIDIOutput extends MIDIPort {
    send(data: number[] | Uint8Array, timestamp?: number): void;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }

  type MIDIPortType = 'input' | 'output';
  type MIDIPortDeviceState = 'disconnected' | 'connected';
  type MIDIPortConnectionState = 'open' | 'closed' | 'pending';
}

interface Navigator {
  requestMIDIAccess(): Promise<WebMidi.MIDIAccess>;
} 