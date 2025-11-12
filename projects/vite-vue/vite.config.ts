import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { baseViteConfig } from '../../vite.config.base';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  ...baseViteConfig,
  // 项目特定配置可以在这里覆盖
  resolve: {
    ...baseViteConfig.resolve,
    alias: {
      ...baseViteConfig.resolve?.alias,
      '@': resolve(__dirname, './src'),
    },
  },
});
