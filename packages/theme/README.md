# @theme/ui

这是一个功能强大的主题管理包，提供统一的设计系统、多主题管理和响应式主题切换功能。

## ✨ 功能特性

- 🎨 **多主题管理** - 内置浅色、暗色、蓝色、红色、绿色等多种主题
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
│   ├── blue.ts      # 蓝色主题
│   ├── red.ts       # 红色系主题
│   └── green.ts     # 清新绿主题
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

### 内置主题列表

| 主题    | 名称       | 描述               | 适用场景                   |
| ------- | ---------- | ------------------ | -------------------------- |
| `light` | 浅色主题   | 默认的浅色主题     | 白天使用，标准办公场景     |
| `dark`  | 暗色主题   | 默认的暗色主题     | 夜间使用，弱光环境         |
| `blue`  | 蓝色主题   | 清新的蓝色调主题   | 专业、可信的商务场景       |
| `red`   | 红色系主题 | 充满活力的红色主题 | 需要强调和吸引注意力的场景 |
| `green` | 清新绿主题 | 自然的绿色调主题   | 环保、健康、自然的场景     |

### 1. 使用主题管理器

```typescript
import { themeManager } from '@theme/ui';

// 设置不同主题
themeManager.setTheme('dark'); // 暗色主题
themeManager.setTheme('blue'); // 蓝色主题
themeManager.setTheme('red'); // 红色系主题
themeManager.setTheme('green'); // 清新绿主题

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

## 🎨 CSS 变量说明

所有自定义 CSS 变量都会自动添加 `--le` 前缀，以避免与其他库的变量冲突。

### 变量名转换示例

```
定义: '--bg'       -> 实际: '--le-bg'
定义: '--primary'  -> 实际: '--le-primary'
定义: '--text'     -> 实际: '--le-text'
```

### 在 CSS 中使用

```css
/* 使用带前缀的变量名 */
.my-component {
  background-color: var(--le-bg);
  color: var(--le-text);
  border-color: var(--le-border);
  border-radius: var(--le-radius-md);
}
```

### 在 JavaScript 中获取变量

```typescript
import { getCssVarName, getCurrentTheme } from '@theme/ui';

// 获取实际的 CSS 变量名
const bgVarName = getCssVarName('--bg'); // '--le-bg'

// 获取变量值
const theme = getCurrentTheme();
const bgColor = theme.vars['--bg']; // '#ffffff'

// 或使用 useTheme
const { getCssVar } = useTheme();
const primaryColor = getCssVar('--primary');
```

### 完整的 CSS 变量列表

#### 颜色变量

- `--le-bg`, `--le-bg-soft`, `--le-bg-muted` - 背景色
- `--le-text`, `--le-text-soft`, `--le-text-muted` - 文本色
- `--le-primary`, `--le-primary-hover`, `--le-primary-active` - 主色
- `--le-success`, `--le-warning`, `--le-error`, `--le-info` - 功能色
- `--le-border`, `--le-border-soft` - 边框色

#### 尺寸变量

- `--le-radius-sm`, `--le-radius-md`, `--le-radius-lg`, `--le-radius-xl` - 圆角
- `--le-spacing-xs`, `--le-spacing-sm`, `--le-spacing-md`, `--le-spacing-lg`, `--le-spacing-xl` - 间距
- `--le-font-size-xs`, `--le-font-size-sm`, `--le-font-size-base`, `--le-font-size-lg`, `--le-font-size-xl` - 字号

#### 其他变量

- `--le-shadow-sm`, `--le-shadow-md`, `--le-shadow-lg` - 阴影
- `--le-transition-fast`, `--le-transition-base`, `--le-transition-slow` - 动画
- `--le-font-family` - 字体

## 📄 License

ISC
