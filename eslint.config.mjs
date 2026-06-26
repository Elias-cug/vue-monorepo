import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'coverage/**',
      'apps-web/*/dist/**',
      'apps-web/*/node_modules/**',
      'apps-web/le-guide/docs/.vitepress/cache/**',
      'apps-web/le-guide/docs/.vitepress/dist/**',
      'packages-web/*/dist/**',
      'packages-web/*/node_modules/**',
      'pnpm-lock.yaml',
      '*.min.js',
      '.eslintrc.cjs',
      '.stylelintrc.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'no-undef': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  eslintConfigPrettier
);
