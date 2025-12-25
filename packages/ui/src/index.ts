/**
 * @lee/ui
 * UI 组件库 - 基于 Naive UI 风格
 */

// 导出组件
export * from './components/code-viewer';
export * from './components/container';
export * from './components/card';
export * from './components/svg-icon';
export * from './components/table';
export * from './components/operate-group';
export * from './components/button';
export * from './components/filter';

// 组件列表（用于整体注册）
import { CodeViewer } from './components/code-viewer';
import { Container } from './components/container';
import { Card } from './components/card';
import { SvgIcon } from './components/svg-icon';
import { Table } from './components/table';
import { OperateGroup } from './components/operate-group';
import { Button } from './components/button';
import { Filter } from './components/filter';
import type { App } from 'vue';

// 导出 SVG 工具函数
export * from './utils/svg-register';

// 导出带 Le 前缀的组件名
export { CodeViewer as LeCodeViewer } from './components/code-viewer';
export { Container as LeContainer } from './components/container';
export { Card as LeCard } from './components/card';
export { SvgIcon as LeSvgIcon } from './components/svg-icon';
export { Table as LeTable } from './components/table';
export { OperateGroup as LeOperateGroup } from './components/operate-group';
export { Button as LeButton } from './components/button';
export { Filter as LeFilter } from './components/filter';

const components = [CodeViewer, Container, Card, SvgIcon, Table, OperateGroup, Button, Filter];

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
