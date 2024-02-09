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
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
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
        "semi": ["error", "always"]
    }
};
