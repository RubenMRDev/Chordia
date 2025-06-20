// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: [
    '**/firebase/__tests__/**/*.test.{ts,tsx}',
    '!**/components/**/*.test.{ts,tsx}'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  resetMocks: false,
  restoreMocks: false,
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/firebase/**/*.{ts,tsx}',
    '!src/firebase/**/*.d.ts',
    '!src/firebase/__tests__/**'
  ],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
