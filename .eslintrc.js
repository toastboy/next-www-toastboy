module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "next",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
    ],
    "overrides": [
        {
            files: ['.eslintrc.js'],
            parserOptions: {
                project: null,
            },
        },
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint",
        "react"
    ],
    "rules": {
        // See https://stackoverflow.com/questions/42640636/react-must-be-in-scope-when-using-jsx-react-react-in-jsx-scope

        // Suppress errors for missing 'import React' in files
        "react/react-in-jsx-scope": "off",
        // Allow jsx syntax in js and ts files (for next.js project)
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx",] }],

        // Insist on semicolons
        "semi": ["error", "always"],

        // Help identify situations where a Promise (or thenable) is not being
        // awaited
        "@typescript-eslint/await-thenable": "error",

        // Make sure I use the "as" assertion rather than <type>
        '@typescript-eslint/consistent-type-assertions': [
            'error',
            {
                assertionStyle: 'as',
                objectLiteralTypeAssertions: 'allow-as-parameter',
            },
        ],

        // Always have dangling commas at the end of multiline lists so
        // insertion, sorting etc. doesn't cause an unnecessary diff
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline"
        }],

        // Since you're using TypeScript, you don't need to use prop types, but
        // ESLint might not be aware of this and is still enforcing the rule.
        'react/prop-types': 'off',
    }
};
