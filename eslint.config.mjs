/** @type {import('eslint').Linter.Config} */
export default {
  ignorePatterns: ['node_modules/', '.next/', 'dist/', 'build/', '.turbo/'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
}
