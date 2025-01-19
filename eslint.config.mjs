import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['public', 'dist', 'node_modules', '**/*.js', '**/*.jsx']
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'prettier'
    )
  ),
  {
    plugins: {
      'jest-dom': jestDomPlugin,
      import: importPlugin
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser
    },

    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            'parent',
            ['sibling', 'index'],
            'object'
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true
        }
      ],

      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],

      'no-param-reassign': [
        'error',
        {
          props: false
        }
      ],

      yoda: 'off',
      'no-shadow': 'off',
      'no-bitwise': 'warn',
      'no-plusplus': 'off',
      'no-redeclare': 'warn',
      'no-unused-vars': 'off',
      'no-nested-ternary': 'off',
      'no-case-declarations': 'off',
      'no-restricted-exports': 'off',
      'no-use-before-define': 'error',
      'react/no-array-index-key': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-var-requires': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$'
        }
      ],

      '@typescript-eslint/no-empty-function': 'warn',

      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          ignoreRestArgs: true
        }
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports'
        }
      ]
    }
  }
]
