# Vue Monorepo

基于 Vue 3 + TypeScript 的企业级前端 Monorepo 项目，提供完整的主题系统、UI 组件库和基础架构。

## 📦 项目结构

```
vue-monorepo/
├── packages/          # 公共包
│   ├── base/         # 基础架构（路由、布局、状态管理）
│   ├── theme/        # 主题系统（12种预设主题 + 动态主题）
│   ├── ui/           # UI 组件库
│   └── utils/        # 工具函数库
└── projects/         # 应用项目
    └── le-start/     # 示例应用
```

## 🚀 技术栈

### 核心框架

- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **pnpm workspace** - Monorepo 管理

### UI 与样式

- **Naive UI** - 组件库
- **UnoCSS** - 原子化 CSS
- **SCSS** - CSS 预处理器

### 状态与路由

- **Vue Router 4** - 路由管理
- **Pinia** - 状态管理

### 工具库

- **Lodash-es** - 工具函数
- **Day.js** - 时间处理
- **@ant-design/colors** - 色彩算法

## ✨ 核心能力

### 1. 主题系统 (`@lee/theme`)

- 🎨 **12 种预设主题**：蓝色、红色、橙色、绿色、紫色等
- 🌓 **明暗模式**：自动适配深色/浅色模式
- 🎯 **动态主题**：支持自定义颜色生成主题
- 📐 **设计 Token**：完整的设计变量系统（间距、圆角、阴影等）
- 🔄 **实时切换**：主题切换无需刷新，平滑过渡

### 2. UI 组件库 (`@lee/ui`)

- 📦 **容器组件**：LeContainer - 多种主题变体
- 🎴 **卡片组件**：LeCard - 支持标题、操作、边框等
- 💻 **代码查看器**：LeCodeViewer - 代码高亮展示
- 🎨 **SVG 图标**：LeSvgIcon - 支持 UI 级和项目级图标管理

### 3. 基础架构 (`@lee/base`)

- 🗂️ **布局系统**：AdminLayout、BasicLayout
- 🧭 **路由管理**：动态路由、路由守卫、权限控制
- 📑 **标签页系统**：多标签页管理、右键菜单
- 🎯 **菜单系统**：侧边栏菜单、自动图标渲染

### 4. 工具函数 (`@lee/utils`)

- 🛠️ **通用工具**：类型判断、对象处理、数组操作
- 🔐 **加密工具**：数据加密解密
- 📊 **格式化工具**：日期、数字、文本格式化

## 🎯 特色功能

### SVG 图标管理

- **双层级管理**：UI 公共图标 + 项目私有图标
- **自动注册**：基于 `vite-plugin-svg-icons`
- **按需加载**：只打包使用的图标
- **命名规范**：`ui-*` 公共图标，`custom-*` 项目图标

### 主题编辑器

- **可视化配置**：颜色选择器 + 实时预览
- **色阶预览**：完整的 10 级色阶展示
- **组件预览**：实时查看主题效果
- **导入导出**：支持主题配置导出

## 📝 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start:le-start
```

### 代码检查

```bash
# ESLint 检查并修复
pnpm lint

# Prettier 格式化
pnpm format

# 类型检查
pnpm type-check
```

## 🎨 主题使用

```typescript
import { useTheme } from '@lee/theme';

const { theme, mode, setTheme, setMode } = useTheme();

// 切换主题
setTheme('blue'); // blue, red, orange, green, purple...

// 切换模式
setMode('dark'); // light, dark
```

## 📦 组件使用

```vue
<script setup lang="ts">
import { LeContainer, LeCard, LeSvgIcon } from '@lee/ui';
</script>

<template>
  <LeContainer>
    <LeCard title="标题">
      <LeSvgIcon name="ui-home" :size="24" />
      内容区域
    </LeCard>
  </LeContainer>
</template>
```

## 📄 License

ISC
