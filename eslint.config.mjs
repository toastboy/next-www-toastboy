import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const config = [...compat.extends(
    "eslint:recommended",
    "next",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        react,
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
            project: "./tsconfig.json",
        },
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
];

export default config;
