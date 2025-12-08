# createNaiveDarkTheme 和 createNaiveLightTheme 使用指南

## 函数说明

这两个函数是 `createNaiveTheme` 的特定模式版本，用于确保生成对应模式的主题配置。

## 使用方法

### 方法1：使用 useTheme Hook（推荐）

```vue
<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <!-- 你的应用内容 -->
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, darkTheme, lightTheme } from 'naive-ui';
import { useTheme, createNaiveDarkTheme, createNaiveLightTheme } from '@lee/theme';

const { config, mode } = useTheme();

// 根据当前模式选择对应的 Naive UI 主题
const theme = computed(() => {
  return mode.value === 'dark' ? darkTheme : lightTheme;
});

// 根据模式选择对应的主题配置生成器
const themeOverrides = computed(() => {
  if (mode.value === 'dark') {
    return createNaiveDarkTheme(config.value);
  } else {
    return createNaiveLightTheme(config.value);
  }
});
</script>
```

### 方法2：手动创建 ThemeConfig

```typescript
import { createNaiveDarkTheme, createNaiveLightTheme } from '@lee/theme';
import { themePresets } from '@lee/theme';
import { defaultDesignTokens } from '@lee/theme';
import type { ThemeConfig } from '@lee/theme';

// 创建深色主题配置
const darkConfig: ThemeConfig = {
  name: 'blue',
  mode: 'dark',
  colors: {
    ...themePresets.blue.dark, // 使用蓝色主题的深色配置
    // 可以覆盖部分颜色
  },
  tokens: defaultDesignTokens,
};

// 生成深色 Naive UI 主题
const darkThemeOverrides = createNaiveDarkTheme(darkConfig);

// 创建浅色主题配置
const lightConfig: ThemeConfig = {
  name: 'blue',
  mode: 'light',
  colors: {
    ...themePresets.blue.light, // 使用蓝色主题的浅色配置
  },
  tokens: defaultDesignTokens,
};

// 生成浅色 Naive UI 主题
const lightThemeOverrides = createNaiveLightTheme(lightConfig);
```

### 方法3：结合主题管理器

```typescript
import { themeManager, createNaiveDarkTheme, createNaiveLightTheme } from '@lee/theme';
import { computed } from 'vue';

// 从主题管理器获取当前配置
const currentConfig = computed(() => themeManager.getConfig());

// 根据当前模式生成对应的主题
const themeOverrides = computed(() => {
  const config = currentConfig.value;

  if (config.mode === 'dark') {
    return createNaiveDarkTheme(config);
  } else {
    return createNaiveLightTheme(config);
  }
});
```

## ThemeConfig 结构

```typescript
interface ThemeConfig {
  name: ThemeName; // 主题名称：'blue' | 'red' | 'green' 等
  mode: ThemeMode; // 模式：'light' | 'dark'
  colors: ColorSystem; // 颜色系统，包含所有颜色定义
  tokens: DesignTokens; // 设计令牌，包含间距、圆角等
}
```

## 完整示例：明暗切换

```vue
<template>
  <div>
    <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
      <n-space vertical>
        <n-button @click="toggleTheme">切换到{{ isDark ? '浅色' : '深色' }}模式</n-button>

        <n-card>
          <h3>当前主题：{{ theme }} ({{ mode }}模式)</h3>
          <n-button type="primary">主按钮</n-button>
          <n-button type="info">信息按钮</n-button>
        </n-card>
      </n-space>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, NSpace, NButton, NCard, darkTheme, lightTheme } from 'naive-ui';
import { useTheme, createNaiveDarkTheme, createNaiveLightTheme } from '@lee/theme';

const { theme, mode, config, toggleMode } = useTheme();

const isDark = computed(() => mode.value === 'dark');

// Naive UI 的基础主题
const naiveTheme = computed(() => {
  return isDark.value ? darkTheme : lightTheme;
});

// 主题覆盖配置
const themeOverrides = computed(() => {
  // config.value 已经包含了当前的 mode、colors、tokens 等信息
  return isDark.value ? createNaiveDarkTheme(config.value) : createNaiveLightTheme(config.value);
});

const toggleTheme = () => {
  toggleMode(); // 切换明暗模式
};
</script>
```

## 注意事项

1. **模式匹配**：`createNaiveDarkTheme` 期望接收 `mode: 'dark'` 的配置，如果传入 `mode: 'light'` 会显示警告
2. **自动同步**：使用 `useTheme` Hook 时，config 会自动响应主题切换
3. **完整配置**：config 必须包含完整的 `colors` 和 `tokens` 属性
4. **与 createNaiveTheme 的区别**：
   - `createNaiveTheme`: 通用函数，根据 config 中的 mode 自动处理
   - `createNaiveDarkTheme`: 专门用于深色模式，会检查 mode 是否为 'dark'
   - `createNaiveLightTheme`: 专门用于浅色模式，会检查 mode 是否为 'light'

## 最简单的使用方式

如果你不需要区分明暗模式的特殊处理，直接使用 `createNaiveTheme` 即可：

```vue
<script setup lang="ts">
import { useTheme, createNaiveTheme } from '@lee/theme';

const { config } = useTheme();

// createNaiveTheme 会自动根据 config.mode 处理明暗
const themeOverrides = computed(() => createNaiveTheme(config.value));
</script>
```
