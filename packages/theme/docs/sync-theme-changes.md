# 同步更新 Naive UI 主题和 CSS 变量

当调用 `initTheme`、`setTheme`、`setMode` 时，主题管理器会自动：

1. 更新内部状态
2. 应用 CSS 变量到 DOM
3. 保存到 localStorage

要让 Naive UI 主题同步更新，只需使用响应式配置即可。

## 方法1：全局配置（推荐）

在 App.vue 或根组件中配置：

```vue
<!-- App.vue -->
<template>
  <n-config-provider :theme="naiveBaseTheme" :theme-overrides="naiveThemeOverrides">
    <n-notification-provider>
      <n-message-provider>
        <n-dialog-provider>
          <!-- 你的应用 -->
          <router-view />
        </n-dialog-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  NConfigProvider,
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  darkTheme,
  lightTheme,
} from 'naive-ui';
import { useTheme, createNaiveTheme } from '@lee/theme';

const { config, mode, initTheme } = useTheme();

// 初始化主题（会同时更新 CSS 变量）
onMounted(() => {
  initTheme({
    theme: 'blue', // 初始主题
    mode: 'light', // 初始模式
  });
});

// Naive UI 基础主题（响应式）
const naiveBaseTheme = computed(() => {
  return mode === 'dark' ? darkTheme : lightTheme;
});

// Naive UI 主题覆盖（响应式）
const naiveThemeOverrides = computed(() => {
  // 当 setTheme/setMode 被调用时，config 会自动更新
  // createNaiveTheme 会基于新的 config 生成新的主题配置
  return createNaiveTheme(config);
});
</script>
```

## 方法2：创建主题切换组件

```vue
<!-- ThemeSwitch.vue -->
<template>
  <n-space>
    <!-- 主题选择 -->
    <n-select
      v-model:value="currentTheme"
      :options="themeOptions"
      @update:value="handleThemeChange"
      style="width: 120px"
    />

    <!-- 明暗切换 -->
    <n-switch v-model:value="isDark" @update:value="handleModeChange">
      <template #checked>🌙</template>
      <template #unchecked>☀️</template>
    </n-switch>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NSpace, NSelect, NSwitch } from 'naive-ui';
import { useTheme } from '@lee/theme';

const { theme, mode, setTheme, setMode } = useTheme();

const currentTheme = computed({
  get: () => theme,
  set: val => setTheme(val),
});

const isDark = computed({
  get: () => mode === 'dark',
  set: val => setMode(val ? 'dark' : 'light'),
});

const themeOptions = [
  { label: '蓝色', value: 'blue' },
  { label: '红色', value: 'red' },
  { label: '橙色', value: 'orange' },
  { label: '绿色', value: 'green' },
  { label: '紫色', value: 'purple' },
  { label: '品红', value: 'magenta' },
  { label: '青色', value: 'cyan' },
  { label: '极客蓝', value: 'geekblue' },
  { label: '火山橙', value: 'volcano' },
  { label: '金色', value: 'gold' },
  { label: '黄色', value: 'yellow' },
  { label: '青柠', value: 'lime' },
];

// 当调用这些方法时，会同时更新：
// 1. CSS 变量（自动）
// 2. Naive UI 主题（通过响应式）
const handleThemeChange = (value: string) => {
  setTheme(value); // 自动更新 CSS 变量 + Naive UI 主题
};

const handleModeChange = (value: boolean) => {
  setMode(value ? 'dark' : 'light'); // 自动更新 CSS 变量 + Naive UI 主题
};
</script>
```

## 方法3：编程式批量更新

```typescript
import { useTheme } from '@lee/theme';

const { initTheme, setTheme, setMode, toggleMode } = useTheme();

// 初始化（同时设置主题和模式）
initTheme({
  theme: 'green',
  mode: 'dark',
});
// ✅ CSS 变量自动更新
// ✅ Naive UI 主题通过响应式自动更新

// 切换主题
setTheme('purple');
// ✅ CSS 变量自动更新为紫色
// ✅ Naive UI 主题自动更新为紫色

// 切换模式
toggleMode();
// ✅ CSS 变量自动切换明暗
// ✅ Naive UI 主题自动切换明暗
```

## 原理说明

### 1. CSS 变量更新流程

```typescript
// theme-manager.ts 内部流程
setTheme(theme) → applyTheme() → applyCssVariables(cssVars)
setMode(mode) → applyTheme() → applyCssVariables(cssVars)
initTheme(options) → applyTheme() → applyCssVariables(cssVars)
```

`applyTheme()` 方法会：

- 生成新的颜色系统
- 生成 CSS 变量
- 应用到 DOM（`document.documentElement.style`）

### 2. Naive UI 主题更新流程

```typescript
// 通过 Vue 响应式系统
config 变化 → computed 重新计算 → createNaiveTheme(config) → 新的 themeOverrides
```

`useTheme()` 返回的 `config` 是响应式的，当主题或模式改变时会自动更新。

## 实际效果

当你调用 `setTheme('red')` 时：

1. **CSS 变量立即更新**：

   ```css
   :root {
     --le-primary: #f5222d;
     --le-primary-hover: #ff4d4f;
     /* ... 其他红色主题变量 */
   }
   ```

2. **Naive UI 组件立即更新**：
   - 按钮变成红色
   - 输入框聚焦边框变成红色
   - 菜单选中项变成红色
   - 所有组件使用新的主题色

## 完整示例

```vue
<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="naiveOverrides">
    <div class="app">
      <!-- 主题切换器 -->
      <div class="theme-controls">
        <n-button @click="() => setTheme('blue')">蓝色</n-button>
        <n-button @click="() => setTheme('red')">红色</n-button>
        <n-button @click="() => setTheme('green')">绿色</n-button>
        <n-button @click="toggleMode">切换明暗</n-button>
      </div>

      <!-- 展示效果 -->
      <div class="demo" :style="{ background: 'var(--le-bg-base)' }">
        <h1 :style="{ color: 'var(--le-primary)' }">主题色标题</h1>
        <n-button type="primary">Naive UI 按钮</n-button>
        <div
          :style="{
            padding: 'var(--le-spacing-lg)',
            borderRadius: 'var(--le-radius-lg)',
            background: 'var(--le-neutral-card)',
          }"
        >
          使用 CSS 变量的卡片
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { NConfigProvider, NButton, darkTheme, lightTheme } from 'naive-ui';
import { useTheme, createNaiveTheme } from '@lee/theme';

const { config, mode, initTheme, setTheme, toggleMode } = useTheme();

// 初始化
onMounted(() => {
  initTheme({ theme: 'blue', mode: 'light' });
});

// 响应式主题配置
const naiveTheme = computed(() => (mode === 'dark' ? darkTheme : lightTheme));
const naiveOverrides = computed(() => createNaiveTheme(config));
</script>

<style>
/* CSS 变量会自动更新，无需手动处理 */
.app {
  min-height: 100vh;
  background: var(--le-bg-base);
  color: var(--le-text-primary);
  transition: all 0.3s ease;
}
</style>
```

## 注意事项

1. **确保在根组件配置**：将 `n-config-provider` 放在应用最外层
2. **使用响应式配置**：使用 `computed` 确保主题配置是响应式的
3. **避免硬编码颜色**：使用 CSS 变量而不是硬编码的颜色值
4. **过渡动画**：添加 `transition` 让主题切换更平滑
