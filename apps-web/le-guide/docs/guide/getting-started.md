# 快速开始

本指南将帮助你快速搭建和运行 Vue Monorepo 项目。

## 前置要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本
- **编辑器**: 推荐使用 VSCode

## 安装

### 1. 克隆仓库

```bash
# 使用 HTTPS
git clone https://github.com/Elias-cug/vue-monorepo.git

# 或使用 SSH
git clone git@github.com:Elias-cug/vue-monorepo.git

# 进入项目目录
cd vue-monorepo
```

### 2. 安装依赖

使用 pnpm 安装所有依赖：

```bash
# 安装所有包的依赖
pnpm install

# 或使用简写
pnpm i
```

::: tip 提示
项目使用 pnpm workspace 管理多包，所有依赖都会自动安装到正确的位置。
:::

### 3. 启动开发服务器

```bash
# 启动 le-start 项目
pnpm --filter le-start dev

# 或进入项目目录启动
cd apps-web/le-start
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看运行效果。

## 项目结构

```
vue-monorepo/
├── packages-web/           # 公共包
│   ├── base/          # 基础架构包
│   ├── theme/         # 主题系统包
│   ├── ui/            # UI 组件库
│   └── utils/         # 工具函数包
├── apps-web/          # 应用项目
│   ├── le-start/      # 示例项目
│   └── le-guide/      # 文档项目
├── package.json       # 根配置文件
├── pnpm-workspace.yaml # workspace 配置
└── tsconfig.base.json # TypeScript 基础配置
```

## 开发命令

### 常用命令

```bash
# 安装依赖到根目录
pnpm add -w <package-name>

# 安装依赖到指定包
pnpm --filter @lee/base add <package-name>

# 运行指定项目
pnpm --filter le-start dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

### 包管理

```bash
# 创建新的包
mkdir packages-web/new-package
cd packages-web/new-package
pnpm init

# 添加包依赖
pnpm add @lee/base @lee/theme

# 链接本地包
pnpm link @lee/ui
```

## 主题切换

项目内置了 12 种主题色，支持明暗模式：

```typescript
import { useTheme } from '@lee/theme';

const { setTheme, setMode } = useTheme();

// 切换主题
setTheme('blue'); // 蓝色主题
setTheme('green'); // 绿色主题

// 切换模式
setMode('dark'); // 深色模式
setMode('light'); // 浅色模式
```

## 使用组件

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue';
import UI from '@lee/ui';
import '@lee/ui/dist/style.css';

const app = createApp(App);
app.use(UI);
```

### 按需引入

```vue
<template>
  <LeCard title="示例卡片">
    <p>卡片内容</p>
  </LeCard>
</template>

<script setup lang="ts">
import { LeCard } from '@lee/ui';
</script>
```

## 配置代理

如果需要配置开发环境的代理，修改 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

## 环境变量

创建 `.env.local` 文件配置环境变量：

```bash
# API 地址
VITE_API_URL=http://localhost:3000/api

# 应用标题
VITE_APP_TITLE=Vue Monorepo

# 主题配置
VITE_DEFAULT_THEME=blue
VITE_DEFAULT_MODE=light
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

## 下一步

- 📖 阅读[项目结构](./project-structure)了解详细架构
- 🎨 探索[主题系统](/theme/)自定义界面风格
- 🧩 查看[组件文档](/ui/)使用 UI 组件
- 🚀 学习[部署指南](./deployment)发布应用

## 获取帮助

如果你遇到问题：

1. 查看[常见问题](/guide/faq)
2. 在 [GitHub Issues](https://github.com/Elias-cug/vue-monorepo/issues) 提交问题
3. 加入我们的[社区讨论](https://github.com/Elias-cug/vue-monorepo/discussions)

::: info 提示
确保你使用的是推荐的 Node.js 和 pnpm 版本，这能避免大多数环境问题。
:::
