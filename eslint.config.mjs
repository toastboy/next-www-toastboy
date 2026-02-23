// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintComments from "eslint-plugin-eslint-comments";
import importX from "eslint-plugin-import-x";
import jestDom from "eslint-plugin-jest-dom";
import pluginN from "eslint-plugin-n";
import playwright from "eslint-plugin-playwright";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import regexpPlugin from "eslint-plugin-regexp";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
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

// Precompute type-aware TypeScript rule sets and scope them to TS files only.
const tsTypeChecked = typescriptEslint.configs["flat/recommended-type-checked"].slice(1);
const tsStylistic = typescriptEslint.configs["flat/stylistic-type-checked"].slice(1);
const tsTypeAware = [...tsTypeChecked, ...tsStylistic].map((conf) => ({
    ...conf,
    files: ["**/*.ts", "**/*.tsx"],
}));

const tsProjectConfig = {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            project: tsconfigPath,
            tsconfigRootDir: __dirname,
        },
    },
};

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
    ...compat.extends("eslint:recommended"),
    ...compat.extends("plugin:react/recommended"),
    {
        plugins: {
            react,
            // New general-purpose plugins
            "import-x": importX,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            promise,
            "testing-library": testingLibrary,
            "jest-dom": jestDom,
            playwright,
            n: pluginN,
            sonarjs,
            "eslint-comments": eslintComments,
            regexp: regexpPlugin,
        },

        linterOptions: {
            reportUnusedDisableDirectives: true,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            ecmaVersion: "latest",
            sourceType: "module",
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
            "comma-dangle": ["error", {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "always-multiline",
                exports: "always-multiline",
                functions: "always-multiline",
            }],

            "react/prop-types": "off",
            "react/jsx-wrap-multilines": ["error", {
                declaration: "parens-new-line",
                assignment: "parens-new-line",
                return: "parens-new-line",
                arrow: "parens-new-line",
                condition: "ignore",
                logical: "ignore",
                prop: "ignore",
            }],
            "react/jsx-no-leaked-render": ["warn", { validStrategies: ["coerce", "ternary"] }],
            "react/hook-use-state": "warn",
            "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
            "eol-last": ["error", "always"],
            "operator-linebreak": ["error", "after"],
            // Import hygiene
            "import-x/no-unresolved": "error",
            "import-x/no-duplicates": "error",
            "import-x/namespace": "error",
            "import-x/no-named-default": "error",
            "import-x/no-cycle": ["warn", { ignoreExternal: true }],
            "import-x/no-extraneous-dependencies": ["warn", {
                devDependencies: true,
                includeTypes: false,
            }],
            "simple-import-sort/imports": "warn",
            "simple-import-sort/exports": "warn",
            "unused-imports/no-unused-imports": "warn",
            // Promise rules
            "promise/catch-or-return": "error",
            "promise/always-return": "warn",
            "promise/no-multiple-resolved": "error",
            "promise/no-nesting": "warn",
            "promise/no-return-in-finally": "warn",
            // SonarJS examples (keep light to avoid noise)
            "sonarjs/no-all-duplicated-branches": "warn",
            "sonarjs/no-identical-functions": "warn",
            // eslint-comments hygiene
            "eslint-comments/no-unused-disable": "error",
            // RegExp safety example
            "regexp/no-dupe-characters-character-class": "error",
        },
    },
    tsProjectConfig,
    // Inject the type-aware recommended configs (scoped to TS files).
    ...tsTypeAware,
    // Additional type-aware rule refinements layered AFTER base TS configs.
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/consistent-type-assertions": ["error", {
                assertionStyle: "as",
                objectLiteralTypeAssertions: "allow-as-parameter",
            }],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
            "@typescript-eslint/non-nullable-type-assertion-style": "warn",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "@typescript-eslint/no-unsafe-enum-comparison": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-regexp-exec": "warn",
            "@typescript-eslint/restrict-template-expressions": ["warn", {
                allowAny: false,
                allowNumber: true,
                allowBoolean: false,
                allowNullish: false,
                allowRegExp: true,
            }],
            "@typescript-eslint/unbound-method": "off",
        },
    },
    // Testing Library / jest-dom overrides (Component tests only)
    {
        files: ["tests/components/**/*.test.{ts,tsx,js,jsx}"],
        plugins: {
            "testing-library": testingLibrary,
            "jest-dom": jestDom,
        },
        rules: {
            ...testingLibrary.configs.react.rules,
            ...jestDom.configs.recommended.rules,
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
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "prisma/**",
            ".storybook/**",
            "src/stories/**",
            "storybook-static/**",
        ],
    },
    // Optional stricter unsafe usage warnings (keep lightweight to avoid noise).
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
        },
    },
    {
        files: ["src/tests/**/*.test.ts", "src/tests/**/*.test.tsx"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
        },
    },
    ...storybook.configs["flat/recommended"],
];

export default config;
