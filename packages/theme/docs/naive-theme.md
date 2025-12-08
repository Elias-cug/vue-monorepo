# Naive UI 主题集成

## Menu 组件主题配置

当前 Menu 组件使用主题色配置，适应不同的主题切换：

### 配置详情

- **文字颜色**：使用 `text.primary` 作为默认文字色
- **图标颜色**：使用 `text.secondary` 作为默认图标色
- **悬停状态**：文字和图标变为主题色 `primary`
- **激活状态**：文字和图标使用主题色 `primary`
- **背景效果**：
  - 悬停背景：主题色 5%-10% 透明度（根据明暗模式）
  - 激活背景：主题色 10%-15% 透明度（根据明暗模式）

### 使用示例

```vue
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-menu :options="menuOptions" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, createNaiveTheme } from '@lee/theme';

const { config } = useTheme();
const themeOverrides = computed(() => createNaiveTheme(config));
</script>
```

### 效果说明

Menu 组件会根据当前主题自动调整颜色：

- **蓝色主题**：悬停和激活显示蓝色
- **红色主题**：悬停和激活显示红色
- **绿色主题**：悬停和激活显示绿色
- ...以此类推

在深色模式下，背景透明度会自动调整以保证可读性。

## 其他组件配置

除了 Menu 组件，还配置了以下组件：

- **Button**：按钮组件
- **Input**：输入框组件
- **Card**：卡片组件
- **Table**：表格组件（深色模式特殊处理）
- **Dialog**：对话框组件
- **Message**：消息提示组件
- **Notification**：通知组件
- **Popover**：弹出层组件
- **Select**：选择器组件
- **DatePicker**：日期选择器组件

所有组件都会根据当前主题和模式自动调整样式。
