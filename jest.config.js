const coveragePathIgnorePatterns = [
    '/node_modules/',
    '/prisma/generated/',
    '/prisma/zod/',
    '/src/tests/',
];
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'];
const moduleNameMapper = {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^prisma/(.*)$': '<rootDir>/prisma/$1',
    '^server-only$': '<rootDir>/src/tests/__mocks__/server-only.ts',
};
const modulePaths = ['<rootDir>/src/'];
const testPathIgnorePatterns = ['/node_modules/', '/e2e/'];
const transform = {
    '^.+\\.(t|j|mj)sx?$': ['@swc/jest'],
    '^.+\\.css$': 'jest-css-modules-transform',
};
const transformIgnorePatterns = [
    "node_modules/(?!(nanostores|better-auth|@better-auth|better-call|rou3|uncrypto|jose|@noble|msw|until-async|d3|d3-[\\w-]+|internmap|delaunator|robust-predicates)/)",
];
const watchPathIgnorePatterns = [
    "<rootDir>/.git/",
    "<rootDir>/.github/",
    "<rootDir>/.next/",
    "<rootDir>/.vscode/",
    "<rootDir>/build/",
    "<rootDir>/coverage/",
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "<rootDir>/out/",
];

module.exports = {
    automock: false,
    collectCoverage: process.env.COVERAGE === 'true' || process.env.CI === 'true',
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    maxWorkers: process.env.JEST_MAX_WORKERS || '50%',
    projects: [
        {
            displayName: { name: 'api', color: 'yellow' },
            clearMocks: true,
            collectCoverageFrom: [
                '<rootDir>/src/app/api/**/*.{ts,tsx}',
                '!<rootDir>/src/**/*.d.ts',
                '!<rootDir>/**/*.stories.tsx',
            ],
            coveragePathIgnorePatterns,
            moduleFileExtensions,
            moduleNameMapper,
            modulePaths,
            setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
            testEnvironment: 'node',
            testMatch: ['<rootDir>/src/tests/api/**/*.test.ts'],
            testPathIgnorePatterns,
            transform,
            transformIgnorePatterns,
            watchPathIgnorePatterns: [
                ...watchPathIgnorePatterns,
                "<rootDir>/src/tests/components/",
                "<rootDir>/src/tests/services/",
            ],
        },
        {
            displayName: { name: 'services', color: 'magenta' },
            clearMocks: true,
            collectCoverageFrom: [
                '<rootDir>/src/services/**/*.{ts,tsx}',
                '!<rootDir>/src/**/*.d.ts',
                '!<rootDir>/**/*.stories.tsx',
            ],
            coveragePathIgnorePatterns,
            moduleFileExtensions,
            moduleNameMapper,
            modulePaths,
            setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
            testEnvironment: 'node',
            testMatch: ['<rootDir>/src/tests/services/**/*.test.ts'],
            testPathIgnorePatterns,
            transform,
            transformIgnorePatterns,
            watchPathIgnorePatterns: [
                ...watchPathIgnorePatterns,
                "<rootDir>/src/tests/api/",
                "<rootDir>/src/tests/components/",
            ],
        },
        {
            displayName: { name: 'components', color: 'blue' },
            clearMocks: true,
            collectCoverageFrom: [
                '<rootDir>/src/components/**/*.{ts,tsx}',
                '!<rootDir>/src/**/*.d.ts',
                '!<rootDir>/**/*.stories.tsx',
            ],
            coveragePathIgnorePatterns,
            moduleFileExtensions,
            moduleNameMapper,
            modulePaths,
            setupFilesAfterEnv: ['<rootDir>/jest.setup.frontend.ts'],
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/src/tests/components/**/*.test.tsx'],
            testPathIgnorePatterns,
            transform,
            transformIgnorePatterns,
            watchPathIgnorePatterns: [
                ...watchPathIgnorePatterns,
                "<rootDir>/src/tests/api/",
                "<rootDir>/src/tests/services/",
            ],
        },
    ],
};
