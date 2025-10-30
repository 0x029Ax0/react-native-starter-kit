// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const path = require('path');

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
    },
    {
        rules: {
            'indent': ['error', 4]
        }
    },
    {
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
    }
]);
