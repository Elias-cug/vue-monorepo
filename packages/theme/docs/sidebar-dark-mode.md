# 侧边栏暗黑模式设计说明

## 设计理念

为了提供更好的用户体验，侧边栏在不同主题模式下采用不同的背景色策略：

- **浅色模式**：使用品牌主题色作为背景，突出品牌特色
- **暗黑模式**：使用黑色系背景，减少视觉疲劳，提升阅读体验

## 实现方案

### 1. CSS 变量定义

在 `packages/theme/src/core/css-generator.ts` 中定义侧边栏背景变量：

```typescript
// 根据是否是暗黑模式决定背景色
const isDarkMode = colors.neutral.base === '#000000';
cssVars[generateCssVarName('sider-bg', prefix)] = isDarkMode ? '#1a1a1a' : colors.primaryPalette[7];
```

### 2. 背景色配置

| 模式     | CSS 变量值                 | 实际颜色             | 说明                 |
| -------- | -------------------------- | -------------------- | -------------------- |
| 浅色模式 | `colors.primaryPalette[7]` | 色阶 7（如 #0958d9） | 使用主题色的深色版本 |
| 暗黑模式 | `#1a1a1a`                  | 深黑色               | 低亮度黑色，护眼     |

### 3. 菜单文字配色

无论哪种模式，菜单文字始终使用白色系，确保在深色背景上的可读性：

```typescript
// packages/theme/src/adapters/sidebar-menu.ts
export function createSidebarMenuTheme() {
  return {
    itemTextColor: 'rgba(255, 255, 255, 0.82)', // 普通状态
    itemTextColorHover: '#ffffff', // 悬停状态
    itemTextColorActive: '#ffffff', // 激活状态
    itemTextColorActiveHover: '#ffffff', // 激活+悬停
    // ...
  };
}
```

### 4. 样式应用

在 `packages/base/src/layout/Common/GlobalSider/index.scss` 中：

```scss
.global-sider {
  background-color: var(--le-sider-bg); // 使用 CSS 变量
  transition: background-color 0.3s ease; // 平滑过渡
}
```

## 视觉效果对比

### 浅色模式

```
┌────────────────────────────────┐
│ 侧边栏（色阶 7 深色背景）        │
│ ┌────────────────┐             │
│ │ 🏠 首页        │ 白色文字    │
│ │ 📊 工作台      │             │
│ │ 📁 项目管理    │             │
│ └────────────────┘             │
└────────────────────────────────┘
```

### 暗黑模式

```
┌────────────────────────────────┐
│ 侧边栏（黑色背景 #1a1a1a）      │
│ ┌────────────────┐             │
│ │ 🏠 首页        │ 白色文字    │
│ │ 📊 工作台      │             │
│ │ 📁 项目管理    │             │
│ └────────────────┘             │
└────────────────────────────────┘
```

## 使用指南

### 在组件中使用

```vue
<template>
  <div class="global-sider">
    <n-config-provider :theme-overrides="menuThemeOverrides">
      <n-menu ... />
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createSidebarMenuTheme } from '@lee/theme';

// 使用侧边栏专用主题
const menuThemeOverrides = computed(() => ({
  Menu: createSidebarMenuTheme(),
}));
</script>

<style lang="scss" scoped>
.global-sider {
  background-color: var(--le-sider-bg);
  transition: background-color 0.3s ease;
}
</style>
```

## 主题切换颜色值

### 蓝色主题

| 模式 | 侧边栏背景 | 说明             |
| ---- | ---------- | ---------------- |
| 浅色 | #0958d9    | 色阶 7（深蓝色） |
| 暗黑 | #1a1a1a    | 黑色系           |

### 红色主题

| 模式 | 侧边栏背景 | 说明             |
| ---- | ---------- | ---------------- |
| 浅色 | #cf1322    | 色阶 7（深红色） |
| 暗黑 | #1a1a1a    | 黑色系           |

### 绿色主题

| 模式 | 侧边栏背景 | 说明             |
| ---- | ---------- | ---------------- |
| 浅色 | #389e0d    | 色阶 7（深绿色） |
| 暗黑 | #1a1a1a    | 黑色系           |

## 优势

1. **视觉层次**：色阶 7 作为深色版本，与主内容区形成明显对比
2. **品牌一致**：仍保持主题色系，比纯主色更沉稳专业
3. **护眼设计**：暗黑模式降低亮度，减少长时间使用的视觉疲劳
4. **平滑过渡**：CSS transition 确保模式切换时的流畅体验
5. **可读性强**：深色背景配合白色文字，对比度高，易于阅读

## 测试

可以打开测试文件 `packages/theme/test/sider-dark-mode.html` 在浏览器中查看效果。
