import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { baseViteConfig } from '../../vite.config.base';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  ...baseViteConfig,
  // 项目特定配置可以在这里覆盖
  server: {
    ...baseViteConfig.server,
    proxy: {
      ...baseViteConfig.server?.proxy,
      '/api/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    ...baseViteConfig.resolve,
    alias: {
      ...baseViteConfig.resolve?.alias,
      '@': resolve(__dirname, './src'),
      '@base': resolve(__dirname, '../../packages-web/base/src'),
      '@ui': resolve(__dirname, '../../packages-web/ui/src'),
      '@theme': resolve(__dirname, '../../packages-web/theme/src'),
    },
  },
});
