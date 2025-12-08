# 主题 Label 字段说明

## 概述

为了让主题名称更加友好和易于管理，我们为每个主题预设添加了 `label` 字段，用于配置主题的显示名称。

## 数据结构

### ThemePreset 接口

```typescript
export interface ThemePreset {
  name: ThemeName; // 主题的标识名称（英文）
  label: string; // 主题的显示名称（中文）
  primaryColor: string; // 主题的主色值
  light: Partial<ColorSystem>; // 浅色模式配置
  dark: Partial<ColorSystem>; // 深色模式配置
}
```

## 主题标签对照表

| name (标识) | label (显示名称) | primaryColor (主色) |
| ----------- | ---------------- | ------------------- |
| blue        | 蓝色             | #1677FF             |
| red         | 红色             | #F5222D             |
| orange      | 橙色             | #FA8C16             |
| green       | 绿色             | #52C41A             |
| purple      | 紫色             | #722ED1             |
| magenta     | 品红             | #EB2F96             |
| cyan        | 青色             | #13C2C2             |
| geekblue    | 极客蓝           | #2F54EB             |
| volcano     | 火山橙           | #FA541C             |
| gold        | 金色             | #FAAD14             |
| yellow      | 黄色             | #FADB14             |
| lime        | 青柠             | #A0D911             |

## 使用方式

### 1. 在主题预设中定义

```typescript
// src/themes/presets.ts
export const themePresets = {
  blue: {
    name: 'blue',
    label: '蓝色', // 添加 label 字段
    primaryColor: presetPrimaryColors.blue,
    light: generateColorSystem(colors.blue, false),
    dark: generateColorSystem(colors.blueDark, true),
  },
  // ... 其他主题
};
```

### 2. 在组件中使用

```vue
<script setup lang="ts">
import { themePresets } from '@lee/theme';

// 获取主题选项
const themeOptions = computed(() => {
  return Object.entries(themePresets).map(([name, preset]) => ({
    name,
    label: preset.label, // 使用预设中的 label
    color: preset.primaryColor,
  }));
});
</script>

<template>
  <div v-for="theme in themeOptions" :key="theme.name">
    <span>{{ theme.label }}</span>
    <!-- 显示中文名称 -->
  </div>
</template>
```

## 优势

### 1. 集中管理

所有主题的显示名称都在主题预设中统一配置，避免分散在各个组件中。

### 2. 类型安全

通过 TypeScript 接口约束，确保每个主题都有 label 字段。

### 3. 易于维护

修改主题名称只需要在一个地方更新，所有使用的地方都会自动同步。

### 4. 国际化支持

未来可以轻松扩展为多语言支持：

```typescript
interface ThemePreset {
  name: ThemeName;
  label: string | Record<string, string>; // 支持多语言
  // 例如：label: { zh: '蓝色', en: 'Blue' }
}
```

## 迁移指南

如果你之前在组件中硬编码了主题名称：

```typescript
// ❌ 旧方式：硬编码
const labels: Record<string, string> = {
  blue: '蓝色',
  red: '红色',
  // ...
};
const label = labels[theme.name] || theme.name;

// ✅ 新方式：使用 label 字段
const label = preset.label;
```

## 注意事项

1. **向后兼容**：如果某个主题没有 label 字段，可以降级使用 name

   ```typescript
   const label = preset.label || preset.name;
   ```

2. **保持一致**：确保所有主题预设都有 label 字段，避免遗漏

3. **命名规范**：label 应该是用户友好的显示名称，通常使用中文
