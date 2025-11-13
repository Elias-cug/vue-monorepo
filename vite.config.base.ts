import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const baseViteConfig = {
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    Unocss(),
    // 如果需要支持旧浏览器（不支持 ?. 和 ??），取消下面的注释
    legacy({
      targets: ['defaults', 'not IE 11'],
      // 转换现代语法，包括可选链和空值合并
      modernPolyfills: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@utils': resolve(__dirname, './packages/utils/index.ts'),
      '@base': resolve(__dirname, './packages/base/index.ts'),
    },
  },
  build: {
    // 构建目标：支持可选链(?. )和空值合并(??)的浏览器版本
    // Chrome 80+, Firefox 74+, Safari 13.1+, Edge 80+ 原生支持这些语法
    // 如果需要支持更旧的浏览器，可以降低 target 或使用 @vitejs/plugin-legacy
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // esbuild 配置：确保正确转换现代语法
    esbuild: {
      target: 'es2020', // ES2020 原生支持 ?. 和 ??
      // 如果需要支持更旧的浏览器（如 IE11），可以设置为 'es2015' 或 'es5'
      // 但建议使用 @vitejs/plugin-legacy 来处理旧浏览器支持
    },
  },
};

export default defineConfig(baseViteConfig);
