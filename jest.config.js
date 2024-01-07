module.exports = {
    preset: 'ts-jest',
    modulePaths: ['<rootDir>/src/'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
};
