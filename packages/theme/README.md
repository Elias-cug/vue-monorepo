# @lee/theme

强大的主题管理系统，基于 Ant Design 色板，提供多套主题色、明暗模式切换、设计 Token 系统和 Naive UI 深度集成。

## ✨ 功能特性

- 🎨 **12 套主题色** - blue, red, orange, green, purple, magenta, cyan, geekblue, volcano, gold, yellow, lime
- 🌙 **明暗模式** - 每套主题自动生成 light 和 dark 两种模式
- 📐 **设计 Token** - 完整的间距、圆角、字体、阴影等设计规范
- 🔄 **响应式切换** - 实时主题切换，无需刷新页面
- 💾 **持久化存储** - 自动保存用户主题选择到 localStorage
- 🌈 **CSS 变量系统** - 自动生成并应用 CSS 变量到 DOM
- 🌟 **Naive UI 适配** - 深度集成 Naive UI，完美适配所有组件
- 🤝 **Vue 3 Hook** - 提供完整的 useTheme 组合式 API
- 🎯 **TypeScript** - 完善的类型支持

## 📁 目录结构

```
src/
├── types/           # 类型定义
│   ├── theme.ts     # 主题系统类型
│   └── presets.ts   # 色板类型定义
├── core/            # 核心功能
│   ├── theme-manager.ts  # 主题管理器
│   └── css-generator.ts  # CSS 变量生成器
├── themes/          # 主题配置
│   └── presets.ts   # 预设主题（12套）
├── presets/         # Ant Design 色板
│   └── index.ts     # 颜色定义和导出
├── tokens/          # 设计 Token
│   └── design.ts    # 间距、圆角、字体等
├── adapters/        # 框架适配器
│   └── naive.ts     # Naive UI 主题适配
├── composables/     # Vue 组合式 API
│   └── useTheme.ts  # 主题 Hook
└── index.ts         # 主入口
```

## 🚀 快速开始

### 安装

```bash
pnpm add @lee/theme
```

### 在 Vue 应用中使用

```typescript
// main.ts 或 App.vue
import { useTheme } from '@lee/theme';

// 初始化主题
const { initTheme } = useTheme();
initTheme({ theme: 'blue', mode: 'light' });
```

## 📚 使用指南

### 内置主题列表（12套）

| 主题       | 颜色值  | 描述         | 适用场景         |
| ---------- | ------- | ------------ | ---------------- |
| `blue`     | #1677FF | 专业蓝色主题 | 商务、企业应用   |
| `red`      | #F5222D | 热情红色主题 | 促销、警示场景   |
| `orange`   | #FA8C16 | 活力橙色主题 | 创意、活动页面   |
| `green`    | #52C41A | 自然绿色主题 | 环保、健康领域   |
| `purple`   | #722ED1 | 神秘紫色主题 | 创新、科技产品   |
| `magenta`  | #EB2F96 | 品红色主题   | 时尚、美妆行业   |
| `cyan`     | #13C2C2 | 青色主题     | 清新、海洋风格   |
| `geekblue` | #2F54EB | 极客蓝主题   | 开发者、技术平台 |
| `volcano`  | #FA541C | 火山橙主题   | 能量、运动品牌   |
| `gold`     | #FAAD14 | 金色主题     | 财务、金融应用   |
| `yellow`   | #FADB14 | 明黄色主题   | 儿童、教育产品   |
| `lime`     | #A0D911 | 青柠主题     | 生态、有机产品   |

每套主题都自动包含 **light** 和 **dark** 两种模式。

### 1. 使用 useTheme Hook

```vue
<template>
  <div>
    <button @click="setTheme('blue')">蓝色主题</button>
    <button @click="setTheme('green')">绿色主题</button>
    <button @click="toggleMode()">切换明暗</button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@lee/theme';

const {
  theme, // 当前主题名
  mode, // 当前模式（light/dark）
  config, // 完整配置
  cssVars, // CSS 变量
  setTheme, // 设置主题
  setMode, // 设置模式
  toggleMode, // 切换明暗
  getCssVar, // 获取单个变量
} = useTheme();

// 切换主题
setTheme('purple'); // 切换到紫色主题

// 切换模式
setMode('dark'); // 深色模式
toggleMode(); // 明暗切换

// 获取 CSS 变量
const primaryColor = getCssVar('primary');
</script>
```

### 2. Naive UI 集成（官方推荐方式）

```vue
<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-button type="primary">主按钮</n-button>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { darkTheme } from 'naive-ui';
import { useTheme, createNaiveLightTheme, createNaiveDarkTheme } from '@lee/theme';

const { config, mode } = useTheme();

// 基础主题：浅色模式用 null，深色模式用 darkTheme
const theme = computed(() => {
  return mode === 'dark' ? darkTheme : null;
});

// 主题覆盖：根据模式使用不同的配置
const themeOverrides = computed(() => {
  return mode === 'dark'
    ? createNaiveDarkTheme(config) // 深色模式覆盖
    : createNaiveLightTheme(config); // 浅色模式覆盖
});
</script>
```

**为什么这样设计？**

- 符合 Naive UI 官方推荐的模式
- 深色模式下，`darkTheme` 提供完整的深色基础
- 覆盖配置只需处理品牌色和自定义部分

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
  background-color: var(--le-bg-base);
  color: var(--le-text-primary);
  border-color: var(--le-border-base);
  border-radius: var(--le-radius-md);
  padding: var(--le-spacing-lg);
  box-shadow: var(--le-shadow-md);
}
```

### 在 JavaScript 中获取变量

```typescript
import { useTheme } from '@lee/theme';

const { getCssVar, getAllCssVars } = useTheme();

// 获取单个变量
const primaryColor = getCssVar('primary'); // 自动添加 --le- 前缀
const bgColor = getCssVar('bg-base'); // 获取背景色

// 获取所有变量
const allVars = getAllCssVars();
console.log(allVars['--le-primary']);
```

## 📆 设计 Token 系统

### 间距系统 (Spacing)

| Token | 值   | CSS 变量            |
| ----- | ---- | ------------------- |
| xs    | 4px  | `--le-spacing-xs`   |
| sm    | 8px  | `--le-spacing-sm`   |
| md    | 12px | `--le-spacing-md`   |
| lg    | 16px | `--le-spacing-lg`   |
| xl    | 20px | `--le-spacing-xl`   |
| xxl   | 24px | `--le-spacing-xxl`  |
| xxxl  | 32px | `--le-spacing-xxxl` |

### 圆角系统 (Radius)

| Token | 值   | CSS 变量            |
| ----- | ---- | ------------------- |
| xs    | 2px  | `--le-radius-xs`    |
| sm    | 4px  | `--le-radius-sm`    |
| md    | 6px  | `--le-radius-md`    |
| lg    | 8px  | `--le-radius-lg`    |
| xl    | 12px | `--le-radius-xl`    |
| xxl   | 16px | `--le-radius-xxl`   |
| round | 50%  | `--le-radius-round` |

### 字体大小 (Font Size)

| Token   | 值   | CSS 变量                 |
| ------- | ---- | ------------------------ |
| xs      | 12px | `--le-font-size-xs`      |
| sm      | 14px | `--le-font-size-sm`      |
| md      | 16px | `--le-font-size-md`      |
| lg      | 18px | `--le-font-size-lg`      |
| xl      | 20px | `--le-font-size-xl`      |
| xxl     | 24px | `--le-font-size-xxl`     |
| xxxl    | 32px | `--le-font-size-xxxl`    |
| display | 48px | `--le-font-size-display` |

### 颜色变量

#### 主色系统

- `--le-primary`, `--le-primary-hover`, `--le-primary-active`, `--le-primary-suppl`

#### 功能色

- `--le-info`, `--le-info-hover`, `--le-info-active`, `--le-info-suppl`
- `--le-success`, `--le-success-hover`, `--le-success-active`, `--le-success-suppl`
- `--le-warning`, `--le-warning-hover`, `--le-warning-active`, `--le-warning-suppl`
- `--le-error`, `--le-error-hover`, `--le-error-active`, `--le-error-suppl`

#### 中性色

- `--le-neutral-base`, `--le-neutral-invert-base`
- `--le-neutral-card`, `--le-neutral-modal`, `--le-neutral-popover`
- `--le-neutral-body`

#### 文本色

- `--le-text-base`, `--le-text-primary`, `--le-text-secondary`
- `--le-text-tertiary`, `--le-text-disabled`, `--le-text-inverse`

#### 边框色

- `--le-border-base`, `--le-border-light`, `--le-border-dark`

#### 背景色

- `--le-bg-base`, `--le-bg-container`, `--le-bg-elevated`
- `--le-bg-section`, `--le-bg-hover`, `--le-bg-active`, `--le-bg-disabled`

#### 其他

- `--le-divider` - 分割线颜色
- `--le-mask` - 遮罩层颜色
- `--le-code` - 代码块背景色
- `--le-font-family` - 字体

## 📄 License

ISC
