/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'virtual:svg-icons-register' {
  // 该模块由 vite-plugin-svg-icons 自动生成
  // 不需要任何导出，只是用于注册 SVG sprites
}
