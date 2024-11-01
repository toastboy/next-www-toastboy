// jest.config.ts
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
    ...compilerOptions,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths,
        {
            prefix: '<rootDir>/',
        }),
    "diagnostics": true,
    "incremental": true,
    "jsx": "preserve",
    "sourceMap": true,
};
