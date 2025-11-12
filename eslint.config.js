import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.vscode/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/pnpm-lock.yaml',
      '**/.DS_Store',
    ],
  },
  // JavaScript 基础配置
  js.configs.recommended,
  // TypeScript 配置
  ...tseslint.configs.recommended,
  // Vue 配置
  {
    files: ['**/*.vue'],
    plugins: {
      vue,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'warn',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
  // 通用规则
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },
  // Prettier 配置（必须放在最后）
  prettier
);
