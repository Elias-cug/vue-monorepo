# @theme/ui

这是一个功能强大的主题管理包，提供统一的设计系统、多主题管理和响应式主题切换功能。

## ✨ 功能特性

- 🎨 **多主题管理** - 内置浅色、暗色、蓝色等多种主题
- 🔄 **响应式切换** - 支持实时主题切换和自动模式
- 💾 **主题持久化** - 自动保存用户主题选择
- 🔧 **CSS 变量系统** - 完整的 CSS 变量支持
- 🌈 **调色板系统** - 灵活的颜色管理
- 🌟 **Naive UI 集成** - 深度集成 Naive UI 组件库
- 🧩 **颜色工具** - 丰富的颜色处理函数
- 🎯 **TypeScript** - 完善的类型支持

## 📁 目录结构

```
src/
├── types/           # 类型定义
├── core/            # 核心功能
│   ├── ThemeManager.ts    # 主题管理器
│   └── createTheme.ts     # 主题创建工具
├── themes/          # 主题定义
│   ├── light.ts     # 浅色主题
│   ├── dark.ts      # 暗色主题
│   └── blue.ts      # 蓝色主题
├── composables/     # Vue 组合式 API
│   └── useTheme.ts  # 主题 Hook
├── utils/           # 工具函数
│   ├── index.ts     # 主题工具
│   └── color.ts     # 颜色工具
├── palette/         # 调色板
├── tokens/          # 设计令牌
├── css-vars/        # CSS 变量生成
├── naive/           # Naive UI 集成
└── index.ts         # 主入口
```

## 🚀 快速开始

### 安装

```bash
pnpm add @theme/ui
```

### 在 Vue 应用中使用

```typescript
// main.ts
import { createApp } from 'vue';
import themeManager from '@theme/ui';

const app = createApp(App);

// 注册主题管理器插件
app.use(themeManager);
```

## 📚 使用指南

### 1. 使用主题管理器

```typescript
import { themeManager } from '@theme/ui';

// 设置主题
themeManager.setTheme('dark');

// 切换主题（亮/暗）
themeManager.toggle();

// 设置主题模式
themeManager.setMode('auto'); // 'light' | 'dark' | 'auto'

// 获取当前主题
const currentTheme = themeManager.currentTheme;

// 监听主题变化
const unsubscribe = themeManager.on('change', theme => {
  console.log('主题已切换到:', theme.name);
});
```

## 📄 License

ISC
