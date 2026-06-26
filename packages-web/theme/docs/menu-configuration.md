# Menu 组件主题配置指南

## 概述

从 `createNaiveTheme` 中移除了 Menu 组件的默认配置，改为使用专门的函数来处理不同场景的菜单样式。

## 为什么要分离 Menu 配置？

1. **场景差异**：不同位置的菜单需要不同的样式
   - 侧边栏菜单：深色背景，需要白色文字
   - 顶部菜单：可能是浅色背景，需要深色文字
   - 下拉菜单：需要跟随整体主题

2. **灵活性**：允许开发者根据具体场景选择合适的菜单主题

3. **可维护性**：将不同的菜单样式逻辑分离，便于维护和扩展

## 使用方法

### 1. 侧边栏菜单（白色文字）

用于深色背景的侧边栏，文字始终为白色：

```vue
<template>
  <n-config-provider :theme-overrides="menuThemeOverrides">
    <n-menu ... />
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createSidebarMenuTheme } from '@lee/theme';

const menuThemeOverrides = computed(() => ({
  Menu: createSidebarMenuTheme(),
}));
</script>
```

### 2. 普通菜单（自适应）

用于需要跟随明暗模式变化的菜单：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, createDefaultMenuTheme } from '@lee/theme';

const { config, mode } = useTheme();

const menuThemeOverrides = computed(() => ({
  Menu: createDefaultMenuTheme(config.value.colors, mode.value === 'dark'),
}));
</script>
```

### 3. 与整体主题结合

如果需要将菜单主题与其他组件主题结合：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, createNaiveTheme, createSidebarMenuTheme } from '@lee/theme';

const { config } = useTheme();

// 基础主题配置（不包含 Menu）
const baseTheme = computed(() => createNaiveTheme(config.value));

// 组合主题
const themeOverrides = computed(() => ({
  ...baseTheme.value,
  Menu: createSidebarMenuTheme(), // 或 createDefaultMenuTheme(...)
}));
</script>
```

## API 参考

### `createSidebarMenuTheme()`

创建侧边栏专用的菜单主题，白色文字。

**返回值**: `Partial<MenuThemeVars>`

**特点**:

- 文字颜色：白色系
- 背景色：白色半透明
- 适用场景：深色背景的侧边栏

### `createDefaultMenuTheme(colors, isDark)`

创建普通菜单主题，根据明暗模式自适应。

**参数**:

- `colors: ColorSystem` - 颜色系统对象
- `isDark: boolean` - 是否为暗黑模式

**返回值**: `Partial<MenuThemeVars>`

**特点**:

- 文字颜色：根据主题自适应
- 激活色：使用主题色
- 适用场景：顶部菜单、下拉菜单等

## 迁移指南

如果你之前依赖 `createNaiveTheme` 中的 Menu 配置：

### Before

```vue
<n-config-provider :theme-overrides="createNaiveTheme(config)">
  <n-menu ... />
</n-config-provider>
```

### After

```vue
<n-config-provider :theme-overrides="themeOverrides">
  <n-menu ... />
</n-config-provider>

<script setup>
const themeOverrides = computed(() => ({
  ...createNaiveTheme(config.value),
  Menu: createDefaultMenuTheme(config.value.colors, config.value.mode === 'dark'),
}));
</script>
```

## 最佳实践

1. **侧边栏**：始终使用 `createSidebarMenuTheme()`
2. **顶部菜单**：使用 `createDefaultMenuTheme()`
3. **下拉菜单**：根据背景色选择合适的主题
4. **自定义**：可以基于这两个函数进行扩展，创建自己的菜单主题
