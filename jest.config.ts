import type { Config } from 'jest';

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    roots: ['<rootDir>/src', '<rootDir>/test'],
    testTimeout: 10000,
    testRegex: '\\.spec(\\.integration)?\\.[tj]s$',
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/test/tsconfig.spec.json',
            },
        ],
    },
    collectCoverageFrom: ['src/**/*.[tj]s'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    testEnvironment: 'node',
    restoreMocks: true,
    clearMocks: true,
    resetMocks: true,
};
