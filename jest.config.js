// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/stories/*'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  setupFiles: ['<rootDir>/config/setupTests.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@redhat-cloud-services)',
    '/node_modules/(?!@patternfly)',
  ],
};
