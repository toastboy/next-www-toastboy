module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageProvider: 'v8',
    projects: [
        {
            displayName: { name: 'api', color: 'yellow' },
            clearMocks: true,
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
                '^actions/(.*)$': '<rootDir>/src/actions/$1',
                '^api/(.*)$': '<rootDir>/src/app/api/$1',
                '^components/(.*)$': '<rootDir>/src/components/$1',
                '^environment/(.*)$': '<rootDir>/src/environments/$1',
                '^lib/(.*)$': '<rootDir>/src/lib/$1',
                '^services/(.*)$': '<rootDir>/src/services/$1',
                '^tests/(.*)$': '<rootDir>/tests/$1'
            },
            modulePaths: ['<rootDir>/src/'],
            preset: 'ts-jest',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
            testEnvironment: 'node',
            testMatch: ['<rootDir>/**/api/**/*.test.ts'],
            transform: {
                '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
                "_^.+\\.jsx?$": 'babel-jest',
                get "^.+\\.jsx?$"() {
                    return this["_^.+\\.jsx?$"];
                },
                set "^.+\\.jsx?$"(value) {
                    this["_^.+\\.jsx?$"] = value;
                },
                '^.+\\.css$': 'jest-css-modules-transform',
            },
            transformIgnorePatterns: [
                '/node_modules/(?!(?:@stackframe/stack|@stackframe/stack-sc)/)',
            ],
            testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
        },
        {
            displayName: { name: 'services', color: 'magenta' },
            clearMocks: true,
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
                '^actions/(.*)$': '<rootDir>/src/actions/$1',
                '^api/(.*)$': '<rootDir>/src/app/api/$1',
                '^components/(.*)$': '<rootDir>/src/components/$1',
                '^environment/(.*)$': '<rootDir>/src/environments/$1',
                '^lib/(.*)$': '<rootDir>/src/lib/$1',
                '^services/(.*)$': '<rootDir>/src/services/$1',
                '^tests/(.*)$': '<rootDir>/tests/$1'
            },
            modulePaths: ['<rootDir>/src/'],
            preset: 'ts-jest',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.ts'],
            testEnvironment: 'node',
            testMatch: ['<rootDir>/**/services/**/*.test.ts'],
            transform: {
                '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
                "_^.+\\.jsx?$": 'babel-jest',
                get "^.+\\.jsx?$"() {
                    return this["_^.+\\.jsx?$"];
                },
                set "^.+\\.jsx?$"(value) {
                    this["_^.+\\.jsx?$"] = value;
                },
                '^.+\\.css$': 'jest-css-modules-transform',
            },
            transformIgnorePatterns: [
                '/node_modules/(?!(?:@stackframe/stack|@stackframe/stack-sc)/)',
            ],
            testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
        },
        {
            displayName: { name: 'components', color: 'blue' },
            clearMocks: true,
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
                '^actions/(.*)$': '<rootDir>/src/actions/$1',
                '^api/(.*)$': '<rootDir>/src/app/api/$1',
                '^components/(.*)$': '<rootDir>/src/components/$1',
                '^environment/(.*)$': '<rootDir>/src/environments/$1',
                '^lib/(.*)$': '<rootDir>/src/lib/$1',
                '^services/(.*)$': '<rootDir>/src/services/$1',
                '^tests/(.*)$': '<rootDir>/tests/$1'
            },
            modulePaths: ['<rootDir>/src/'],
            preset: 'ts-jest',
            setupFilesAfterEnv: ['<rootDir>/jest.setup.frontend.ts'],
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/tests/components/**/*.test.tsx'],
            transform: {
                '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
                '^.+\\.jsx?$': 'babel-jest',
                '^.+\\.css$': 'jest-css-modules-transform',
            },
            transformIgnorePatterns: [
                '/node_modules/(?!(?:@stackframe/stack|@stackframe/stack-sc)/)',
            ],
            testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
        },
    ],
};