# 主题系统概览

Theme 包提供了一套完整的主题解决方案，支持多主题切换、明暗模式、动态主题生成、CSS 变量系统等功能。

## 核心特性

- 🎨 **12 种预设主题** - 精心设计的主题色彩方案
- 🌓 **明暗模式** - 每个主题都支持浅色和深色模式
- 🎯 **CSS 变量系统** - 完整的设计令牌和 CSS 变量
- 🔄 **动态主题** - 支持运行时动态生成主题
- 📦 **Naive UI 集成** - 与 Naive UI 组件库完美集成
- 💾 **持久化** - 自动保存用户的主题偏好

## 快速体验

<div class="theme-demo">
  <div class="theme-grid">
    <div v-for="theme in themes" :key="theme.name" 
         class="theme-card" 
         :style="`--theme-color: ${theme.color}`"
         @click="applyTheme(theme.name)">
      <div class="theme-preview"></div>
      <div class="theme-name">{{ theme.label }}</div>
    </div>
  </div>
</div>

## 预设主题

### 基础主题

| 主题     | 描述     | 主色值  | 场景                     |
| -------- | -------- | ------- | ------------------------ |
| `blue`   | 蓝色主题 | #1677ff | 专业、可信赖的商务场景   |
| `red`    | 红色主题 | #f5222d | 需要引起注意、紧急的场景 |
| `green`  | 绿色主题 | #52c41a | 环保、健康、成功的场景   |
| `orange` | 橙色主题 | #fa8c16 | 活力、创意、年轻化场景   |
| `purple` | 紫色主题 | #722ed1 | 创新、神秘、高端场景     |

### 扩展主题

| 主题      | 描述     | 主色值  | 场景             |
| --------- | -------- | ------- | ---------------- |
| `cyan`    | 青色主题 | #13c2c2 | 科技、清新的场景 |
| `magenta` | 品红主题 | #eb2f96 | 时尚、个性化场景 |
| `volcano` | 火山橙   | #fa541c | 热情、能量的场景 |
| `gold`    | 金色主题 | #faad14 | 高贵、财富的场景 |
| `lime`    | 青柠主题 | #a0d911 | 自然、有机的场景 |

## 主题结构

每个主题包含以下要素：

```typescript
interface ThemeConfig {
  // 基础信息
  name: string; // 主题名称
  label: string; // 显示标签
  primaryColor: string; // 主色

  // 颜色系统
  colors: {
    primary: string; // 主色
    primaryPalette: {
      // 10 级色阶
      1: string; // 最浅
      // ...
      10: string; // 最深
    };

    // 功能色
    info: string;
    success: string;
    warning: string;
    error: string;

    // 中性色
    text: TextColors;
    background: BackgroundColors;
    border: BorderColors;
  };

  // 设计令牌
  tokens: {
    spacing: SpacingTokens;
    radius: RadiusTokens;
    shadow: ShadowTokens;
    fontSize: FontSizeTokens;
    // ...
  };
}
```

## CSS 变量

主题系统会自动生成并应用 CSS 变量：

### 颜色变量

```css
/* 主题色 */
--le-primary: #1677ff;
--le-primary-hover: #4096ff;
--le-primary-active: #0958d9;
--le-primary-1: #e6f4ff;
/* ... --le-primary-2 到 --le-primary-10 */

/* 功能色 */
--le-info: #1677ff;
--le-success: #52c41a;
--le-warning: #faad14;
--le-error: #ff4d4f;

/* 文本色 */
--le-text-1: rgba(0, 0, 0, 0.88);
--le-text-2: rgba(0, 0, 0, 0.65);
--le-text-3: rgba(0, 0, 0, 0.45);
```

### 设计令牌

```css
/* 间距 */
--le-spacing-xs: 4px;
--le-spacing-sm: 8px;
--le-spacing-md: 16px;
--le-spacing-lg: 24px;

/* 圆角 */
--le-radius-xs: 2px;
--le-radius-sm: 4px;
--le-radius-md: 6px;
--le-radius-lg: 8px;

/* 阴影 */
--le-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.05);
--le-shadow-2: 0 4px 6px rgba(0, 0, 0, 0.07);
--le-shadow-3: 0 10px 15px rgba(0, 0, 0, 0.1);
```

## 使用方式

### 在 Vue 中使用

```vue
<template>
  <div class="theme-example">
    <h2>当前主题：{{ theme }}</h2>
    <h3>当前模式：{{ mode }}</h3>

    <!-- 使用 CSS 变量 -->
    <div class="primary-box">主色块</div>

    <!-- 主题切换 -->
    <select @change="handleThemeChange">
      <option v-for="t in themeList" :key="t" :value="t">
        {{ t }}
      </option>
    </select>

    <!-- 模式切换 -->
    <button @click="toggleMode">
      {{ mode === 'light' ? '🌙' : '☀️' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme, themePresets } from '@lee/theme';

const { theme, mode, setTheme, toggleMode } = useTheme();
const themeList = Object.keys(themePresets);

function handleThemeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  setTheme(value);
}
</script>

<style scoped>
.primary-box {
  background: var(--le-primary);
  color: white;
  padding: var(--le-spacing-md);
  border-radius: var(--le-radius-md);
  box-shadow: var(--le-shadow-2);
}
</style>
```

### 在 CSS 中使用

```css
/* 使用主题变量 */
.card {
  background: var(--le-card);
  border: 1px solid var(--le-border);
  border-radius: var(--le-radius-lg);
  padding: var(--le-spacing-lg);
  box-shadow: var(--le-shadow-1);
}

.card:hover {
  box-shadow: var(--le-shadow-2);
  border-color: var(--le-primary-3);
}

.card-title {
  color: var(--le-text-1);
  font-size: var(--le-font-size-lg);
  margin-bottom: var(--le-spacing-md);
}

.card-content {
  color: var(--le-text-2);
  line-height: var(--le-line-height-relaxed);
}

/* 响应明暗模式 */
.button {
  background: var(--le-primary);
  color: var(--le-text-invert);
}

.button:hover {
  background: var(--le-primary-hover);
}

.button:active {
  background: var(--le-primary-active);
}
```

## 与 Naive UI 集成

主题系统完美支持 Naive UI 组件库：

```vue
<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-button type="primary">主按钮</n-button>
    <n-card title="卡片标题">卡片内容</n-card>
  </n-config-provider>
</template>

<script setup>
import { darkTheme, lightTheme } from 'naive-ui';
import { useTheme, createNaiveTheme } from '@lee/theme';

const { mode, config } = useTheme();

const naiveTheme = computed(() => (mode.value === 'dark' ? darkTheme : lightTheme));

const themeOverrides = computed(() => createNaiveTheme(config.value));
</script>
```

## 性能优化

### 1. CSS 变量作用域

主题变量默认应用在 `:root`，但也可以局部应用：

```css
/* 全局主题 */
:root {
  /* 自动应用的主题变量 */
}

/* 局部主题 */
.custom-theme {
  --le-primary: #722ed1;
  --le-primary-hover: #9254de;
}
```

### 2. 主题切换过渡

添加过渡效果让主题切换更流畅：

```css
* {
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s,
    box-shadow 0.3s;
}
```

### 3. 避免重复计算

使用 computed 缓存主题相关计算：

```typescript
const primaryLight = computed(() => config.value.colors.primaryPalette?.[1]);

const isDarkMode = computed(() => mode.value === 'dark');
```

## 进阶功能

- [动态主题生成](/theme/dynamic-theme) - 根据颜色实时生成主题
- [主题编辑器](/theme/theme-editor) - 可视化编辑和导出主题
- [自定义主题](/theme/custom-theme) - 创建完全自定义的主题
- [主题继承](/theme/theme-inheritance) - 基于现有主题扩展

## 相关链接

- [CSS 变量参考](/theme/css-variables)
- [设计令牌](/theme/design-tokens)
- [API 文档](/api/theme)
- [示例项目](https://github.com/your-repo/vue-monorepo)

<script setup>
import { ref } from 'vue';

const themes = [
  { name: 'blue', label: '蓝色', color: '#1677ff' },
  { name: 'red', label: '红色', color: '#f5222d' },
  { name: 'green', label: '绿色', color: '#52c41a' },
  { name: 'orange', label: '橙色', color: '#fa8c16' },
  { name: 'purple', label: '紫色', color: '#722ed1' },
  { name: 'cyan', label: '青色', color: '#13c2c2' },
  { name: 'magenta', label: '品红', color: '#eb2f96' },
  { name: 'volcano', label: '火山', color: '#fa541c' }
];

function applyTheme(name) {
  // 这里实际不会生效，仅作演示
  console.log('Apply theme:', name);
}
</script>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.theme-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}

.theme-card:hover {
  transform: translateY(-2px);
}

.theme-preview {
  width: 100%;
  height: 60px;
  background: var(--theme-color);
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-name {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
