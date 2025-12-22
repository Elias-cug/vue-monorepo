# @lee/ui

基于 Vue 3 和 Naive UI 的组件库，提供一套美观实用的 UI 组件。

## 特性

- 🎨 现代化的设计风格
- 📦 开箱即用的高质量组件
- 🔧 支持单独引入和整体注册
- 💪 使用 TypeScript 编写，提供完整的类型定义
- 🌈 基于 Naive UI 构建

## 安装

```bash
pnpm install @lee/ui
```

## 使用方式

### 整体注册

```typescript
import { createApp } from 'vue';
import UI from '@lee/ui';
import App from './App.vue';

const app = createApp(App);
app.use(UI);
app.mount('#app');
```

### 单独引入

```vue
<script setup lang="ts">
import { Card, CodeViewer, Container } from '@lee/ui';
</script>
```

## 组件列表

### 基础组件

- [**LeCard** - 卡片组件](./src/components/card/README.md) - 简洁美观的卡片容器组件
- [**LeCodeViewer** - 代码查看器](./src/components/code-viewer/README.md) - 基于 highlight.js 的代码高亮显示组件
- [**LeContainer** - 容器组件](./src/components/container/README.md) - 带有滚动条的容器组件

## 命名规范

- 组件名称前缀：`Le` / `le-`
- 样式类名前缀：`le-`

## 技术栈

- Vue 3.5.24
- Naive UI
- TypeScript
- SCSS

## 开发

```bash
# 安装依赖
pnpm install -w

# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

MIT

## 组件

### 列表

支持功能

1. 操作封装
2. 单元格点击
3. 单元格右键
4. 行点击
5. 行右键
6. 序号
7. 虚拟滚动
8. 渲染单元格
9. 内置渲染n-switch
