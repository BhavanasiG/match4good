import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['src/app/ws/*.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off', // may change to warn in the future
      'no-var': 'error',
      '@typescript-eslint/consistent-type-imports': 'off', // may change to warn in the future
      'react/jsx-pascal-case': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        {
          selector: 'variable',
          // types: ["array", "boolean", "number", "string"],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          modifiers: ['exported'],
          format: ['StrictPascalCase'],
        },
        {
          // selector: "variable",
          // types: ["function"],
          // selector: 'function',
          // format: ['camelCase'],
          selector: 'function',
          // modifiers: ['local'],
          format: ['camelCase'],
        },
        { selector: 'typeLike', format: ['StrictPascalCase'] },
        // {
        //   selector: "function",
        //   format: ["strictCamelCase", "StrictPascalCase"],
        // },
        { selector: 'import', format: null },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: false,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-example': 'warn',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-description-complete-sentence': 'warn',
      'jsdoc/no-empty-description': 'off',
      'jsdoc/newline-after-description': 'off',
    },
    plugins: { react: react, 'react-hooks': reactHooks },
  },
  {
    files: ['**/*.page.ts', '**/*.page.tsx'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-example': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-tag-names': 'off',
      'jsdoc/check-types': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/require-description-complete-sentence': 'off',
    },
  },

  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier',
    'plugin:react-hooks/recommended',
    'plugin:jsdoc/recommended',
  ),

  globalIgnores([
    'src/hooks/',
    'docs/**',
    'src/components/ui/',
    '**/page.tsx',
    'src/middleware.ts',
    'src/lib/ws/',
  ]),
]);
