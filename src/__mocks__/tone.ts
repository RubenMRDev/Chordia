export const Sampler = jest.fn().mockImplementation(() => ({
  toDestination: jest.fn().mockReturnThis(),
  triggerAttack: jest.fn(),
  triggerRelease: jest.fn(),
  releaseAll: jest.fn(),
  dispose: jest.fn(),
  triggerAttackRelease: jest.fn(),
  volume: 0,
}));

export const Volume = jest.fn().mockImplementation(() => ({
  toDestination: jest.fn().mockReturnThis(),
  volume: 0,
  dispose: jest.fn(),
}));

export const Synth = jest.fn().mockImplementation(() => ({
  toDestination: jest.fn().mockReturnThis(),
  triggerAttack: jest.fn(),
  triggerRelease: jest.fn(),
  dispose: jest.fn(),
}));

export const Time = jest.fn(() => ({
  toMilliseconds: () => 100,
}));

export const loaded = jest.fn(() => Promise.resolve());
export const context = { resume: jest.fn() }; 