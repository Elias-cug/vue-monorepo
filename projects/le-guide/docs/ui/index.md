# UI 组件

Vue Monorepo 提供了一套基于 Vue 3 的企业级 UI 组件库，所有组件都完全支持主题切换和响应式布局。

## 组件特性

- 🎨 **主题适配** - 完全响应主题系统变化
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🚀 **按需加载** - 支持 Tree Shaking
- 📝 **TypeScript** - 完整的类型定义
- 🧩 **组合式 API** - 基于 Vue 3 Composition API
- ♿ **无障碍** - 遵循 WAI-ARIA 标准

## 已实现组件

### 基础组件

- [LeCard 卡片](/ui/components/card) - 通用内容容器
- [LeContainer 容器](/ui/components/container) - 布局容器组件
- [LeSvgIcon 图标](/ui/components/svg-icon) - SVG 图标系统

更多组件正在开发中...

## 快速使用

### 安装

```bash
# 使用项目内的 UI 包
pnpm workspace @lee/ui
```

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue';
import LeUI from '@lee/ui';
import '@lee/ui/style';

const app = createApp(App);
app.use(LeUI);
```

### 按需引入

```vue
<template>
  <LeCard title="卡片标题">
    <p>卡片内容</p>
  </LeCard>
</template>

<script setup lang="ts">
import { LeCard } from '@lee/ui';
</script>
```

## 主题定制

所有组件都支持通过 CSS 变量进行主题定制：

```css
:root {
  /* 自定义主题色 */
  --le-primary: #1677ff;
  --le-primary-1: #e6f4ff;
  --le-primary-7: #0958d9;
}
```

## 设计理念

1. **一致性** - 统一的视觉风格和交互模式
2. **灵活性** - 丰富的配置选项和扩展能力
3. **高性能** - 优化的渲染性能和打包体积
4. **易用性** - 简洁的 API 和完善的文档

## 相关资源

- [主题系统](/theme/) - 了解主题配置
- [基础架构](/base/) - 了解基础设施
- [快速开始](/guide/getting-started) - 项目快速上手
