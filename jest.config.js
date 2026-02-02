module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/client/'],
  testMatch: ['**/server/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/**/*.test.js',
    '!server/index.js'
  ],
  verbose: true,
  testTimeout: 10000
};
