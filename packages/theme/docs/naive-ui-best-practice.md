# Naive UI 主题最佳实践

## 官方推荐的主题模式

根据 Naive UI 官方文档，主题配置应遵循以下模式：

### 基础配置结构

```vue
<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <my-app />
  </n-config-provider>
</template>

<script>
import { darkTheme } from 'naive-ui';

// 浅色模式
const lightTheme = null; // null 或 undefined
const lightThemeOverrides = {
  common: {
    primaryColor: '#1677FF',
    // ... 其他浅色配置
  },
};

// 深色模式
const darkThemeBase = darkTheme; // 使用 Naive UI 的 darkTheme
const darkThemeOverrides = {
  common: {
    primaryColor: '#4096FF', // 深色模式下可能需要更亮的主色
    // ... 其他深色配置
  },
};
</script>
```

## 我们的实现方式

### 1. App.vue 配置

```vue
<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <!-- 应用内容 -->
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { darkTheme } from 'naive-ui';
import { useTheme, createNaiveLightTheme, createNaiveDarkTheme } from '@lee/theme';

const { config, mode } = useTheme();

// 基础主题：浅色用 null，深色用 darkTheme
const naiveTheme = computed(() => {
  return mode === 'dark' ? darkTheme : null;
});

// 主题覆盖：根据模式使用不同的函数
const themeOverrides = computed(() => {
  return mode === 'dark'
    ? createNaiveDarkTheme(config) // 深色覆盖
    : createNaiveLightTheme(config); // 浅色覆盖
});
</script>
```

### 2. 主题适配器设计

```typescript
// createNaiveLightTheme
// 为浅色模式优化，配合 theme=null 使用
export function createNaiveLightTheme(config: ThemeConfig): GlobalThemeOverrides {
  // 返回适合浅色模式的覆盖配置
  return {
    common: {
      primaryColor: config.colors.primary,
      // ... 浅色模式配置
    },
  };
}

// createNaiveDarkTheme
// 为深色模式优化，配合 theme=darkTheme 使用
export function createNaiveDarkTheme(config: ThemeConfig): GlobalThemeOverrides {
  // 返回适合深色模式的覆盖配置
  // darkTheme 已经提供了深色基础，这里只需覆盖主题色等
  return {
    common: {
      primaryColor: config.colors.primary,
      // ... 深色模式特有配置
    },
  };
}
```

## 为什么这样设计？

### 1. 遵循官方模式

- **浅色模式**：`theme=null` + 浅色覆盖
- **深色模式**：`theme=darkTheme` + 深色覆盖

### 2. 职责分离

- **darkTheme**：提供完整的深色模式基础样式
- **覆盖配置**：只负责品牌色和自定义部分

### 3. 优势

- 深色模式下，Naive UI 的 `darkTheme` 已经处理了：
  - 背景色反转
  - 文字颜色调整
  - 边框颜色适配
  - 阴影效果优化
- 我们只需要覆盖：
  - 主题色（primary、success、warning 等）
  - 特定组件的定制样式
  - 品牌相关的颜色

## 完整示例

```vue
<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <div class="app">
            <!-- 主题切换器 -->
            <n-switch v-model:value="isDark">
              <template #checked>🌙</template>
              <template #unchecked>☀️</template>
            </n-switch>

            <!-- 应用内容 -->
            <n-button type="primary">主按钮</n-button>
            <n-card>卡片内容</n-card>
          </div>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NSwitch,
  NButton,
  NCard,
  darkTheme,
} from 'naive-ui';
import { useTheme, createNaiveLightTheme, createNaiveDarkTheme } from '@lee/theme';

const { config, mode, setMode } = useTheme();

// 深色模式开关
const isDark = computed({
  get: () => mode === 'dark',
  set: value => setMode(value ? 'dark' : 'light'),
});

// Naive UI 主题配置
const naiveTheme = computed(() => (mode === 'dark' ? darkTheme : null));
const themeOverrides = computed(() =>
  mode === 'dark' ? createNaiveDarkTheme(config) : createNaiveLightTheme(config)
);
</script>
```

## 注意事项

1. **不要在浅色模式使用 darkTheme**

   ```typescript
   // ❌ 错误
   const theme = mode === 'dark' ? darkTheme : lightTheme;

   // ✅ 正确
   const theme = mode === 'dark' ? darkTheme : null;
   ```

2. **覆盖配置要区分模式**

   ```typescript
   // ❌ 错误：同一套覆盖用于两种模式
   const themeOverrides = createNaiveTheme(config);

   // ✅ 正确：不同模式用不同覆盖
   const themeOverrides =
     mode === 'dark' ? createNaiveDarkTheme(config) : createNaiveLightTheme(config);
   ```

3. **深色模式下的颜色调整**
   - 主色可能需要更亮（提高可读性）
   - 背景色让 darkTheme 处理
   - 只覆盖必要的品牌色

## 迁移指南

如果你之前使用的是单一的 `createNaiveTheme`：

```typescript
// 旧代码
const themeOverrides = computed(() => createNaiveTheme(config));

// 新代码
const naiveTheme = computed(() => (mode === 'dark' ? darkTheme : null));
const themeOverrides = computed(() =>
  mode === 'dark' ? createNaiveDarkTheme(config) : createNaiveLightTheme(config)
);
```

这样的设计更符合 Naive UI 的设计理念，能够充分利用框架提供的深色模式支持。
