/**
 * @lee/ui
 * UI 组件库 - 基于 Naive UI 风格
 */

// 导出组件
export * from './components/code-viewer';
export * from './components/container';
export * from './components/card';
export * from './components/svg-icon';

// 组件列表（用于整体注册）
import { CodeViewer } from './components/code-viewer';
import { Container } from './components/container';
import { Card } from './components/card';
import { SvgIcon } from './components/svg-icon';
import type { App } from 'vue';

// 导出 SVG 工具函数
export * from './utils/svg-register';

const components = [CodeViewer, Container, Card, SvgIcon];

/**
 * 整体注册所有组件
 */
export function install(app: App) {
  components.forEach(component => {
    app.component(component.name || 'UnknownComponent', component);
  });
}

export default {
  install,
};
