import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintComments from "eslint-plugin-eslint-comments";
// Added plugins for improved linting coverage
import importX from "eslint-plugin-import-x";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import pluginN from "eslint-plugin-n";
import playwright from "eslint-plugin-playwright";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import regexpPlugin from "eslint-plugin-regexp";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

// Precompute type-aware TypeScript configs and attach file scoping to avoid spreading arrays into objects.
const tsTypeAware = compat
    .extends(
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    )
    .map((conf) => ({
        ...conf,
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            // Preserve any languageOptions from the compat output while enforcing project parser.
            ...conf.languageOptions,
            parser: tsParser,
            parserOptions: {
                ...(conf.languageOptions?.parserOptions || {}),
                project: tsconfigPath,
                tsconfigRootDir: __dirname,
            },
        },
    }));

const importResolver = {
    typescript: {
        project: tsconfigPath,
        alwaysTryTypes: true,
    },
    node: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        paths: [path.resolve(__dirname, "src"), path.resolve(__dirname, "tests")],
    },
};

const config = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    ...compat.extends("eslint:recommended"),
    ...next,
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    ...compat.extends("plugin:react/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
            // New general-purpose plugins
            "import-x": importX,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            promise,
            jest,
            "testing-library": testingLibrary,
            "jest-dom": jestDom,
            playwright,
            n: pluginN,
            sonarjs,
            "eslint-comments": eslintComments,
            regexp: regexpPlugin,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                project: tsconfigPath,
            },
        },

        settings: {
            // Support TS path aliases & React version detection for import-x and react plugin
            "import/resolver": importResolver,
            "import-x/resolver": importResolver,
            react: { version: "detect" },
            // Virtual/core modules provided by Next or environment
            "import-x/core-modules": ["server-only"],
        },

        rules: {
            "react/react-in-jsx-scope": "off",

            "react/jsx-filename-extension": [1, {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }],

            semi: ["error", "always"],
            "@typescript-eslint/await-thenable": "error",

            "@typescript-eslint/consistent-type-assertions": ["error", {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "allow-as-parameter",
            }],

            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "always-multiline",
            }],

            "react/prop-types": "off",
            "eol-last": ["error", "always"],
            // Import hygiene
            "import-x/no-unresolved": "error",
            "import-x/no-duplicates": "error",
            "import-x/namespace": "error",
            "import-x/no-named-default": "error",
            "simple-import-sort/imports": "warn",
            "simple-import-sort/exports": "warn",
            "unused-imports/no-unused-imports": "warn",
            // Promise rules
            "promise/catch-or-return": "error",
            "promise/always-return": "warn",
            "promise/no-multiple-resolved": "error",
            "promise/no-nesting": "warn",
            // SonarJS examples (keep light to avoid noise)
            "sonarjs/no-all-duplicated-branches": "warn",
            "sonarjs/no-identical-functions": "warn",
            // eslint-comments hygiene
            "eslint-comments/no-unused-disable": "error",
            // RegExp safety example
            "regexp/no-dupe-characters-character-class": "error",
        },
    },
    // Inject the type-aware recommended configs (scoped to TS files).
    ...tsTypeAware,
    // Additional type-aware rule refinements layered AFTER base TS configs.
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
        },
    },
    // Jest / Testing Library / jest-dom overrides
    {
        files: ["tests/**/*.test.{ts,tsx,js,jsx}", "jest*.{ts,js}", "jest.setup.*.{ts,js}"],
        plugins: {
            jest,
            "testing-library": testingLibrary,
            "jest-dom": jestDom,
        },
        rules: {
            // Pull in recommended rules to avoid drift in rule names across plugin versions
            ...jest.configs.recommended.rules,
            ...jest.configs.style.rules,
            ...testingLibrary.configs.react.rules,
            ...jestDom.configs.recommended.rules,
            // Jest recommended & style (expose minimal targeted rules to reduce duplication)
            "jest/expect-expect": "warn",
            "jest/no-identical-title": "error",
            "jest/no-disabled-tests": "warn",
            // Correct rule name from plugin (old mistaken name was no-debug)
            "testing-library/no-debugging-utils": "warn",
        },
    },
    // Playwright E2E tests
    {
        files: ["e2e/**/*.spec.ts"],
        plugins: {
            playwright,
        },
        rules: {
            "playwright/no-page-pause": "warn",
            "playwright/no-force-option": "warn",
        },
    },
    // Node / server-only code (API routes, services, scripts)
    {
        files: ["src/app/api/**", "src/services/**", "scripts/**"],
        plugins: {
            n: pluginN,
        },
        rules: {
            "n/no-process-exit": "warn",
            "n/no-missing-import": "off", // handled by import-x with TS resolver
        },
    },
    {
        files: ["eslint.config.mjs"],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
        rules: {
            "@typescript-eslint/await-thenable": "off",
        },
    },
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "prisma/**"],
    },
    // Optional stricter unsafe usage warnings (keep lightweight to avoid noise).
    {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
        },
    },
];

export default config;
